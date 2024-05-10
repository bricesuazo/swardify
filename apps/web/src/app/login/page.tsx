import { redirect } from "next/navigation";

import { createClient } from "~/supabase/server";
import SignIn from "../_components/sign-in";

export const dynamic = "force-dynamic";

export default async function Login() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) redirect("/dashboard");

  return <SignIn />;
}
