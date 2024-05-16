"use client";

import { Button } from "@swardify/ui/button";

import { createClient } from "~/supabase/client";

export default function SignOutButton() {
  const supabaseClient = createClient();
  return (
    <Button
      type="submit"
      size="sm"
      onClick={() => supabaseClient.auth.signOut()}
    >
      Sign out
    </Button>
  );
}
