import { EyeIcon } from "lucide-react";
import { Suspense } from "react";

import { env } from "#/lib/env";

export async function ViewCount({ path }: { path: string }) {
  return (
    <>
      {" "}
      &middot; <EyeIcon className="text-inherit inline size-3.5 mb-0.5" />{" "}
      <Suspense
        fallback={
          <span className="inline-block w-20 h-4 rounded-sm bg-gray-100 dark:bg-gray-800 align-middle mb-0.5" />
        }
      >
        <ViewCountInner path={path} />
      </Suspense>
    </>
  );
}

async function ViewCountInner({ path }: { path: string }) {
  if (!env.PLAUSIBLE_API_KEY) return null;

  const response = await fetch(`${env.PLAUSIBLE_DOMAIN}/api/v2/query`, {
    headers: {
      Authorization: `Bearer ${env.PLAUSIBLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      site_id: env.PLAUSIBLE_SITE_ID,
      metrics: ["pageviews"],
      date_range: "all",
      filters: [["is", "event:page", [path]]],
    }),
    next: {
      revalidate: 60 * 60,
    },
  });
  const data = (await response.json()) as
    | {
        results: [{ metrics: number[] }];
      }
    | { error: string };

  if ("error" in data) {
    console.error(data.error);
    return null;
  }

  const pageviews = data?.results?.[0]?.metrics?.[0];

  if (typeof pageviews !== "number") {
    console.error("Invalid pageviews data", data);
    return null;
  }

  const formatter = Intl.NumberFormat("en-GB", {
    roundingMode: "trunc",
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  });

  return <>{formatter.format(pageviews).toLocaleLowerCase()} views</>;
}
