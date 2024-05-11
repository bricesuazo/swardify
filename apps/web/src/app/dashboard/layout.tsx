import { redirect } from "next/navigation";

import { createClient } from "~/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: React.PropsWithChildren) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  return children;
}
