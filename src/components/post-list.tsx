import { getPosts } from "#/lib/api";

import { PostListItem } from "./post-list-item";

export async function PostList() {
  const posts = await getPosts();

  return posts.map((record) => {
    const post = record.value;
    const rkey = record.uri.split("/").pop() || "";
    return <PostListItem key={record.uri} post={post} rkey={rkey} />;
  });
}
