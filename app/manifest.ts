import type { MetadataRoute } from "next";

import { SITE } from "@/lib/seo/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f1eee5",
    theme_color: "#f24a00",
    lang: "pl",
    icons: [
      {
        src: "/zainaty.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
