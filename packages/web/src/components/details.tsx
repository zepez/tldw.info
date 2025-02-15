import Image from "next/image";
import Link from "next/link";
import { EyeOpenIcon, ClockIcon } from "@radix-ui/react-icons";
import { fetchDetails } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";

interface Props {
  id: string;
}

export default async function Details({ id }: Props) {
  const { error, details } = await fetchDetails(id);

  if (error || !details) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-sm font-bold uppercase">Error</h1>
        <div className="bg-muted rounded-md p-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-sm font-bold uppercase">{details.title}</h1>

      {details.channel?.url && (
        <Link
          href={details.channel.url}
          target="_blank"
          className="bg-muted text-muted-foreground flex items-center justify-start gap-4 rounded-md p-4"
        >
          {details?.channel?.icon.url && (
            <Image
              src={details.channel.icon.url}
              alt="Channel Icon"
              className="h-12 w-12 rounded-full"
              width={100}
              height={100}
            />
          )}
          <div>
            <p className="text-xl font-semibold">{details.channel?.name}</p>
            <p className="pt-1 text-xs font-bold uppercase">
              {details.uploadedAt}
            </p>
          </div>
        </Link>
      )}

      <section className="flex flex-wrap gap-x-2 gap-y-1">
        {details.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </section>

      {details.thumbnail?.url && (
        <Image
          src={details.thumbnail.url}
          alt="Video Thumbnail"
          className="mx-auto h-auto w-full"
          width={300}
          height={200}
        />
      )}

      <section className="flex justify-evenly text-sm font-semibold">
        <span className="flex items-center justify-center gap-2">
          <EyeOpenIcon className="h-5 w-5" /> {formatNumber(details.views)}
        </span>
        <span className="flex items-center justify-center gap-2">
          <ClockIcon className="h-5 w-5" /> {details.durationFormatted}
        </span>
      </section>

      <pre className="bg-muted text-muted-foreground overflow-hidden overflow-x-scroll text-wrap rounded-md p-4 text-left">
        {details.description}
      </pre>
    </div>
  );
}
