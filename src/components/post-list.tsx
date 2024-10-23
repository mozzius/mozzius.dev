import Link from "next/link";
import { type ComWhtwndBlogEntry } from "@atcute/client/lexicons";

import { bsky, MY_DID } from "#/lib/bsky";

import { PostInfo } from "./post-info";
import { Paragraph, Title } from "./typography";

export async function PostList() {
  const posts = await bsky.get("com.atproto.repo.listRecords", {
    params: {
      repo: MY_DID,
      collection: "com.whtwnd.blog.entry",
      // todo: pagination
    },
  });

  return posts.data.records.map((record) => {
    const post = record.value as ComWhtwndBlogEntry.Record;
    const rkey = record.uri.split("/").pop();
    return (
      <Link key={record.uri} href={`/post/${rkey}`} className="w-full group">
        <article
          key={record.uri}
          className="w-full flex flex-row border-b items-stretch relative after:absolute after:inset-0 after:origin-bottom after:scale-y-0 hover:after:scale-y-100 after:transition-transform after:bg-slate-800/10 dark:after:bg-slate-100/10"
        >
          <div className="w-1.5 diagonal-pattern flex-shrink-0 opacity-20 group-hover:opacity-100 transition-opacity" />
          <div className="flex-1 pt-2 pb-2 px-4">
            <Title className="text-lg" level="h3">
              {post.title}
            </Title>
            <PostInfo content={post.content} createdAt={post.createdAt} />
          </div>
        </article>
      </Link>
    );
  });
}
