import { YoutubeTranscript } from "youtube-transcript";

// Keep all YouTube requests bounded, including the library's HTML fallback.
export function youtubeFetch(fetcher: typeof fetch = fetch): typeof fetch {
  return async (input, init) => {
    const url = new URL(
      input instanceof Request ? input.url : input.toString(),
    );
    if (url.pathname === "/api/timedtext") {
      // srv1 timestamps are seconds; the library returns srv3 timestamps in ms.
      url.searchParams.set("fmt", "srv1");
    }
    const response = await fetcher(url, {
      ...init,
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(
        `YouTube request failed (HTTP ${response.status}). Please try again later.`,
      );
    }
    return response;
  };
}

export async function getTranscript(id: string, fetcher: typeof fetch = fetch) {
  const transcript = await YoutubeTranscript.fetchTranscript(id, {
    fetch: youtubeFetch(fetcher),
  });
  if (!transcript.length || !transcript.some((line) => line.text.trim())) {
    throw new Error(
      "YouTube returned an empty transcript. Please try again later.",
    );
  }
  return transcript;
}

interface PlayerResponse {
  playabilityStatus?: { status?: string; reason?: string };
  videoDetails?: {
    title: string;
    author: string;
    channelId: string;
    shortDescription?: string;
    keywords?: string[];
    viewCount?: string;
    lengthSeconds?: string;
    thumbnail?: { thumbnails: { url: string }[] };
  };
}

/**
 * Fetches video metadata from YouTube's InnerTube player endpoint with the Android client.
 * Maps the response to the fields used by the details panel.
 *
 * @param id - YouTube video ID.
 * @param fetcher - Fetch implementation. Defaults to the global fetch function.
 * @returns Video metadata with a channel URL and duration formatted as m:ss or h:mm:ss.
 * @throws If the request fails, the response is invalid JSON, or the video has no title.
 */
export async function getDetails(id: string, fetcher: typeof fetch = fetch) {
  const response = await youtubeFetch(fetcher)(
    "https://www.youtube.com/youtubei/v1/player?prettyPrint=false",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "com.google.android.youtube/20.10.38 (Linux; U; Android 14)",
      },
      body: JSON.stringify({
        context: {
          client: { clientName: "ANDROID", clientVersion: "20.10.38" },
        },
        videoId: id,
      }),
    },
  );

  const player: PlayerResponse = await response.json();
  const video = player.videoDetails;

  if (!video?.title) {
    throw new Error(
      player.playabilityStatus?.reason ??
        "Video details unable to be retrieved.",
    );
  }

  // Include hours only for videos at least an hour long.
  const seconds = Number(video.lengthSeconds ?? 0);
  const durationFormatted = [
    ...(seconds >= 3600 ? [Math.floor(seconds / 3600)] : []),
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ]
    .map((part, index) =>
      index === 0 ? String(part) : String(part).padStart(2, "0"),
    )
    .join(":");

  return {
    title: video.title,
    channel: {
      name: video.author,
      url: `https://www.youtube.com/channel/${video.channelId}`,
    },
    tags: video.keywords ?? [],
    thumbnail: video.thumbnail?.thumbnails.at(-1),
    views: Number(video.viewCount ?? 0),
    durationFormatted,
    description: video.shortDescription ?? "",
  };
}
