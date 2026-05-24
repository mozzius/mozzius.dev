/**
 * One-off migration: WhiteWind (`com.whtwnd.blog.entry`) -> standard.site.
 *
 * - Creates a `site.standard.publication` record (once) for mozzius.dev.
 * - Copies every *public* WhiteWind post into a `site.standard.document`,
 *   reusing the original rkey so existing /post/<rkey> URLs stay stable.
 * - Markdown body is stored via the markpub lexicon (`at.markpub.markdown`).
 * - Idempotent: re-running overwrites the same records (putRecord) and reuses
 *   the existing publication. WhiteWind records are left untouched.
 *
 * Run with:
 *   BLOG_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx node scripts/migrate-to-standard.ts
 *
 * Optional env: BLOG_PDS, BLOG_IDENTIFIER (default: the configured DID).
 */
import { Client } from "@atproto/lex";
import { PasswordSession } from "@atproto/lex-password-session";

const PDS = process.env.BLOG_PDS ?? "https://amanita.us-east.host.bsky.network";
const IDENTIFIER =
  process.env.BLOG_IDENTIFIER ?? "did:plc:p2cp5gopk7mgjegy6wadk3ep";
const PASSWORD = process.env.BLOG_APP_PASSWORD;

const PUBLICATION = {
  name: "mozzius.dev",
  url: "https://mozzius.dev",
  description: "a webbed site",
};

// Minimal view of the WhiteWind record fields we care about.
type WhiteWindEntry = {
  title?: string;
  content?: string;
  createdAt?: string;
  visibility?: string;
};

async function main() {
  if (!PASSWORD) {
    throw new Error("Set BLOG_APP_PASSWORD (an app password) to run migration.");
  }

  const session = await PasswordSession.login({
    service: PDS,
    identifier: IDENTIFIER,
    password: PASSWORD,
  });
  const client = new Client(session);
  const repo = client.assertDid;

  // 1. Find or create the publication (match by URL — the repo may also hold
  // publications from other apps like leaflet.pub).
  const existing = await client.listRecords("site.standard.publication", {
    repo,
  });
  let publicationUri = existing.body.records.find(
    (record) => (record.value as { url?: string }).url === PUBLICATION.url,
  )?.uri;
  if (publicationUri) {
    console.log(`Reusing existing publication: ${publicationUri}`);
  } else {
    const created = await client.createRecord({
      $type: "site.standard.publication",
      ...PUBLICATION,
    });
    publicationUri = created.body.uri;
    console.log(`Created publication: ${publicationUri}`);
  }

  // 2. List WhiteWind entries and migrate the public ones.
  const entries = await client.listRecords("com.whtwnd.blog.entry", { repo });

  let migrated = 0;
  for (const record of entries.body.records) {
    const value = record.value as WhiteWindEntry;
    if (value.visibility !== "public") {
      console.log(`Skipping non-public: ${record.uri}`);
      continue;
    }

    const rkey = record.uri.split("/").pop()!;
    const publishedAt = value.createdAt ?? new Date().toISOString();

    await client.putRecord(
      {
        $type: "site.standard.document",
        site: publicationUri,
        title: value.title ?? "Untitled",
        publishedAt,
        path: `/post/${rkey}`,
        content: {
          $type: "at.markpub.markdown",
          flavor: "gfm",
          text: {
            $type: "at.markpub.text",
            markdown: value.content ?? "",
          },
        },
      },
      rkey,
    );

    migrated++;
    console.log(`Migrated ${rkey} — "${value.title}"`);
  }

  console.log(`\nDone. Migrated ${migrated} document(s).`);
  console.log(
    `\nSet this in your environment so the site shows these posts:\n  NEXT_PUBLIC_PUBLICATION_URI=${publicationUri}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
