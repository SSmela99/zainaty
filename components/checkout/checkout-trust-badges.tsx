import { CloudDownloadIcon, RotateCcwIcon, ShieldCheckIcon } from "lucide-react";

import { checkoutContent } from "./checkout.utils";

const trustIcons = [ShieldCheckIcon, CloudDownloadIcon, RotateCcwIcon] as const;

export function CheckoutTrustBadges() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {checkoutContent.trust.map((item, index) => {
        const Icon = trustIcons[index];

        return (
          <div
            key={item.title}
            className="rounded-2xl border border-[#ded9cf] bg-white p-4 dark:border-[#282828] dark:bg-[#1c1c1c]"
          >
            <Icon
              className="size-5 text-[#ff4b12] dark:text-[#d7ff00]"
              strokeWidth={2.2}
            />
            <p className="mt-3 text-sm font-black text-zinc-950 dark:text-white">
              {item.title}
            </p>
            <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
