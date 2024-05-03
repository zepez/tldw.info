import Summary from "@/components/summary";
import Details from "@/components/details";
import { fetchTranscript } from "@/lib/utils";

interface Props {
  id: string;
}

export default async function Main({ id }: Props) {
  const { error, transcript } = await fetchTranscript(id);

  return (
    <>
      {error ? (
        <div className="bg-muted my-4 rounded-md p-8">
          <p className="font-bold">Unable to generate summary for video:</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <Summary id={id} transcript={transcript} />
      )}

      <Details id={id} />
    </>
  );
}
