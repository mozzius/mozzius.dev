import {
  type ComAtprotoRepoListRecords,
  type ComWhtwndBlogEntry,
} from "@atcute/client/lexicons";

import { bsky } from "./bsky";
import { env } from "./env";

export async function getPosts() {
  const posts = await bsky.get("com.atproto.repo.listRecords", {
    params: {
      repo: env.BSKY_DID,
      collection: "com.whtwnd.blog.entry",
      // todo: pagination
    },
  });
  return posts.data.records.filter(
    drafts,
  ) as (ComAtprotoRepoListRecords.Record & {
    value: ComWhtwndBlogEntry.Record;
  })[];
}

function drafts(record: ComAtprotoRepoListRecords.Record) {
  if (process.env.NODE_ENV === "development") return true;
  const post = record.value as ComWhtwndBlogEntry.Record;
  return post.visibility === "public";
}

export async function getPost(rkey: string) {
  const post = await bsky.get("com.atproto.repo.getRecord", {
    params: {
      repo: env.BSKY_DID,
      rkey: rkey,
      collection: "com.whtwnd.blog.entry",
    },
  });

  return post.data as ComAtprotoRepoListRecords.Record & {
    value: ComWhtwndBlogEntry.Record;
  };
}
