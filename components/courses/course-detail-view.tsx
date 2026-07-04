import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CheckIcon,
  ClockIcon,
  FlameIcon,
  ShoppingCartIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";

import {
  CourseCoverPriceBadge,
  CourseDiscountBadge,
  CoursePrice,
} from "@/components/courses/course-price";
import { CourseDemoSection } from "@/components/courses/course-demo-section";
import { splitCourseDescription } from "@/lib/courses/format";
import type { Course } from "@/lib/courses/types";
import { COURSE_KIND_LABELS } from "@/lib/courses/kinds";
import { courseListPathByKind, coursePath, PATHS } from "@/lib/paths";

type CourseDetailViewProps = {
  course: Course;
};

function InfoCard({
  icon,
  title,
  children,
  iconClassName,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <div className="rounded-3xl border border-[#ded9cf] bg-white p-6 dark:border-[#282828] dark:bg-[#1c1c1c]">
      <div className="flex items-start gap-4">
        <div
          className={
            iconClassName ??
            "flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#ffe1cc] dark:bg-[#3a3d10]"
          }
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black tracking-[-0.02em] text-zinc-950 dark:text-white">
            {title}
          </h2>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function CourseDetailView({ course }: CourseDetailViewProps) {
  const paragraphs = splitCourseDescription(course.description);
  const discountPercent =
    course.discount_price != null && course.price > course.discount_price
      ? Math.round(
          ((course.price - course.discount_price) / course.price) * 100,
        )
      : null;

  return (
    <div className="pb-20 md:pb-28">
      <div className="mx-auto max-w-350 px-8 pt-10 md:pt-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-12">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#f7f3ea] dark:bg-[#141414]">
              {course.cover_image_url ? (
                <Image
                  src={course.cover_image_url}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center text-3xl font-black tracking-[-0.04em] text-[#ff4b12] dark:text-[#d7ff00]">
                  {course.title}
                </div>
              )}

              <CourseDiscountBadge
                price={course.price}
                discountPrice={course.discount_price}
                className="absolute top-4 left-4 px-3 py-1.5"
              />
              <CourseCoverPriceBadge
                price={course.price}
                discountPrice={course.discount_price}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Link
                href={courseListPathByKind(course.kind)}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#ff4b12] transition-colors hover:text-[#1a4dff] dark:text-[#ff6b4a] dark:hover:text-[#d7ff00]"
              >
                <ArrowLeftIcon className="size-4" strokeWidth={2.2} />
                Wróć do {COURSE_KIND_LABELS[course.kind].toLowerCase()}
              </Link>

              <h1 className="mt-4 text-3xl leading-[1.08] font-black tracking-[-0.03em] text-zinc-950 md:text-5xl dark:text-white">
                {course.title}
              </h1>

              <div className="mt-5">
                <CoursePrice
                  price={course.price}
                  discountPrice={course.discount_price}
                  size="lg"
                />
              </div>

              <Link
                href={`${PATHS.LOGIN}?next=${encodeURIComponent(coursePath(course.slug))}`}
                className="mt-6 inline-flex h-[4.5rem] w-full items-center justify-center gap-3 rounded-2xl bg-zinc-950 px-12 text-lg font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.01] sm:w-auto dark:bg-[#d7ff00] dark:text-zinc-950"
              >
                <ShoppingCartIcon className="size-6" strokeWidth={2.2} />
                Kup teraz
              </Link>
            </div>

            <InfoCard
              title="Dla kogo jest ten kurs"
              icon={
                <UserIcon
                  className="size-5 text-[#ff4b12] dark:text-[#d7ff00]"
                  strokeWidth={2.2}
                />
              }
            >
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {course.target_audience}
              </p>
            </InfoCard>

            <InfoCard
              title="Czego się nauczysz"
              icon={
                <BookOpenIcon
                  className="size-5 text-[#ff4b12] dark:text-[#d7ff00]"
                  strokeWidth={2.2}
                />
              }
            >
              <ul className="space-y-2">
                {course.learning_points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300"
                  >
                    <CheckIcon
                      className="mt-0.5 size-4 shrink-0 text-[#ff4b12] dark:text-[#d7ff00]"
                      strokeWidth={2.5}
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>

            <InfoCard
              title="Co będziesz umieć po ukończeniu"
              icon={
                <StarIcon
                  className="size-5 text-[#ff4b12] dark:text-[#d7ff00]"
                  strokeWidth={2.2}
                />
              }
            >
              <ul className="space-y-2">
                {course.outcomes.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300"
                  >
                    <StarIcon
                      className="mt-0.5 size-4 shrink-0 text-[#ff4b12] dark:text-[#d7ff00]"
                      strokeWidth={2.2}
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </InfoCard>

            <InfoCard
              title="Ile czasu zajmuje"
              icon={
                <ClockIcon
                  className="size-5 text-zinc-700 dark:text-zinc-200"
                  strokeWidth={2.2}
                />
              }
              iconClassName="flex size-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-[#282828]"
            >
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {course.duration_label}
              </p>
            </InfoCard>
          </div>
        </div>
      </div>

      {course.demo_youtube_url ? (
        <CourseDemoSection
          youtubeUrl={course.demo_youtube_url}
          kind={course.kind}
        />
      ) : null}

      <section className="mx-auto mt-16 max-w-350 px-8 md:mt-20">
        <div className="text-center">
          <p className="text-[13px] font-bold tracking-[0.22em] text-[#1a4dff] uppercase">
            Opis kursu
          </p>
          <h2 className="mt-4 text-3xl leading-[1.1] font-black tracking-[-0.03em] text-zinc-950 md:text-5xl dark:text-white">
            O kursie
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Dowiedz się więcej o tym, co zawiera kurs i dlaczego warto
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-[#ded9cf] bg-white p-8 md:p-10 dark:border-[#282828] dark:bg-[#1c1c1c]">
          <div className="space-y-5 text-base leading-7 text-zinc-700 dark:text-zinc-300">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-[#ded9cf] pt-8 dark:border-[#282828]">
            {course.duration_label ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f7f3ea] px-4 py-2 text-sm font-semibold text-zinc-700 dark:bg-[#282828] dark:text-zinc-200">
                <ClockIcon className="size-4" strokeWidth={2.2} />
                {course.duration_label}
              </span>
            ) : null}
            {course.format_label ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f7f3ea] px-4 py-2 text-sm font-semibold text-zinc-700 dark:bg-[#282828] dark:text-zinc-200">
                <BookOpenIcon className="size-4" strokeWidth={2.2} />
                {course.format_label}
              </span>
            ) : null}
            {discountPercent != null ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#ff4b12]/10 px-4 py-2 text-sm font-bold text-[#ff4b12] dark:bg-[#ff6b4a]/10 dark:text-[#ff6b4a]">
                <FlameIcon className="size-4" strokeWidth={2.2} />
                -{discountPercent}%
              </span>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
