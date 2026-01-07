import { Metadata } from "next";
import Link from "next/link";

import { Footer } from "#/components/footer";
import { PostList } from "#/components/post-list";
import { Title } from "#/components/typography";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

export const metadata: Metadata = {
  alternates: {
    canonical: "https://mozzius.dev",
    types: {
      "application/rss+xml": "https://mozzius.dev/rss",
    },
  },
};

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-dvh p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-[600px]">
        <div className="self-center flex flex-col">
          <Title level="h1" className="m-0">
            mozzius.dev
          </Title>
          <span className="font-bold text-xs opacity-50 text-right flex-1 mr-6">
            a webbed site,{" "}
            <Link href="https://atproto.com" className="underline">
              internected
            </Link>
            .
          </span>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <PostList />
        </div>
      </main>
      <Footer />
    </div>
  );
}
