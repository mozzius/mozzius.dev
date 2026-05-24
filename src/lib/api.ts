import type { AtIdentifierString } from "@atproto/lex";

import * as document from "#/lexicons/site/standard/document";

import { client } from "./bsky";
import { env } from "./env";

const repo = env.NEXT_PUBLIC_BSKY_DID as AtIdentifierString;

// `site.standard.document` is a shared lexicon, so the repo also contains
// documents created by other apps (e.g. leaflet.pub). Only keep documents whose
// `site` points at our publication.
function belongsToSite(site: string) {
  return site === env.NEXT_PUBLIC_PUBLICATION_URI;
}

// Normalized shape the UI consumes, decoupled from the on-the-wire lexicon.
export type Post = {
  uri: string;
  rkey: string;
  title: string;
  markdown: string;
  publishedAt: string;
};

// The body lives in an open `content` union. We store markdown using the
// markpub lexicon (`at.markpub.markdown`); fall back to plaintext otherwise.
function extractMarkdown(content: unknown): string {
  if (content && typeof content === "object" && "$type" in content) {
    const c = content as {
      $type: string;
      text?: { markdown?: string };
      textContent?: string;
    };
    if (c.$type === "at.markpub.markdown") {
      return c.text?.markdown ?? "";
    }
  }
  return "";
}

function toPost(uri: string, value: document.Main): Post {
  return {
    uri,
    rkey: uri.split("/").pop() ?? "",
    title: value.title,
    markdown: extractMarkdown(value.content) || (value.textContent ?? ""),
    publishedAt: value.publishedAt,
  };
}

export async function getPosts(): Promise<Post[]> {
  const res = await client.list(document, { repo });
  // `res.records` is an intersection of array types; iterating yields the
  // schema-typed element, whereas `.map`'s callback would widen to LexMap.
  const posts: Post[] = [];
  for (const record of res.records) {
    if (!belongsToSite(record.value.site)) continue;
    posts.push(toPost(record.uri, record.value));
  }
  return posts;
}

export async function getPost(rkey: string): Promise<Post | undefined> {
  const res = await client.get(document, { repo, rkey });
  if (!belongsToSite(res.value.site)) return undefined;
  return toPost(res.uri, res.value);
}
