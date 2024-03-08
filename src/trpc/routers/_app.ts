import { protectedProcedure, publicProcedure, router } from '../trpc';
import { authRouter } from './auth';

export const appRouter = router({
  auth: authRouter,
  firstPost: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.supabase.from('users').select();
    return users;
  }),
});

export type AppRouter = typeof appRouter;
