import { publicProcedure, router } from "../trpc";

export const appRouter = router({
  health: publicProcedure.query(({ ctx }) => {
    return "hello";
  }),
  firstPost: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.supabase.from("users").select();
    return users;
  }),
});

export type AppRouter = typeof appRouter;
