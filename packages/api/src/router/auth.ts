import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  isLoggedIn: publicProcedure.query(({ ctx }) => {
    return !!ctx.user;
  }),
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
} satisfies TRPCRouterRecord;
