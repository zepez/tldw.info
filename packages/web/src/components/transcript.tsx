"use client";

import { useState } from "react";
import he from "he";
import useStore from "@/components/store";
import { Input } from "@/components/ui/input";

interface Props {
  transcript: { offset: number; text: string }[];
}

export default function Transcript({ transcript }: Props) {
  const store = useStore((state) => ({
    setTimestamp: state.setTimestamp,
  }));

  const [filter, setFilter] = useState("");
  const [lines, setLines] = useState(transcript);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setFilter(value);

    setLines(
      transcript.filter((line) =>
        line.text.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };

  return (
    <div className="sticky top-0 hidden h-[var(--main-height)] overflow-y-scroll border-l p-4 lg:block">
      <p className="px-2 text-sm font-bold uppercase">Video transcript</p>

      <Input
        className="my-3"
        placeholder="Filter Transcript"
        value={filter}
        onChange={handleFilterChange}
      />

      {lines.map((line, index) => {
        const timestamp = new Date(line.offset * 1000)
          .toISOString()
          .slice(11, 19);

        const decoded = he.decode(he.decode(line.text));

        return (
          <button
            key={index}
            onClick={() => store.setTimestamp(line.offset)}
            className="hover:bg-background flex w-full items-start justify-start gap-4 rounded-lg p-2 text-left"
          >
            <p className="pt-[5px] text-xs font-bold">{timestamp}</p>
            <p>{decoded}</p>
          </button>
        );
      })}
    </div>
  );
}
