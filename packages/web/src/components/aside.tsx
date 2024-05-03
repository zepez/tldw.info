import Transcript from "@/components/transcript";
import { fetchTranscript } from "@/lib/utils";

interface Props {
  id: string;
}

export default async function Aside({ id }: Props) {
  const { error, transcript } = await fetchTranscript(id);

  return (
    <div className="sticky top-0 hidden h-[var(--main-height)] overflow-y-scroll border-l p-4 lg:block">
      {error ? (
        <div>
          <p className="font-bold">Unable to fetch transcript for video:</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <Transcript transcript={transcript} />
      )}
    </div>
  );
}
