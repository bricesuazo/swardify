import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  isLoggedIn: publicProcedure.query(async ({ ctx }) => {
    return !!ctx.user;
  }),
});
