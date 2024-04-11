import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
  changePassword: protectedProcedure
    .input(
      z.object({
        old_password: z.string(),
        new_password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const {
        data: { user },
      } = await ctx.supabase.auth.signInWithPassword({
        email: ctx.user.email ?? "",
        password: input.old_password,
      });

      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });

      await ctx.supabase.auth.updateUser({ password: input.new_password });
    }),
} satisfies TRPCRouterRecord;
