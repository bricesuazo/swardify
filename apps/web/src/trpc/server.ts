import { cache } from "react";
import { headers } from "next/headers";
import { createCaller, createTRPCContext } from "@swardify/api";

import { createClient as createClientAdmin } from "~/supabase/admin";
import { createClient as createClientServer } from "~/supabase/server";

const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  const supabase = createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return createTRPCContext({
    headers: heads,
    user,
    supabase: createClientAdmin(),
  });
});

export const api = createCaller(createContext);
