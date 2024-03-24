import "server-only";

import { headers, cookies } from "next/headers";
import { cache } from "react";

import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { env } from "~/env";

const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  const supabase = createServerComponentClient(
    { cookies },
    {
      supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: env.SUPABASE_SERVICE_ROLE_KEY,
    },
  );

  return createTRPCContext({
    headers: heads,
    supabase,
  });
});

export const api = createCaller(createContext);
