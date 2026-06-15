import type { User } from "@supabase/supabase-js";

import { AdminShell } from "./admin-shell";

type AdminDashboardProps = {
  user: User;
};

export function AdminDashboard({ user }: AdminDashboardProps) {
  return <AdminShell user={user} />;
}
