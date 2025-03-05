"use client";

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";

const EMBED_URL = "https://embed.bsky.app";

export function BlueskyPostEmbed({ uri }: { uri: string }) {
  const id = useId();
  const pathname = usePathname();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    window.addEventListener(
      "message",
      (event) => {
        if (event.origin !== EMBED_URL) {
          return;
        }

        const iframeId = (event.data as { id: string }).id;
        if (id !== iframeId) {
          return;
        }

        const internalHeight = (event.data as { height: number }).height;
        if (internalHeight && typeof internalHeight === "number") {
          setHeight(internalHeight);
        }
      },
      { signal },
    );

    return () => {
      abortController.abort();
    };
  }, [id]);

  const ref_url =
    "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL + pathname;

  const searchParams = new URLSearchParams();
  searchParams.set("id", id);
  searchParams.set("ref_url", encodeURIComponent(ref_url));

  return (
    <div
      className="mt-6 flex max-w-[600px] w-full bluesky-embed"
      data-uri={uri}
    >
      <iframe
        className="w-full block border-none grow"
        style={{ height }}
        data-bluesky-uri={uri}
        src={`${EMBED_URL}/embed/${uri.slice("at://".length)}?${searchParams.toString()}`}
        width="100%"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
}
