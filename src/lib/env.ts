import { cleanEnv, str, url } from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "production"] }),
  PLAUSIBLE_SITE_ID: str({ default: "mozzius.dev" }),
  PLAUSIBLE_DOMAIN: url({ default: "https://plausible.mozzius.dev" }),
  PLAUSIBLE_API_KEY: str({ default: "" }),
  BSKY_DID: str({ default: "did:plc:p2cp5gopk7mgjegy6wadk3ep" }),
  BSKY_PDS: url({ default: "https://amanita.us-east.host.bsky.network" }),
});
