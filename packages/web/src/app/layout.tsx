import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PlausibleProvider from "next-plausible";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://tldw.info"),
  title: "TLDW - Summarize YouTube Videos Instantly",
  description:
    "Instantly summarize YouTube videos with TLDW. Just paste the video URL and get a summary in seconds.",
  category: "technology",
  generator: "Next.js",
  applicationName: "TLDW",
  keywords: ["Summarize videos", "YouTube", "Summarize YouTube videos", "TLDW"],
  authors: [{ name: "Alexander Zepezauer", url: "https://zepez.dev" }],
  creator: "Alexander Zepezauer",
  formatDetection: {
    email: true,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TLDW - Summarize YouTube Videos Instantly",
    description:
      "Instantly summarize YouTube videos with TLDW. Just paste the video URL and get a summary in seconds.",
    url: "https://tldw.info",
    siteName: "TLDW.info",
    images: [
      {
        url: "https://tldw.info/og.png",
        width: 800,
        height: 600,
        alt: "TLDW Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TLDW - Summarize YouTube Videos Instantly",
    description:
      "Instantly summarize YouTube videos with TLDW. Just paste the video URL and get a summary in seconds.",
    creator: "@zepezAlex",
    images: [
      {
        url: "https://tldw.info/twitter.png",
        alt: "TLDW Twitter Image",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    other: {
      creator: ["https://zepez.dev", "https://github.com/zepez"],
    },
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "max-h-screen font-sans")}>
        <PlausibleProvider domain="tldw.info">{children}</PlausibleProvider>
      </body>
    </html>
  );
}
