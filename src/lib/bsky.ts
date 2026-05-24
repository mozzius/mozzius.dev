import { Client } from "@atproto/lex";

import { env } from "./env";

// Read-only client pointed at the PDS that hosts the blog records.
export const client = new Client(env.NEXT_PUBLIC_BSKY_PDS);
