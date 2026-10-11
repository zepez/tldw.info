import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cache } from "react";
import { getDetails, getTranscript } from "./youtube";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + " billion";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + " million";
  } else if (num >= 1000) {
    return num.toLocaleString();
  } else {
    return num.toString();
  }
}

export const fetchTranscript = cache(async (id: string) => {
  try {
    const transcript = await getTranscript(id);

    return { error: null, transcript };
  } catch (e) {
    let error = "An error occurred while fetching the transcript.";

    if (e instanceof Error) {
      error = e.message.toString();
    }

    return {
      error,
      transcript: [],
    };
  }
});

export const fetchDetails = cache(async (id: string) => {
  try {
    const details = await getDetails(id);
    if (!details) throw new Error("Video details unable to be retrieved.");

    return { error: null, details };
  } catch (e) {
    let error = "An error occurred while fetching the video details.";

    if (e instanceof Error) {
      error = e.message.toString();
    }

    return {
      error,
      details: null,
    };
  }
});
