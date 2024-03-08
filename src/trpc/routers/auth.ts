import { publicProcedure, router } from '../trpc';

export const authRouter = router({
  isLoggedIn: publicProcedure.query(({ ctx }) => {
    return !!ctx.user;
  }),
});
