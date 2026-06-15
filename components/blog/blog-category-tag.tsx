import { cn } from "@/lib/utils";

type BlogCategoryTagProps = {
  name: string;
  className?: string;
};

export function BlogCategoryTag({ name, className }: BlogCategoryTagProps) {
  return (
    <p
      className={cn(
        "text-[11px] font-bold tracking-[0.18em] text-[#ff4b12] uppercase dark:text-[#d7ff00]",
        className,
      )}
    >
      {name}
    </p>
  );
}
