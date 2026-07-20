type CoursesEmptyStateProps = {
  message: string;
};

export function CoursesEmptyState({ message }: CoursesEmptyStateProps) {
  return (
    <p className="rounded-3xl border border-dashed border-[#ddd8ce] px-6 py-16 text-center text-sm text-zinc-600 dark:border-[#282828] dark:text-zinc-400">
      {message}
    </p>
  );
}
