import { cache } from "react";
import { headers } from "next/headers";

import { createCaller, createTRPCContext } from "@swardify/api";

import { createClient } from "~/supabase/admin";

const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
    supabase: createClient(),
  });
});

export const api = createCaller(createContext);
