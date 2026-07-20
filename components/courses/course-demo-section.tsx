import { PlayIcon } from "lucide-react";

import type { CourseKind } from "@/lib/courses/kinds";
import { getYoutubeEmbedUrl, parseYoutubeVideoId } from "@/lib/youtube/parse";

type CourseDemoSectionProps = {
  youtubeUrl: string;
  kind: CourseKind;
};

function getDemoSubtitle(kind: CourseKind): string {
  if (kind === "video") {
    return "Podgląd jednej z lekcji wideo — zobacz jak wygląda nauka w praktyce";
  }

  return "Zobacz krótki podgląd kursu i przekonaj się, czy to materiał dla Ciebie";
}

export function CourseDemoSection({ youtubeUrl, kind }: CourseDemoSectionProps) {
  const videoId = parseYoutubeVideoId(youtubeUrl);
  if (!videoId) return null;

  return (
    <section className="mx-auto mt-16 max-w-350 px-8 md:mt-20">
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-zinc-950 dark:bg-white">
          <PlayIcon
            className="size-5 fill-white text-white dark:fill-zinc-950 dark:text-zinc-950"
            strokeWidth={0}
          />
        </div>

        <h2 className="mt-6 text-3xl leading-[1.1] font-black tracking-[-0.03em] text-zinc-950 md:text-5xl dark:text-white">
          Zobacz demo
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {getDemoSubtitle(kind)}
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl border border-[#ddd8ce] bg-black shadow-[0_24px_64px_rgba(0,0,0,0.14)] dark:border-[#282828] dark:shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
        <div className="relative aspect-video">
          <iframe
            src={getYoutubeEmbedUrl(videoId)}
            title="Podgląd lekcji wideo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 size-full"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
