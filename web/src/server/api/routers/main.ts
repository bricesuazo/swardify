import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const mainRouter = createTRPCRouter({
  getAllWords: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("words")
      .select("id, swardspeak_words, translated_words")
      .order("created_at", { ascending: true });

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
      const { data, error } = await ctx.supabase.from("words").insert({
        swardspeak_words: input.swardspeak_words,
        translated_words: input.translated_words,
      });

      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch words",
        });

      return data;
    }),
});
