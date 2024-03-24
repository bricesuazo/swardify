import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import SignIn from "./_components/sign-in";
import { cookies } from "next/headers";
import SignedIn from "./_components/signed-in";
import type { Database } from "~/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <>{session ? <SignedIn /> : <SignIn />}</>;
}
