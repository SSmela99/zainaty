import { redirect } from "next/navigation";

import { PATHS } from "@/lib/paths";

type LoginAliasPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginAliasPage({
  searchParams,
}: LoginAliasPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      query.set(key, value);
    }
  }

  const queryString = query.toString();
  redirect(`${PATHS.LOGIN}${queryString ? `?${queryString}` : ""}`);
}
