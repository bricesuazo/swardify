import { protectedProcedure, publicProcedure, router } from '../trpc';
import { authRouter } from './auth';
import { wordsRouter } from './words';

export const appRouter = router({
  auth: authRouter,
  firstPost: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.supabase.from('users').select();
    return users;
  }),
  words: wordsRouter,
});

export type AppRouter = typeof appRouter;
