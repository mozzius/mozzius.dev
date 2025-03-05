import { cleanEnv, str, url } from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ["development", "production"] }),
  PLAUSIBLE_SITE_ID: str({ default: "mozzius.dev" }),
  PLAUSIBLE_DOMAIN: url({ default: "https://plausible.mozzius.dev" }),
  PLAUSIBLE_API_KEY: str({ default: "" }),
});
