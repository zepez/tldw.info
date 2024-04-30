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
    <div className="h-full overflow-y-scroll p-8">
      <h2 className="text-sm font-bold uppercase">Generated Summary</h2>

      {error && <div>{error.message}</div>}

      {completion && (
        <div
          className="prose bg-muted my-4 max-w-none rounded-md p-4"
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
              className="bg-primary text-primary-foreground mt-4 rounded-md px-4 py-2"
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
