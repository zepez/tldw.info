"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
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
  const [apiLoaded, setApiLoaded] = useState<boolean>(false);
  const playerRef = useRef<YT.Player | null>(null);

  useEffect(() => {
    if (!window.YT) {
      window.onYouTubeIframeAPIReady = () => {
        setApiLoaded(true);
      };
    } else {
      setApiLoaded(true);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (apiLoaded) {
      playerRef.current = new YT.Player("youtube-player", {
        videoId: id,
        width: "560",
        height: "315",
        events: {
          onReady: onPlayerReady,
          onError: onPlayerError,
        },
      });
    }
  }, [apiLoaded, id]);

  useEffect(() => {
    if (timestamp === null) return;
    if (playerRef.current === null) return;

    playerRef.current.seekTo(timestamp, true);
  }, [timestamp]);

  function onPlayerReady() {
    console.log("Player ready");
  }

  function onPlayerError(event: YT.OnErrorEvent) {
    console.error("YouTube Player Error:", event.data);
  }

  return (
    <div className="h-full w-full flex-shrink-0 bg-black py-4">
      <Script src="https://www.youtube.com/iframe_api" />
      <div id="youtube-player" className="mx-auto h-full w-full max-w-5xl" />
    </div>
  );
}
