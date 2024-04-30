import { ReplicateStream, StreamingTextResponse } from "ai";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || "",
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await replicate.predictions.create({
    stream: true,
    model: "mistralai/mixtral-8x7b-instruct-v0.1",
    input: {
      top_k: 50,
      top_p: 0.9,
      prompt,
      max_tokens: 512,
      min_tokens: 0,
      temperature: 0.6,
      prompt_template: `<|begin_of_text|>
        <|start_header_id|>system<|end_header_id|>
        \n\n
        You are a video transcript summarizer. You only respond with the summary of the provided video transcript in HTML format.
        <|eot_id|>
        <|start_header_id|>user<|end_header_id|>
        \n\n
        {prompt}
        <|eot_id|>
        <|start_header_id|>assistant<|end_header_id|>
        \n\n`,
      presence_penalty: 1.15,
      frequency_penalty: 0.2,
    },
  });

  const stream = await ReplicateStream(response);

  return new StreamingTextResponse(stream);
}
