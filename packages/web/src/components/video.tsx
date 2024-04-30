"use client";

import React, { useEffect, useRef } from "react";
import useStore from "@/components/store";

interface Props {
  id: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function Video({ id }: Props) {
  const timestamp = useStore((state) => state.timestamp);
  const playerRef = useRef<YT.Player | null>(null);

  useEffect(() => {
    const createPlayer = () => {
      playerRef.current = new YT.Player("youtube-player", {
        videoId: id,
        width: "560",
        height: "315",
        events: {
          onReady: onPlayerReady,
          onError: onPlayerError,
        },
      });
    };

    // Load the YouTube IFrame Player API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = createPlayer;

    function onPlayerReady() {
      console.log("Player ready");
    }

    function onPlayerError(event: YT.OnErrorEvent) {
      console.error("YouTube Player Error:", event.data);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      window.onYouTubeIframeAPIReady = () => {};
    };
  }, [id]);

  useEffect(() => {
    if (timestamp === null) return;
    if (playerRef.current === null) return;

    playerRef.current.seekTo(timestamp, true);
  }, [timestamp]);

  return (
    <div className="h-full w-full flex-shrink-0 bg-black py-4">
      <div id="youtube-player" className="mx-auto h-full w-full max-w-5xl" />
    </div>
  );
}
