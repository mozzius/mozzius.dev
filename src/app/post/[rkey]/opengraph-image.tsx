import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

import { getPost } from "#/lib/api";
import { loadGoogleFont } from "#/lib/google-font";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ rkey: string }>;
}) {
  const { rkey } = await params;

  const post = await getPost(rkey);
  if (!post) notFound();

  const fontData = await loadGoogleFont(
    "Libre+Baskerville:ital@1",
    "mozzius.dev" + post.title?.toLocaleUpperCase(),
  );

  return new ImageResponse(
    <div tw="h-full w-full bg-white flex flex-col justify-center items-center px-20">
      <h1
        style={{
          fontFamily: '"Libre Baskerville"',
          fontSize: 80,
          fontWeight: 700,
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        {post.title?.toLocaleUpperCase()}
      </h1>
      <h1
        style={{
          fontSize: 32,
          fontStyle: "italic",
          fontFamily: '"Libre Baskerville"',
        }}
      >
        mozzius.dev
      </h1>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Libre Baskerville",
          data: fontData,
        },
      ],
    },
  );
}
