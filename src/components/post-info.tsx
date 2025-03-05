import { ClockIcon } from "lucide-react";
import Image from "next/image";
import readingTime from "reading-time";

import me from "#/assets/me_blue_square.jpg";
import { MY_DID } from "#/lib/bsky";
import { date } from "#/lib/date";

import { Paragraph } from "./typography";

export function PostInfo({
  createdAt,
  content,
  includeAuthor = false,
  children,
}: {
  createdAt?: string;
  content: string;
  includeAuthor?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Paragraph>
      {includeAuthor && (
        <>
          <Image
            width={14}
            height={14}
            src={me}
            alt="Samuel's profile picture"
            className="inline rounded-full mr-1 mb-1"
          />
          <a
            href={`https://bsky.app/profile/${MY_DID}`}
            className="hover:underline hover:underline-offset-4"
          >
            Samuel
          </a>{" "}
          &middot;{" "}
        </>
      )}
      {createdAt && (
        <>
          <time dateTime={createdAt}>{date(new Date(createdAt))}</time>{" "}
          &middot;{" "}
        </>
      )}
      <ClockIcon className="text-inherit inline size-3.5 mb-0.5" />{" "}
      {readingTime(content).text}
      {children}
    </Paragraph>
  );
}
