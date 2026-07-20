import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Panel admina",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-dvh overflow-hidden bg-[#f1eee5] text-zinc-950 dark:bg-[#1a1919] dark:text-white">
      {children}
      <Toaster closeButton position="top-right" richColors />
    </div>
  );
}
