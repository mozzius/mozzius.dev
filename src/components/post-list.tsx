import Link from "next/link";

import { getPosts } from "#/lib/api";

import { PostInfo } from "./post-info";
import { Title } from "./typography";

export async function PostList() {
  const posts = await getPosts();

  return posts.map((record) => {
    const post = record.value;
    const rkey = record.uri.split("/").pop();
    return (
      <Link key={record.uri} href={`/post/${rkey}`} className="w-full group">
        <article
          key={record.uri}
          className="w-full flex flex-row border-b items-stretch relative after:absolute after:inset-0 after:origin-bottom after:scale-y-0 hover:after:scale-y-100 after:transition-transform after:bg-slate-800/10 dark:after:bg-slate-100/10"
        >
          <div className="w-1.5 diagonal-pattern shrink-0 opacity-20 group-hover:opacity-100 transition-opacity" />
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
