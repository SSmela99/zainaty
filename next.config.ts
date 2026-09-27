import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "i.picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/ebooki",
        destination: "/szkolenia",
        permanent: true,
      },
      {
        source: "/kursy",
        destination: "/szkolenia",
        permanent: true,
      },
      {
        source: "/kursy/:slug",
        destination: "/szkolenia/:slug",
        permanent: true,
      },
      {
        source: "/kursy/szkolenia",
        destination: "/szkolenia",
        permanent: true,
      },
      {
        source: "/kursy/szkolenia-wideo",
        destination: "/szkolenia-wideo",
        permanent: true,
      },
      {
        source: "/kursy/pakiety",
        destination: "/pakiety-szkolen",
        permanent: true,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    proxyClientMaxBodySize: "10mb",
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
