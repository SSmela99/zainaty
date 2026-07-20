"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AdminConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isPending?: boolean;
};

export function AdminConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Usuń",
  cancelLabel = "Anuluj",
  onConfirm,
  isPending = false,
}: AdminConfirmDialogProps) {
  const [displayTitle, setDisplayTitle] = useState(title);
  const [displayDescription, setDisplayDescription] = useState(description);

  useEffect(() => {
    if (open) {
      setDisplayTitle(title);
      setDisplayDescription(description);
    }
  }, [open, title, description]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={!isPending}
        className="gap-0 overflow-hidden rounded-2xl border-zinc-200 bg-white p-0 sm:max-w-md dark:border-zinc-800 dark:bg-[#1c1c1c]"
      >
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-black tracking-[-0.02em] text-zinc-950 dark:text-white">
            {displayTitle}
          </DialogTitle>
          <DialogDescription className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {displayDescription}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mx-0 mb-0 flex flex-row justify-end gap-2 rounded-none border-t border-zinc-100 bg-[#f1eee5]/60 px-6 py-4 dark:border-zinc-800 dark:bg-[#151414]/60">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "Usuwanie..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
