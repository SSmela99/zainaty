import {
  getCourseDiscountPercent,
} from "@/lib/courses/types";
import { formatCoursePriceCompact } from "@/lib/courses/format";
import { cn } from "@/lib/utils";

type CoursePriceProps = {
  price: number;
  discountPrice: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function CoursePrice({
  price,
  discountPrice,
  className,
  size = "md",
}: CoursePriceProps) {
  const discountPercent = getCourseDiscountPercent(price, discountPrice);
  const hasDiscount = discountPrice != null;
  const currentPrice = hasDiscount ? discountPrice : price;

  const currentClass =
    size === "lg"
      ? "text-3xl font-black"
      : size === "sm"
        ? "text-sm font-bold"
        : "text-base font-black";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {hasDiscount ? (
        <>
          <span className="text-sm text-zinc-400 line-through dark:text-zinc-500">
            {formatCoursePriceCompact(price)}
          </span>
          <span
            className={cn(
              currentClass,
              "text-[#f24a00] dark:text-[#ff6a3d]",
            )}
          >
            {formatCoursePriceCompact(currentPrice)}
          </span>
          {discountPercent != null ? (
            <span className="rounded-full bg-[#f24a00]/15 px-2 py-0.5 text-xs font-bold text-[#f24a00] dark:bg-[#ff6a3d]/15 dark:text-[#ff6a3d]">
              -{discountPercent}%
            </span>
          ) : null}
        </>
      ) : (
        <span
          className={cn(
            currentClass,
            "text-zinc-950 dark:text-white",
          )}
        >
          {formatCoursePriceCompact(currentPrice)}
        </span>
      )}
    </div>
  );
}

export function CourseDiscountBadge({
  price,
  discountPrice,
  className,
}: {
  price: number;
  discountPrice: number | null;
  className?: string;
}) {
  const discountPercent = getCourseDiscountPercent(price, discountPrice);
  if (discountPercent == null) return null;

  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-[#f24a00] px-2.5 py-1 text-xs font-black text-white dark:bg-[#ff6a3d]",
        className,
      )}
    >
      -{discountPercent}%
    </span>
  );
}

export function CourseCoverPriceBadge({
  price,
  discountPrice,
}: {
  price: number;
  discountPrice: number | null;
}) {
  if (discountPrice == null) return null;

  return (
    <span className="absolute top-4 right-4 rounded-full bg-zinc-950/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
      <span className="text-zinc-400 line-through">
        {formatCoursePriceCompact(price)}
      </span>{" "}
      {formatCoursePriceCompact(discountPrice)}
    </span>
  );
}
