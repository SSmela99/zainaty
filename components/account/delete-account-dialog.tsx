"use client";

import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { deleteAccount } from "@/app/actions/auth";
import { signOutUser } from "@/components/auth/auth-actions.client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PATHS } from "@/lib/paths";

import { accountPageContent } from "./account-page.utils";

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const content = accountPageContent.deleteAccount;
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const canConfirm = password.length > 0;

  function handleOpenChange(nextOpen: boolean) {
    if (!isDeleting) {
      onOpenChange(nextOpen);

      if (!nextOpen) {
        setPassword("");
      }
    }
  }

  async function handleDelete() {
    if (!canConfirm) {
      toast.error(content.passwordRequired);
      return;
    }

    setIsDeleting(true);

    const result = await deleteAccount(password);

    if (!result.ok) {
      setIsDeleting(false);
      toast.error(result.error);
      return;
    }

    await signOutUser();
    window.location.assign(PATHS.HOME);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-3xl border border-[#ddd8ce] bg-white p-0 sm:max-w-md dark:border-[#282828] dark:bg-[#1c1c1c]">
        <div
          aria-hidden="true"
          className="h-1.5 bg-[#f24a00] dark:bg-[#daff02]"
        />

        <div className="px-6 pt-6 pb-0">
          <DialogHeader className="text-left">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#ffd0bc] dark:bg-[#3a4500]">
              <Trash2Icon
                strokeWidth={2.2}
                className="size-5 text-[#f24a00] dark:text-[#daff02]"
              />
            </div>
            <DialogTitle className="mt-5 text-xl font-black tracking-[-0.02em] text-zinc-950 dark:text-white">
              {content.title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {content.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-2">
            <label
              htmlFor="delete-account-password"
              className="text-sm font-semibold text-zinc-800 dark:text-zinc-100"
            >
              {content.passwordLabel}
            </label>
            <Input
              id="delete-account-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isDeleting}
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-12 rounded-xl border-[#ddd8ce] bg-[#f5f2e9] text-base dark:border-zinc-700 dark:bg-[#151414] mt-3"
            />
            <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400 mb-3">
              {content.passwordHint}
            </p>
          </div>
        </div>

        <DialogFooter className="-mx-0 -mb-0 mt-0 border-t border-[#ddd8ce] bg-[#f5f2e9]/50 p-0 px-6 py-4 dark:border-[#282828] dark:bg-[#151414]/80">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}
            className="h-11 rounded-xl"
          >
            {content.cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={isDeleting || !canConfirm}
            className="h-11 rounded-xl"
          >
            {isDeleting ? content.deletingLabel : content.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
