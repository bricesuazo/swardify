import { Session, SupabaseClient } from "@supabase/supabase-js";
import { TRPCError, initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import { Database } from "~/types/supabase";

const t = initTRPC
  .context<{ session: Session | null; supabase: SupabaseClient<Database> }>()
  .create({
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

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
