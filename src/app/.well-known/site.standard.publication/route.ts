import { env } from "#/lib/env";

// standard.site publication verification: return the AT-URI of our publication
// record so apps can confirm this domain owns it.
export const dynamic = "force-static";

export function GET() {
  return new Response(env.NEXT_PUBLIC_PUBLICATION_URI, {
    headers: { "content-type": "text/plain" },
  });
}
