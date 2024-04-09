import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const webRouter = {
  getAllWords: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("words")
      .select("id, swardspeak_words, translated_words")
      .order("created_at", { ascending: false });

    if (error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch words",
      });

    return data;
  }),
  createWords: protectedProcedure
    .input(
      z.object({
        swardspeak_words: z.array(z.string()).min(1),
        translated_words: z.array(z.string()).min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase.from("words").insert({
        swardspeak_words: input.swardspeak_words,
        translated_words: input.translated_words,
      });

      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create words",
        });
    }),
  updateWords: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        swardspeak_words: z.array(z.string()).min(1),
        translated_words: z.array(z.string()).min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase
        .from("words")
        .update({
          swardspeak_words: input.swardspeak_words,
          translated_words: input.translated_words,
        })
        .eq("id", input.id);

      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update words",
        });
    }),
  deleteWords: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase
        .from("words")
        .delete()
        .eq("id", input.id);

      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete words",
        });
    }),
} satisfies TRPCRouterRecord;
