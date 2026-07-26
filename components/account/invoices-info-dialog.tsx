"use client";

import { FileTextIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { createBillingPortalSession } from "@/app/actions/billing-portal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { accountPageContent } from "./account-page.utils";

type InvoicesInfoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InvoicesInfoDialog({
  open,
  onOpenChange,
}: InvoicesInfoDialogProps) {
  const content = accountPageContent.invoices;
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (!isOpeningPortal) {
      onOpenChange(nextOpen);
    }
  }

  async function handleOpenPortal() {
    setIsOpeningPortal(true);

    const result = await createBillingPortalSession();

    if (!result.ok) {
      setIsOpeningPortal(false);
      toast.error(result.error);
      return;
    }

    window.location.assign(result.url);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-2xl ring-0 sm:max-w-md dark:bg-[#1c1c1c]">
        <DialogHeader className="space-y-3 px-6 pt-6 pb-2 text-left">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#dfe5ff] text-[#0033ff] dark:bg-[#1a2a5e] dark:text-[#6688ff]">
            <FileTextIcon className="size-6" aria-hidden />
          </div>
          <DialogTitle className="text-xl font-black tracking-[0.02em] text-zinc-950 dark:text-white">
            {content.dialogTitle}
          </DialogTitle>
          <DialogDescription className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {content.dialogDescription}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mx-0 mb-0 mt-4 flex flex-col-reverse gap-2 border-t border-[#ddd8ce] bg-[#f1eee5]/60 px-6 py-4 sm:flex-row sm:justify-end dark:border-[#282828] dark:bg-[#151414]/60">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isOpeningPortal}
            className="h-11 cursor-pointer rounded-xl border-2 border-[#ddd8ce] bg-transparent px-5 text-sm font-black text-zinc-800 hover:bg-white dark:border-[#333333] dark:text-zinc-200 dark:hover:bg-[#242424]"
          >
            {content.dialogCloseLabel}
          </Button>
          <Button
            type="button"
            onClick={handleOpenPortal}
            disabled={isOpeningPortal}
            className="h-11 cursor-pointer rounded-xl bg-[#f24a00] px-5 text-sm font-black text-white hover:bg-[#d94200] disabled:opacity-70 dark:bg-[#daff02] dark:text-zinc-950 dark:hover:bg-[#9bec00]"
          >
            {isOpeningPortal
              ? content.dialogOpenPortalLoadingLabel
              : content.dialogOpenPortalLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
