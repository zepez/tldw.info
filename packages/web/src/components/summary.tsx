"use client";

import { useState } from "react";
import { useCompletion } from "ai/react";
import he from "he";

interface Props {
  id: string;
  transcript: { text: string }[];
}

export default function Summary({ id, transcript }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const full = transcript.map((t) => t.text).join(", \n\n");
  const decoded = he.decode(he.decode(full));

  const { completion, handleSubmit, error } = useCompletion({
    id,
    api: "/api/sum",
    initialInput: decoded,
  });

  return (
    <div>
      <p className="text-sm font-bold uppercase">Generated Summary</p>

      {error && <div>{error.message}</div>}

      {submitted && !completion && (
        <div className="bg-muted my-4 flex items-center justify-center rounded-md p-8">
          <p>Generating summary...</p>
        </div>
      )}

      {completion && (
        <div
          className="prose bg-muted prose-h1:text-lg my-4 max-w-none rounded-md p-4"
          dangerouslySetInnerHTML={{ __html: completion }}
        />
      )}

      {!submitted && (
        <div className="bg-muted my-4 flex items-center justify-center p-8">
          <form
            onSubmit={(v) => {
              setSubmitted(true);
              handleSubmit(v);
            }}
          >
            <p>
              A summary has not yet been generated for this video. Click the
              button below to generate one!
            </p>
            <button
              className="bg-primary text-primary-foreground mt-4 w-full rounded-md px-4 py-2"
              type="submit"
            >
              Generate Summary
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
