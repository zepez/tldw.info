"use client";

import { useEffect, useRef } from "react";
import { Cross2Icon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
}

export default function TranscriptNotice({ id }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();

    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="transcript-notice-title"
      aria-describedby="transcript-notice-description"
      className="bg-background text-foreground m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl border p-6 shadow-xl backdrop:bg-black/60 sm:p-8"
    >
      <button
        type="button"
        aria-label="Close notice"
        onClick={() => dialogRef.current?.close()}
        className="text-muted-foreground hover:bg-muted focus-visible:ring-ring absolute right-3 top-3 rounded-md p-2 focus-visible:outline-none focus-visible:ring-2"
      >
        <Cross2Icon className="h-4 w-4" />
      </button>

      <h1
        id="transcript-notice-title"
        className="pr-6 text-2xl font-bold leading-tight"
      >
        An update on TLDW
      </h1>
      <p
        id="transcript-notice-description"
        className="text-muted-foreground mt-4 text-sm leading-relaxed"
      >
        YouTube&apos;s bot protection now blocks transcript requests from our
        hosted app. We can no longer fetch video transcripts on this site.
      </p>

      <section className="bg-muted mt-6 rounded-lg p-4">
        <h2 className="font-semibold">Summarize directly on YouTube</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          YouTube now has a Gemini-powered AI feature. When available, select
          <span className="font-semibold"> Ask </span>
          below a video and ask it to summarize the video.
        </p>
        <a
          href="https://support.google.com/youtube/answer/14110396?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4"
        >
          Learn how to use Ask YouTube
          <ExternalLinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Run TLDW locally</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          If you still want to use this project, you can run it on your own
          computer.
        </p>
        <a
          href="https://github.com/zepez/tldw.info#get-started"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4"
        >
          Local setup instructions
          <ExternalLinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="sm:flex-1">
          <a
            href={`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open video on YouTube
          </a>
        </Button>
        <Button variant="outline" onClick={() => dialogRef.current?.close()}>
          Got it
        </Button>
      </div>
    </dialog>
  );
}
