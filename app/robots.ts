import type { MetadataRoute } from "next";

import { PATHS } from "@/lib/paths";
import { getSiteUrl } from "@/lib/stripe/config";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          PATHS.ADMIN,
          PATHS.LOGIN,
          PATHS.LOGIN_ALIAS,
          PATHS.REGISTER,
          PATHS.SET_PASSWORD,
          PATHS.FORGOT_PASSWORD,
          PATHS.RESET_PASSWORD,
          PATHS.ACCOUNT,
          `${PATHS.ACCOUNT}/`,
          "/*/zakup",
          "/*/zakup/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
