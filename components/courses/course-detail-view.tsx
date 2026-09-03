import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CheckIcon,
  ClockIcon,
  FlameIcon,
  PlayCircleIcon,
  ShoppingCartIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";

import { CourseCheckoutPromo } from "@/components/checkout/course-checkout-promo";
import {
  CourseCoverPriceBadge,
  CourseDiscountBadge,
  CoursePrice,
} from "@/components/courses/course-price";
import { CourseDemoSection } from "@/components/courses/course-demo-section";
import { splitCourseDescription } from "@/lib/courses/format";
import type { Course } from "@/lib/courses/types";
import { COURSE_KIND_LABELS } from "@/lib/courses/kinds";
import { checkoutPath, courseListPathByKind, coursePath, PATHS, accountVideoCoursePath } from "@/lib/paths";

type CourseDetailViewProps = {
  course: Course;
  hasAccess?: boolean;
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
    <div className="rounded-3xl border border-[#ddd8ce] bg-white p-6 dark:border-[#282828] dark:bg-[#1c1c1c]">
      <div className="flex items-start gap-4">
        <div
          className={
            iconClassName ??
            "flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#ffd0bc] dark:bg-[#3a4500]"
          }
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black tracking-[0.02em] text-zinc-950 dark:text-white">
            {title}
          </h2>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function CourseDetailView({
  course,
  hasAccess = false,
}: CourseDetailViewProps) {
  const paragraphs = splitCourseDescription(course.description);
  const accessHref =
    course.kind === "video"
      ? accountVideoCoursePath(course.slug)
      : PATHS.ACCOUNT;
  const accessLabel =
    course.kind === "video" ? "Przejdź do szkolenia wideo" : "Przejdź do kursu";
  const secondaryParagraphs = splitCourseDescription(
    course.description_secondary,
  );
  const isPackage = course.kind === "package";
  const discountPercent =
    course.discount_price != null && course.price > course.discount_price
      ? Math.round(
          ((course.price - course.discount_price) / course.price) * 100,
        )
      : null;

  return (
    <div className="pb-20 md:pb-28">
      <div className="site-container pt-10 md:pt-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-12">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#f5f2e9] dark:bg-[#151414]">
              {course.cover_image_url ? (
                <Image
                  src={course.cover_image_url}
                  alt={course.title}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center text-3xl font-black tracking-[0.02em] text-[#f24a00] dark:text-[#daff02]">
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
                className="inline-flex items-center gap-2 text-sm font-bold text-[#f24a00] transition-colors hover:text-[#0033ff] dark:text-[#ff6a3d] dark:hover:text-[#daff02]"
              >
                <ArrowLeftIcon className="size-4" strokeWidth={2.2} />
                Wróć do {COURSE_KIND_LABELS[course.kind].toLowerCase()}
              </Link>

              <h1 className="mt-4 text-3xl leading-[1.08] font-black tracking-[0.02em] text-zinc-950 md:text-5xl dark:text-white">
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
                href={hasAccess ? accessHref : checkoutPath(course.slug)}
                className="mt-6 inline-flex h-[4.5rem] w-full items-center justify-center gap-3 rounded-2xl bg-zinc-950 px-12 text-lg font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.01] sm:w-auto dark:bg-[#daff02] dark:text-zinc-950"
              >
                {hasAccess ? (
                  <PlayCircleIcon className="size-6" strokeWidth={2.2} />
                ) : (
                  <ShoppingCartIcon className="size-6" strokeWidth={2.2} />
                )}
                {hasAccess ? accessLabel : "Kup teraz"}
              </Link>

              {!hasAccess ? (
                <div className="mt-6">
                  <CourseCheckoutPromo courseSlug={course.slug} />
                </div>
              ) : null}
            </div>

            {isPackage && course.package_items.length > 0 ? (
              <InfoCard
                title="Co zawiera pakiet"
                icon={
                  <BookOpenIcon
                    className="size-5 text-[#f24a00] dark:text-[#daff02]"
                    strokeWidth={2.2}
                  />
                }
              >
                <ul className="space-y-2">
                  {course.package_items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={coursePath(item.slug)}
                        className="flex items-center gap-3 rounded-xl border border-[#ddd8ce] p-2 transition-colors hover:border-[#f24a00] dark:border-[#282828] dark:hover:border-[#daff02]"
                      >
                        <span className="relative aspect-square size-12 shrink-0 overflow-hidden rounded-lg bg-[#f5f2e9] dark:bg-[#151414]">
                          {item.cover_image_url ? (
                            <Image
                              src={item.cover_image_url}
                              alt={item.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : null}
                        </span>
                        <span className="min-w-0 flex-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                          {item.title}
                          <span className="mt-0.5 block text-xs font-medium text-zinc-500">
                            {COURSE_KIND_LABELS[item.kind]}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </InfoCard>
            ) : null}

            {course.target_audience ? (
              <InfoCard
                title="Dla kogo jest ten kurs"
                icon={
                  <UserIcon
                    className="size-5 text-[#f24a00] dark:text-[#daff02]"
                    strokeWidth={2.2}
                  />
                }
              >
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {course.target_audience}
                </p>
              </InfoCard>
            ) : null}

            {course.learning_points.length > 0 ? (
              <InfoCard
                title="Czego się nauczysz"
                icon={
                  <BookOpenIcon
                    className="size-5 text-[#f24a00] dark:text-[#daff02]"
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
                        className="mt-0.5 size-4 shrink-0 text-[#f24a00] dark:text-[#daff02]"
                        strokeWidth={2.5}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </InfoCard>
            ) : null}

            {course.outcomes.length > 0 ? (
              <InfoCard
                title="Co będziesz umieć po ukończeniu"
                icon={
                  <StarIcon
                    className="size-5 text-[#f24a00] dark:text-[#daff02]"
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
                        className="mt-0.5 size-4 shrink-0 text-[#f24a00] dark:text-[#daff02]"
                        strokeWidth={2.2}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </InfoCard>
            ) : null}

            {course.duration_label ? (
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
            ) : null}
          </div>
        </div>
      </div>

      {course.demo_youtube_url && course.kind !== "training" ? (
        <CourseDemoSection
          youtubeUrl={course.demo_youtube_url}
          kind={course.kind}
        />
      ) : null}

      <section className="site-container mt-16 md:mt-20">
        <div className="text-center">
          <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase">
            Opis kursu
          </p>
          <h2 className="mt-4 text-3xl leading-[1.1] font-black tracking-[0.02em] text-zinc-950 md:text-5xl dark:text-white">
            O kursie
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Dowiedz się więcej o tym, co zawiera kurs i dlaczego warto
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-[#ddd8ce] bg-white p-8 md:p-10 dark:border-[#282828] dark:bg-[#1c1c1c]">
          <div className="space-y-5 text-base leading-7 text-zinc-700 dark:text-zinc-300">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {secondaryParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-[#ddd8ce] pt-8 dark:border-[#282828]">
            {course.duration_label ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f2e9] px-4 py-2 text-sm font-semibold text-zinc-700 dark:bg-[#282828] dark:text-zinc-200">
                <ClockIcon className="size-4" strokeWidth={2.2} />
                {course.duration_label}
              </span>
            ) : null}
            {course.format_label ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f2e9] px-4 py-2 text-sm font-semibold text-zinc-700 dark:bg-[#282828] dark:text-zinc-200">
                <BookOpenIcon className="size-4" strokeWidth={2.2} />
                {course.format_label}
              </span>
            ) : null}
            {discountPercent != null ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f24a00]/10 px-4 py-2 text-sm font-bold text-[#f24a00] dark:bg-[#ff6a3d]/10 dark:text-[#ff6a3d]">
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
