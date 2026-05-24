import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import RSS from "rss";
import { unified } from "unified";

import { getPosts } from "#/lib/api";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

export async function GET() {
  const posts = await getPosts();

  const rss = new RSS({
    title: "mozzius.dev",
    feed_url: "https://mozzius.dev/rss",
    site_url: "https://mozzius.dev",
    description: "a webbed site",
  });

  for (const post of posts) {
    rss.item({
      title: post.title ?? "Untitled",
      description: await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(post.markdown)
        .then((v) => v.toString()),
      url: `https://mozzius.dev/post/${post.rkey}`,
      date: new Date(post.publishedAt ?? Date.now()),
    });
  }

  return new Response(rss.xml(), {
    headers: {
      "content-type": "application/rss+xml",
    },
  });
}
