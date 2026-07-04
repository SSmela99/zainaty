import type { Metadata } from "next";

import { AccountPage } from "@/components/account";
import { requireUser } from "@/lib/auth/session";
import { listUserAccessibleCourses } from "@/lib/courses/user-courses";

export const metadata: Metadata = {
  title: "Twoje konto",
  description: "Zarządzaj kontem w Z AI na Ty i pobieraj materiały z kursów.",
};

export default async function KontoPage() {
  const user = await requireUser();
  const courses = await listUserAccessibleCourses();

  return (
    <AccountPage
      userEmail={user.email ?? ""}
      courses={courses}
    />
  );
}
