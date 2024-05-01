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
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    router.push(`/${values.url}`);
  };

  return (
    <>
      <Header />
      <main className="flex h-[var(--main-height)] w-full items-center justify-center">
        <section className="h-auto w-full max-w-2xl pb-48">
          <h2 className="text-4xl font-bold">
            📹 TLDW <span className="text-2xl">- Too Long, Didn't Watch</span>
          </h2>
          <h1 className="pb-12 text-xl">
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
                        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      Input any youtube video URL to get started.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="min-w-48">
                Go!
              </Button>
            </form>
          </Form>
        </section>
      </main>
    </>
  );
}
