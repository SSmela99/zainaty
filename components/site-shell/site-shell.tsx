import { SiteShellClient } from "./site-shell-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col bg-[#f1eee5] dark:bg-[#1a1919]">
        {children}
      </main>
      <SiteFooter />
      <SiteShellClient />
    </div>
  );
}
