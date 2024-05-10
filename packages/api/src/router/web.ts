import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const webRouter = {
  getAllPhrases: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("phrases")
      .select("id, swardspeak_phrase, translated_phrase")
      .order("created_at", { ascending: false })
      .is("deleted_at", null);

    if (error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch phrases",
      });

    return data;
  }),
  getAllWords: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("words")
      .select("id, swardspeak_words, translated_words")
      .order("created_at", { ascending: false })
      .is("deleted_at", null);

    if (error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch words",
      });

    return data;
  }),
  createWord: protectedProcedure
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
          message: "Failed to create word",
        });
    }),
  createPhrase: protectedProcedure
    .input(
      z.object({
        swardspeak_phrase: z.string().min(1),
        translated_phrase: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase.from("phrases").insert({
        swardspeak_phrase: input.swardspeak_phrase,
        translated_phrase: input.translated_phrase,
      });

      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create phrase",
        });
    }),
  updateWord: protectedProcedure
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
          message: "Failed to update word",
        });
    }),
  updatePhrase: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        swardspeak_phrase: z.string().min(1),
        translated_phrase: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase
        .from("phrases")
        .update({
          swardspeak_phrase: input.swardspeak_phrase,
          translated_phrase: input.translated_phrase,
        })
        .eq("id", input.id);

      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update word",
        });
    }),
  deleteWord: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase
        .from("words")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", input.id);

      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete word",
        });
    }),
  deletePhrase: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase
        .from("phrases")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", input.id);

      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete phrase",
        });
    }),
} satisfies TRPCRouterRecord;
