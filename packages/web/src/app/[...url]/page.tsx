import { notFound } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/header";
import Video from "@/components/video";
import Main from "@/components/main";
import Aside from "@/components/aside";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams: { v: id },
}: {
  searchParams: { v?: string };
}) {
  if (!id) return notFound();

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
              <Suspense
                fallback={
                  <>
                    <Skeleton className="h-full w-full" />
                    <Skeleton className="h-full w-full" />
                  </>
                }
              >
                <Main id={id} />
              </Suspense>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
          <Aside id={id} />
        </Suspense>
      </main>
    </div>
  );
}
