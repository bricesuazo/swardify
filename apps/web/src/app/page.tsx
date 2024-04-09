import { createClient } from "~/supabase/server";
import SignIn from "./_components/sign-in";
import SignedIn from "./_components/signed-in";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <>{session ? <SignedIn /> : <SignIn />}</>;
}
