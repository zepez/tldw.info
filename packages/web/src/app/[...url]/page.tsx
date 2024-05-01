import { notFound } from "next/navigation";
import { YoutubeTranscript } from "youtube-transcript";
import Header from "@/components/header";
import Video from "@/components/video";
import Transcript from "@/components/transcript";
import Summary from "@/components/summary";
import Details from "@/components/details";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams: { v: id },
}: {
  searchParams: { v?: string };
}) {
  if (!id) return notFound();

  const transcript = await YoutubeTranscript.fetchTranscript(id);

  return (
    <div className="h-screen">
      <Header />
      <main className="grid h-[var(--main-height)] grid-cols-1 lg:grid-cols-[1fr,400px]">
        <ResizablePanelGroup direction="vertical" className="h-full">
          <ResizablePanel
            defaultSize={40}
            collapsible
            minSize={25}
            maxSize={100}
          >
            <Video id={id} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={60}
            collapsible
            minSize={25}
            maxSize={100}
            className="h-full border-t"
          >
            <div className="mx-auto grid h-full max-w-5xl grid-cols-1 gap-8 overflow-y-scroll border-t p-8 md:grid-cols-2">
              <Summary id={id} transcript={transcript} />
              <Details id={id} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        <Transcript transcript={transcript} />
      </main>
    </div>
  );
}
