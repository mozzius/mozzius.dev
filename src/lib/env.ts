import { cleanEnv, str, url } from "envalid";

// Define environment variables explicitly for Next.js static compilation
const envVars = {
  NODE_ENV: process.env.NODE_ENV,
  PLAUSIBLE_SITE_ID: process.env.PLAUSIBLE_SITE_ID,
  PLAUSIBLE_DOMAIN: process.env.PLAUSIBLE_DOMAIN,
  PLAUSIBLE_API_KEY: process.env.PLAUSIBLE_API_KEY,
  NEXT_PUBLIC_BSKY_DID: process.env.NEXT_PUBLIC_BSKY_DID,
  NEXT_PUBLIC_BSKY_PDS: process.env.NEXT_PUBLIC_BSKY_PDS,
};

// Use cleanEnv to validate and parse the environment variables
export const env = cleanEnv(envVars, {
  NODE_ENV: str({
    choices: ["development", "production"],
    default: "production",
    devDefault: "development",
  }),
  PLAUSIBLE_SITE_ID: str({ default: "mozzius.dev" }),
  PLAUSIBLE_DOMAIN: url({ default: "https://plausible.mozzius.dev" }),
  PLAUSIBLE_API_KEY: str({ default: "" }),
  NEXT_PUBLIC_BSKY_DID: str({ default: "did:plc:p2cp5gopk7mgjegy6wadk3ep" }),
  NEXT_PUBLIC_BSKY_PDS: url({
    default: "https://amanita.us-east.host.bsky.network",
  }),
});
