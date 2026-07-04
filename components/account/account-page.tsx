"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { signOutUser } from "@/components/auth/auth-actions.client";
import { formatAuthErrorMessage } from "@/components/auth/auth-page.utils";
import type { UserAccessibleCourse } from "@/lib/courses/user-courses";
import { PATHS } from "@/lib/paths";

import { AccountCoursesTab } from "./account-courses-tab";
import { accountPageContent, type AccountTabId } from "./account-page.utils";
import { AccountTabs } from "./account-tabs";

type AccountPageProps = {
  userEmail: string;
  courses: UserAccessibleCourse[];
};

export function AccountPage({ userEmail, courses }: AccountPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AccountTabId>("courses");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    const { error } = await signOutUser();

    setIsLoggingOut(false);

    if (error) {
      toast.error(formatAuthErrorMessage(error.message));
      return;
    }

    toast.success("Wylogowano.");
    router.push(PATHS.HOME);
    router.refresh();
  }

  return (
    <section className="mx-auto w-full max-w-350 px-8 py-12 md:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-[-0.03em] text-zinc-950 dark:text-white">
            {accountPageContent.title}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Zalogowano jako{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">
              {userEmail}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="h-11 shrink-0 cursor-pointer rounded-xl border-2 border-[#ff4b12] px-5 text-sm font-black text-[#ff4b12] transition-transform hover:-translate-y-0.5 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 dark:border-[#d7ff00] dark:text-[#d7ff00]"
        >
          {isLoggingOut
            ? accountPageContent.loggingOutLabel
            : accountPageContent.logoutLabel}
        </button>
      </div>

      <div className="mt-8">
        <AccountTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="mt-8">
        {activeTab === "courses" ? (
          <AccountCoursesTab courses={courses} />
        ) : null}
      </div>
    </section>
  );
}
