import { ExpoRequest, ExpoResponse } from "expo-router/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "~/trpc/routers/_app";
import { createClient } from "@supabase/supabase-js";
import { Database } from "~/types/supabase";

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: ExpoRequest) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: req as unknown as Request,
    router: appRouter,
    createContext: async () => {
      const { data: session } = await supabase.auth.getSession();
      return { session, supabase };
    },
  });
}

export async function POST(req: ExpoRequest) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: req as unknown as Request,
    router: appRouter,
    createContext: async () => {
      const { data: session } = await supabase.auth.getSession();
      return { session, supabase };
    },
  });
}
