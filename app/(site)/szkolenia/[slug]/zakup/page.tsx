import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CheckoutView } from "@/components/checkout";
import { userOwnsCourse } from "@/lib/courses/access";
import { getPublishedCourseBySlug } from "@/lib/courses/queries";
import { PATHS } from "@/lib/paths";
import { NO_INDEX_ROBOTS } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";

type CheckoutPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ kod?: string }>;
};

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getPublishedCourseBySlug(slug);

  if (!course) {
    return { title: "Zakup — kurs nie znaleziony", robots: NO_INDEX_ROBOTS };
  }

  return {
    title: `Zakup — ${course.title}`,
    description: `Finalizacja zakupu: ${course.title}`,
    robots: NO_INDEX_ROBOTS,
  };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  const { slug } = await params;
  const { kod } = await searchParams;
  const course = await getPublishedCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const hasAccess = await userOwnsCourse(supabase, user.id, course.id);

    if (hasAccess) {
      redirect(PATHS.ACCOUNT);
    }
  }

  return (
    <CheckoutView
      course={course}
      isLoggedIn={Boolean(user)}
      initialCode={kod}
    />
  );
}
