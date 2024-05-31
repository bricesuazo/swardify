"use client";

import { useRouter } from "next/navigation";

import { Button } from "@swardify/ui/button";

import { createClient } from "~/supabase/client";

export default function SignOutButton() {
  const supabaseClient = createClient();
  const router = useRouter();
  return (
    <Button
      size="sm"
      onClick={async () => {
        await supabaseClient.auth.signOut();
        router.push("/login");
      }}
    >
      Sign out
    </Button>
  );
}
