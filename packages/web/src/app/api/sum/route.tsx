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
      "You are a video transcript summarizer programmed to strictly adhere to the given HTML template. " +
      "Respond only by filling the template with the video's title and several summary paragraphs. " +
      "Your response should contain nothing outside the HTML template provided below. " +
      `
      ****NO PREFATORY TEXT.****
      <h1>[TITLE]</h1>
      <p>[PARAGRAPH]</p>
    `,
    prompt,
  });

  return new StreamingTextResponse(result.toAIStream());
}
