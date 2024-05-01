"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  url: z
    .string()
    .url()
    .transform((url) => {
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.hostname === "youtu.be") {
          const videoId = parsedUrl.pathname.substring(1);
          return `https://www.youtube.com/watch?v=${videoId}`;
        }
      } catch {
        return url;
      }
      return url;
    })
    .refine(
      (url) => {
        try {
          const hostname = new URL(url).hostname;
          return hostname === "youtube.com" || hostname === "www.youtube.com";
        } catch {
          return false;
        }
      },
      {
        message: "This site only works for videos hosted on youtube.com!",
      },
    ),
});

export default function Page() {
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    router.push(`/${values.url}`);
  };

  return (
    <>
      <Header />
      <main className="flex h-[var(--main-height)] w-full items-center justify-center px-8">
        <section className="h-auto w-full max-w-2xl pb-16 lg:pb-32">
          <h2 className="text-4xl font-bold">
            📹 TLDW{" "}
            <span className="text-2xl">
              <span className="hidden lg:inline">- </span>
              <br className="block lg:hidden" />
              Too Long, Didn&apos;t Watch
            </span>
          </h2>
          <h1 className="pb-12 pt-2 text-lg leading-tight lg:text-xl">
            Instantly summarize YouTube videos from your favorite channels
          </h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-start justify-center space-x-4"
            >
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel hidden>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.youtube.com/watch?v=S_RorY_FRvo"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      Input any youtube video link to get started.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="lg:min-w-48">
                Go!
              </Button>
            </form>
          </Form>
        </section>
      </main>
    </>
  );
}
