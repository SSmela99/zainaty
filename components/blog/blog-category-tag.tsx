import { cn } from "@/lib/utils";

type BlogCategoryTagProps = {
  name: string;
  className?: string;
};

export function BlogCategoryTag({ name, className }: BlogCategoryTagProps) {
  return (
    <p
      className={cn(
        "text-[11px] font-bold tracking-[0.18em] text-[#f24a00] uppercase dark:text-[#daff02]",
        className,
      )}
    >
      {name}
    </p>
  );
}
