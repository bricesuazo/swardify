import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { protectedProcedure, publicProcedure, router } from '../trpc';

export const authRouter = router({
  isLoggedIn: publicProcedure.query(({ ctx }) => {
    return !!ctx.user;
  }),
  changePassword: protectedProcedure
    .input(
      z.object({
        new_password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase.auth.updateUser({
        password: input.new_password,
      });

      if (error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
    }),
});
