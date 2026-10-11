import assert from "node:assert/strict";
import { test } from "node:test";
import { getDetails, getTranscript } from "./youtube";

const captions = {
  playerCaptionsTracklistRenderer: {
    captionTracks: [
      {
        languageCode: "en",
        baseUrl: "https://www.youtube.com/api/timedtext?v=test&fmt=srv3",
      },
    ],
  },
};

test("retrieves captions through InnerTube with timestamps in seconds", async () => {
  const urls: URL[] = [];
  const fetcher: typeof fetch = async (input, init) => {
    const url = new URL(String(input));
    urls.push(url);
    assert.equal(init?.cache, "no-store");
    assert.ok(init?.signal);
    if (url.pathname === "/youtubei/v1/player") {
      assert.equal(init?.method, "POST");
      assert.equal(JSON.parse(String(init?.body)).videoId, "RiO6yDxDui4");
      return Response.json({ captions });
    }
    assert.equal(url.searchParams.get("fmt"), "srv1");
    return new Response(
      "<transcript><text start=\"0.48\" dur=\"3.52\">They say &amp; we agree</text></transcript>",
    );
  };
  assert.deepEqual(await getTranscript("RiO6yDxDui4", fetcher), [
    { text: "They say & we agree", offset: 0.48, duration: 3.52, lang: "en" },
  ]);
  assert.equal(urls.length, 2);
});

test("falls back to the watch page when InnerTube has no captions", async () => {
  const fetcher: typeof fetch = async (input) => {
    const url = new URL(String(input));
    if (url.pathname === "/youtubei/v1/player") return Response.json({});
    if (url.pathname === "/watch") {
      return new Response(
        `var ytInitialPlayerResponse = ${JSON.stringify({ playabilityStatus: { status: "OK" }, captions })};`,
      );
    }
    return new Response(
      "<text start=\"12.5\" dur=\"1.5\">Fallback captions</text>",
    );
  };
  assert.equal((await getTranscript("RiO6yDxDui4", fetcher))[0]?.offset, 12.5);
});

test("rejects an empty caption response instead of offering an empty summary", async () => {
  const fetcher: typeof fetch = async (input) =>
    String(input).includes("/player")
      ? Response.json({ captions })
      : new Response("");
  await assert.rejects(
    getTranscript("RiO6yDxDui4", fetcher),
    /empty transcript/,
  );
});

test("reports videos with no captions", async () => {
  const fetcher: typeof fetch = async (input) =>
    String(input).includes("/player")
      ? Response.json({})
      : new Response(
        "var ytInitialPlayerResponse = {\"playabilityStatus\":{\"status\":\"OK\"}};",
      );
  await assert.rejects(
    getTranscript("RiO6yDxDui4", fetcher),
    /Transcript is disabled/,
  );
});

test("reports HTTP failures instead of treating them as missing captions", async () => {
  const fetcher: typeof fetch = async () => new Response("", { status: 429 });
  await assert.rejects(getTranscript("RiO6yDxDui4", fetcher), /HTTP 429/);
});

test("maps video metadata without the obsolete HTML parser", async () => {
  const fetcher: typeof fetch = async () =>
    Response.json({
      videoDetails: {
        title: "Example video",
        author: "Example channel",
        channelId: "UC123",
        lengthSeconds: "3661",
        viewCount: "1234",
        shortDescription: "Description",
        keywords: ["example"],
        thumbnail: { thumbnails: [{ url: "https://i.ytimg.com/example.jpg" }] },
      },
    });
  const details = await getDetails("RiO6yDxDui4", fetcher);
  assert.equal(details.title, "Example video");
  assert.equal(details.durationFormatted, "1:01:01");
  assert.equal(details.views, 1234);
  assert.equal(details.channel.url, "https://www.youtube.com/channel/UC123");
});

test("surfaces unavailable video metadata", async () => {
  const fetcher: typeof fetch = async () =>
    Response.json({
      playabilityStatus: { status: "ERROR", reason: "Video unavailable" },
    });
  await assert.rejects(getDetails("RiO6yDxDui4", fetcher), /Video unavailable/);
});
