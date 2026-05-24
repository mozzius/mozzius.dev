"use client";

import { useEffect, useRef, useState, ViewTransition } from "react";
import Link from "next/link";

import type { Post } from "#/lib/api";
import { cx } from "#/lib/cx";

import { PostInfo } from "./post-info";
import { Title } from "./typography";

export function PostListItem({
  post,
  rkey,
  viewCount,
}: {
  post: Post;
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
            "fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center",
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
        <article className="w-full flex flex-row border-b items-stretch relative transition-color backdrop-blur-sm hover:bg-slate-700/5 dark:hover:bg-slate-200/10">
          <div className="w-1.5 diagonal-pattern shrink-0 opacity-20 group-hover:opacity-100 transition-opacity" />
          <div className="flex-1 py-2 px-4 z-10 relative">
            <ViewTransition name={`post-title-${rkey}`}>
              <Title className="text-lg" level="h3">
                {post.title}
              </Title>
            </ViewTransition>
            <PostInfo
              content={post.markdown}
              createdAt={post.publishedAt}
              className="text-xs mt-1"
            >
              {viewCount}
            </PostInfo>
          </div>
        </article>
      </Link>
    </>
  );
}
