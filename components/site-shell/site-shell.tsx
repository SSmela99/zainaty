import { NewsletterDialog } from "@/components/newsletter";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col bg-[#f2efe6] dark:bg-[#111111]">
        {children}
      </main>
      <SiteFooter />
      <NewsletterDialog />
      <Toaster />
    </div>
  );
}
