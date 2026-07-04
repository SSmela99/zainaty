"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type HomeBlogGridProps = {
  featured: ReactNode;
  latest: ReactNode;
  hasLatest: boolean;
};

export function HomeBlogGrid({ featured, latest, hasLatest }: HomeBlogGridProps) {
  const latestRef = useRef<HTMLDivElement>(null);
  const [featuredMaxHeight, setFeaturedMaxHeight] = useState<number | undefined>();

  useEffect(() => {
    const latestColumn = latestRef.current;

    if (!latestColumn || !hasLatest) {
      setFeaturedMaxHeight(undefined);
      return;
    }

    const syncHeight = () => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

      if (!isDesktop) {
        setFeaturedMaxHeight(undefined);
        return;
      }

      setFeaturedMaxHeight(latestColumn.offsetHeight);
    };

    syncHeight();

    const resizeObserver = new ResizeObserver(syncHeight);
    resizeObserver.observe(latestColumn);
    window.addEventListener("resize", syncHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, [hasLatest]);

  if (!hasLatest) {
    return <div>{featured}</div>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3 lg:items-start xl:gap-10">
      {featured ? (
        <div
          className="min-h-0 lg:col-span-1"
          style={
            featuredMaxHeight != null ? { height: featuredMaxHeight } : undefined
          }
        >
          {featured}
        </div>
      ) : null}

      <div ref={latestRef} className="flex flex-col gap-4 lg:col-span-2">
        {latest}
      </div>
    </div>
  );
}
