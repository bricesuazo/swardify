import { cookies, headers } from "next/headers";
import { experimental_nextCacheLink as nextCacheLink } from "@trpc/next/app-dir/links/nextCache";
import { experimental_createTRPCNextAppDirServer as createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";
import superjson from "superjson";

import type { AppRouter } from "@swardify/api";
import { appRouter, createTRPCContext } from "@swardify/api";

import { createClient as createAdminClient } from "~/supabase/admin";
import { createClient as createServerClient } from "~/supabase/server";

export const api = createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      links: [
        nextCacheLink({
          transformer: superjson,
          router: appRouter,
          revalidate: false,
          createContext: async () => {
            const heads = new Headers(headers());
            heads.set("x-trpc-source", "rsc");

            const serverClient = createServerClient();
            const { data } = await serverClient.auth.getSession();

            if (data?.session?.access_token)
              heads.set("authorization", data.session.access_token);
            heads.set("cookies", cookies().toString());

            return createTRPCContext({
              headers: heads,
              supabase: createAdminClient(),
            });
          },
        }),
      ],
    };
  },
});
