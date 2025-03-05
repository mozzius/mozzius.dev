"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ComWhtwndBlogEntry } from "@atcute/client/lexicons";

import { cx } from "#/lib/cx";

import { PostInfo } from "./post-info";
import { Title } from "./typography";

export function PostListItem({
  post,
  rkey,
  viewCount,
}: {
  post: ComWhtwndBlogEntry.Record;
  rkey: string;
  viewCount?: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up any timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLeaving(false);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsLeaving(true);
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      setIsLeaving(false);
    }, 300); // Match the animation duration
  };

  return (
    <>
      {isHovered && (
        <div
          className={cx(
            "fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center",
            isLeaving ? "animate-fade-out" : "animate-fade-in",
          )}
        >
          <div className="absolute whitespace-nowrap animate-marquee font-serif uppercase overflow-visible flex items-center justify-center leading-none">
            {Array(10).fill(post.title).join(" · ")}
          </div>
        </div>
      )}
      <Link
        href={`/post/${rkey}`}
        className="w-full group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <article className="w-full flex flex-row border-b items-stretch relative transition-all backdrop-blur-xs hover:backdrop-blur-md backdrop-filter hover:bg-slate-700/5 dark:hover:bg-slate-200/10">
          <div className="w-1.5 diagonal-pattern shrink-0 opacity-20 group-hover:opacity-100 transition-opacity" />
          <div className="flex-1 pt-2 pb-2 px-4 z-10 relative">
            <Title className="text-lg" level="h3">
              {post.title}
            </Title>
            <PostInfo
              content={post.content}
              createdAt={post.createdAt}
              className="text-xs"
            >
              {viewCount}
            </PostInfo>
          </div>
        </article>
      </Link>
    </>
  );
}
