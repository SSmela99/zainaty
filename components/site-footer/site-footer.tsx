import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { CookieSettingsButton } from "@/components/cookie-consent";
import { getFooterSettings } from "@/lib/footer/queries";
import { PATHS } from "@/lib/paths";
import {
  getFooterContactLines,
  getFooterSocialUrl,
} from "@/lib/footer/utils";

import {
  footerLegalLinks,
  footerNavItems,
  footerSocials,
  SocialGlyph,
} from "./site-footer.utils";

export async function SiteFooter() {
  const settings = await getFooterSettings();
  const contactLines = getFooterContactLines(settings);
  const currentYear = new Date().getFullYear();

  return (
    <footer
      data-cursor-invert
      className="relative overflow-hidden bg-[#6b1cb1] text-white dark:bg-[#daff02] dark:text-zinc-950"
    >
      <div className="relative z-10 site-container-medium pt-14 pb-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <Link
              href={PATHS.HOME}
              aria-label="Z AI na Ty — strona główna"
              className="inline-block text-current transition-colors hover:text-[#f24a00] dark:hover:text-[#6b1cb1]"
            >
              <BrandLogo className="h-12 w-auto md:h-[3.3rem]" />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-6">{settings.description}</p>
            <div className="mt-6 flex items-center gap-2">
              {footerSocials.map(({ key, label }) => {
                const href = getFooterSocialUrl(settings, key);
                if (!href) return null;

                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-7 items-center justify-center rounded-full border border-current transition-transform hover:-translate-y-0.5 hover:scale-105"
                  >
                    <SocialGlyph name={key} />
                  </a>
                );
              })}
            </div>
            <svg
              aria-hidden
              viewBox="0 0 80 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="mt-3 h-3 w-20 text-current"
            >
              <path d="M2 8 Q 7 1 12 8 T 22 8 T 32 8 T 42 8 T 52 8 T 62 8 T 72 8" />
            </svg>
          </div>

          <div>
            <div className="text-xs font-black tracking-[0.08em] text-[#f24a00] dark:text-zinc-950">
              KONTAKT
            </div>
            <ul className="mt-5 space-y-2.5 text-sm">
              {contactLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-black tracking-[0.08em] text-[#f24a00] dark:text-zinc-950">
              NAWIGACJA
            </div>
            <ul className="mt-5 space-y-2.5 text-sm">
              {footerNavItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/30 pt-5 text-xs dark:border-zinc-950/30">
          <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
            <div>© {currentYear} Z AI na Ty. Wszelkie prawa zastrzeżone.</div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {footerLegalLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:underline">
                  {link.label}
                </Link>
              ))}
              <CookieSettingsButton className="cursor-pointer hover:underline" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
