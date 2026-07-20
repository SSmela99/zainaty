import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteShell } from "@/components/site-shell";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SiteShell>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      {children}
    </SiteShell>
  );
}
