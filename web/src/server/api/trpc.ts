import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { env } from "~/env";
import type { Database } from "~/types";

export const createTRPCContext = async (opts: {
  headers: Headers;
  supabase: SupabaseClient<Database>;
}) => {
  const token = opts.headers.get("authorization");

  const {
    data: { user },
  } = token
    ? await opts.supabase.auth.getUser(token)
    : await opts.supabase.auth.getUser();

  return {
    ...opts,
    user,
    supabase: createClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
    ),
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user || ctx.user.id !== env.SUPER_ADMIN_ID) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // infers the `user` as non-nullable
      user: { ...ctx.user },
    },
  });
});
