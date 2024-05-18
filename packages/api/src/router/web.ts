import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Database } from "../../../../supabase/types";
import { adminProcedure, publicProcedure } from "../trpc";

export const webRouter = {
  getAllPhrases: publicProcedure.query(async ({ ctx }) => {
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
  getAllWords: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("words")
      .select(
        "id, definition, examples, part_of_speech, swardspeak_words, translated_words",
      )
      .order("created_at", { ascending: false })
      .is("deleted_at", null);

    if (error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch words",
      });

    return data;
  }),
  createWord: adminProcedure
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
  createPhrase: adminProcedure
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
  updateWord: adminProcedure
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
  updatePhrase: adminProcedure
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
  deleteWord: adminProcedure
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
  deletePhrase: adminProcedure
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
  getAllWordContributions: adminProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("word_contributions")
      .select("*, vote: word_votes(user_id, vote), user: users(email)")
      .order("created_at", { ascending: false });

    if (error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch contributions",
      });

    return data
      .map((contribution) => ({
        ...contribution,
        vote_count:
          contribution.vote.filter((vote) => vote.vote === "upvote").length -
          contribution.vote.filter((vote) => vote.vote === "downvote").length,
      }))
      .sort((a) => a.vote_count);
  }),
  toggleDeleteWordContribution: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { data } = await ctx.supabase
        .from("word_contributions")
        .select("deleted_at")
        .eq("id", input.id)
        .single();

      if (!data)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete contribution",
        });

      await ctx.supabase
        .from("word_contributions")
        .update({
          deleted_at: !data.deleted_at ? new Date().toISOString() : null,
        })
        .eq("id", input.id);
    }),
  toggleUpdateWordContribution: adminProcedure
    .input(
      z.object({
        id: z.string(),
        update: z.literal("approved").or(z.literal("declined")),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { data } = await ctx.supabase
        .from("word_contributions")
        .select(
          "*, swardspeak_words, translated_words, approved_at, declined_at",
        )
        .eq("id", input.id)
        .single();

      if (!data)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update contribution",
        });

      if (input.update === "approved" && !data.approved_at) {
        await ctx.supabase.from("words").insert({
          swardspeak_words: data.swardspeak_words,
          translated_words: data.translated_words,
          word_contribution_id: data.id,
        });
      }
      await ctx.supabase
        .from("word_contributions")
        .update({
          approved_at:
            input.update === "approved" && !data.approved_at
              ? new Date().toISOString()
              : null,
          declined_at:
            input.update === "declined" && !data.declined_at
              ? new Date().toISOString()
              : null,
        })
        .eq("id", input.id);
    }),
  updateWordDefinition: adminProcedure
    .input(
      z.object({
        id: z.string(),
        definition: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase
        .from("words")
        .update({
          definition: input.definition,
        })
        .eq("id", input.id);

      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update word definition",
        });
    }),
  updateWordExamples: adminProcedure
    .input(
      z.object({
        id: z.string(),
        examples: z.string().array(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase
        .from("words")
        .update({
          examples: input.examples,
        })
        .eq("id", input.id);

      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update word examples",
        });
    }),
  updateWordPOS: adminProcedure
    .input(
      z.object({
        id: z.string(),
        part_of_speech: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase
        .from("words")
        .update({
          part_of_speech:
            input.part_of_speech as Database["public"]["Enums"]["part_of_speech"],
        })
        .eq("id", input.id);

      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update word examples",
        });
    }),
} satisfies TRPCRouterRecord;
