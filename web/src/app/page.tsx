import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import SignInForm from "./_components/signin-form";
import { cookies } from "next/headers";
import SignedIn from "./_components/signed-in";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <main>{session ? <SignedIn /> : <SignInForm />}</main>;
}
