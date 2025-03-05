import { CredentialManager, XRPC } from "@atcute/client";

import { env } from "./env";

const handler = new CredentialManager({ service: env.BSKY_PDS, fetch });
export const bsky = new XRPC({ handler });
