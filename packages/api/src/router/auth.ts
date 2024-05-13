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
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await ctx.supabase
      .from("users")
      .select()
      .eq("id", ctx.user.id)
      .single();

    if (!data)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "User not found",
      });

    return data;
  }),
  changeSex: protectedProcedure
    .input(
      z.object({
        sex: z.enum(["m", "f"]),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.supabase
        .from("users")
        .update({ sex: input.sex })
        .eq("id", ctx.user.id),
    ),
  changePronouns: protectedProcedure
    .input(
      z.object({
        pronouns: z.string().array(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.supabase
        .from("users")
        .update({ pronouns: input.pronouns })
        .eq("id", ctx.user.id),
    ),
} satisfies TRPCRouterRecord;
