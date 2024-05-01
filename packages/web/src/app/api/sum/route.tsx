import { StreamingTextResponse, streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
  });

  const result = await streamText({
    model: anthropic.chat("claude-3-opus-20240229"),
    system:
      "You are a video transcript summarizer. You only respond with the summary of the provided video transcript in HTML format.",
    prompt,
  });

  return new StreamingTextResponse(result.toAIStream());
}
