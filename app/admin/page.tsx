import Link from "next/link";

import { AdminAccessDenied } from "@/components/admin/admin-access-denied";
import { AdminDashboard, AdminLoginForm } from "@/components/admin";
import { ThemeToggle } from "@/components/theme-toggle";
import { getUserProfile, isAdminRole } from "@/lib/auth/queries";
import { PATHS } from "@/lib/paths";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <section className="flex h-dvh flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-6">
          <Link
            href={PATHS.HOME}
            className="inline-flex cursor-pointer items-center rounded-[5px] border-2 border-[#0033ff] bg-transparent px-4 py-2.5 text-[13px] leading-none font-black text-[#0033ff] transition-transform hover:-translate-y-0.5 hover:scale-105"
          >
            Wróć na stronę
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-8 pb-16">
          <div className="w-full max-w-md">
            <AdminLoginForm />
          </div>
        </div>
      </section>
    );
  }

  const profile = await getUserProfile(supabase, user.id);

  if (!isAdminRole(profile?.role)) {
    return <AdminAccessDenied email={user.email} />;
  }

  return <AdminDashboard user={user} />;
}
