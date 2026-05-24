import { getPosts } from "#/lib/api";

import { PostListItem } from "./post-list-item";
import { ViewCount } from "./view-count";

export async function PostList() {
  const posts = await getPosts();

  return posts.map((post) => (
    <PostListItem
      key={post.uri}
      post={post}
      rkey={post.rkey}
      viewCount={<ViewCount path={`/post/${post.rkey}`} />}
    />
  ));
}
