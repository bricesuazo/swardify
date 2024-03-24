import { SupabaseClient, User } from '@supabase/supabase-js';
import { TRPCError, initTRPC } from '@trpc/server';
import { ZodError } from 'zod';
import { Database } from '~/types';

const t = initTRPC
  .context<{ user: User | null; supabase: SupabaseClient<Database> }>()
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
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // infers the `user` as non-nullable
      user: { ...ctx.user },
    },
  });
});
