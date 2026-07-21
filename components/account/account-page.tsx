"use client";

import { useState } from "react";
import { toast } from "sonner";

import { signOutUser } from "@/components/auth/auth-actions.client";
import { formatAuthErrorMessage } from "@/components/auth/auth-page.utils";
import type { UserAccessibleCourse } from "@/lib/courses/user-courses.shared";
import { PATHS } from "@/lib/paths";
import { cn } from "@/lib/utils";

import { AccountCoursesTab } from "./account-courses-tab";
import { accountPageContent, type AccountTabId } from "./account-page.utils";
import { AccountTabs } from "./account-tabs";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { InvoicesInfoDialog } from "./invoices-info-dialog";

type AccountPageProps = {
  userEmail: string;
  courses: UserAccessibleCourse[];
};

export function AccountPage({ userEmail, courses }: AccountPageProps) {
  const [activeTab, setActiveTab] = useState<AccountTabId>("courses");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isInvoicesDialogOpen, setIsInvoicesDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    const { error } = await signOutUser();

    if (error) {
      setIsLoggingOut(false);
      toast.error(formatAuthErrorMessage(error.message));
      return;
    }

    window.location.assign(PATHS.HOME);
  }

  return (
    <section
      className={cn(
        "mx-auto w-full max-w-350 px-8 py-12 transition-opacity duration-300 ease-out md:py-16",
        isLoggingOut && "pointer-events-none opacity-45",
      )}
      aria-busy={isLoggingOut}
    >
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

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={() => setIsInvoicesDialogOpen(true)}
            disabled={isLoggingOut}
            className="h-11 cursor-pointer rounded-xl border-2 border-[#0033ff] px-5 text-sm font-black text-[#0033ff] transition-transform hover:-translate-y-0.5 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 dark:border-[#6688ff] dark:text-[#6688ff]"
          >
            {accountPageContent.invoicesLabel}
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isLoggingOut}
            className="h-11 cursor-pointer rounded-xl border-2 border-red-600 px-5 text-sm font-black text-red-600 transition-transform hover:-translate-y-0.5 hover:scale-[1.02] hover:border-red-700 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-70 dark:border-red-500 dark:text-red-400 dark:hover:border-red-400 dark:hover:text-red-300"
          >
            {accountPageContent.deleteAccountLabel}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="h-11 cursor-pointer rounded-xl border-2 border-[#f24a00] px-5 text-sm font-black text-[#f24a00] transition-transform hover:-translate-y-0.5 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 dark:border-[#daff02] dark:text-[#daff02]"
          >
            {isLoggingOut
              ? accountPageContent.loggingOutLabel
              : accountPageContent.logoutLabel}
          </button>
        </div>
      </div>

      <InvoicesInfoDialog
        open={isInvoicesDialogOpen}
        onOpenChange={setIsInvoicesDialogOpen}
      />

      <DeleteAccountDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />

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
