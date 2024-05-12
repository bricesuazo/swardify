import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
// import { Ollama } from "ollama";
import { z } from "zod";

import type { Database } from "../../../../supabase/types";
import { protectedProcedure, publicProcedure } from "../trpc";

export const mobileRouter = {
  getAll: publicProcedure
    .input(
      z.object({
        search_word: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { data: words, error: words_error } = await ctx.supabase
        .from("words")
        .select()
        .order("created_at", { ascending: false })
        .is("deleted_at", null);

      if (words_error)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: words_error.message,
        });

      let favorites: Database["public"]["Tables"]["favorites"]["Row"][] = [];

      if (ctx.user) {
        const { data, error } = await ctx.supabase
          .from("favorites")
          .select()
          .eq("user_id", ctx.user.id);

        if (error)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });

        favorites = data;
      }

      const search_word = input.search_word;

      return words
        .map((word) => ({
          ...word,
          is_favorite: favorites.some(
            (favorite) => favorite.word_id === word.id,
          ),
        }))
        .filter((word) =>
          search_word
            ? word.swardspeak_words.find(
                (swardspeak_word) =>
                  swardspeak_word
                    .toLowerCase()
                    .includes(search_word.toLowerCase()) ||
                  word.translated_words.find((translated_word) =>
                    translated_word
                      .toLowerCase()
                      .includes(search_word.toLowerCase()),
                  ),
              )
            : true,
        );
    }),
  get: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { data: word, error: word_error } = await ctx.supabase
        .from("words")
        .select()
        .eq("id", input.id)
        .order("created_at", { ascending: true })
        .single();

      if (word_error)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: word_error.message,
        });

      return word;
    }),
  getAllTranslationHistories: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return [];

    const { data: translation_histories, error: translation_histories_error } =
      await ctx.supabase
        .from("translation_histories")
        .select()
        .eq("user_id", ctx.user.id)
        .order("created_at", { ascending: false });

    if (translation_histories_error)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: translation_histories_error.message,
      });

    return translation_histories;
  }),
  toggleFavorite: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { data: favorites, error: favorites_error } = await ctx.supabase
        .from("favorites")
        .select()
        .eq("user_id", ctx.user.id)
        .eq("word_id", input.id);

      if (favorites_error)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: favorites_error.message,
        });

      if (favorites.length > 0) {
        await ctx.supabase
          .from("favorites")
          .delete()
          .eq("word_id", input.id)
          .eq("user_id", ctx.user.id);

        return false;
      }

      await ctx.supabase.from("favorites").insert({
        user_id: ctx.user.id,
        word_id: input.id,
      });

      return true;
    }),
  getFavoriteState: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { data: favorites, error: favorites_error } = await ctx.supabase
        .from("favorites")
        .select()
        .eq("user_id", ctx.user.id)
        .eq("word_id", input.id);

      if (favorites_error)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: favorites_error.message,
        });

      return favorites.length > 0;
    }),
  getAllFavorites: protectedProcedure.query(async ({ ctx }) => {
    const { data: favorites, error: favorites_error } = await ctx.supabase
      .from("favorites")
      .select("id, word_id, word:words(swardspeak_words, translated_words)")
      .eq("user_id", ctx.user.id)
      .is("words.deleted_at", null);

    if (favorites_error)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: favorites_error.message,
      });

    return favorites;
  }),
  translate: publicProcedure
    .input(
      z.object({
        type: z.enum(["swardspeak-to-tagalog", "tagalog-to-swardspeak"]),
        input: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { data: words, error: words_error } = await ctx.supabase
        .from("words")
        .select();

      if (words_error)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: words_error.message,
        });

      const response = await ctx.groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are a Swardspeak to Tagalog and vice versa translator." +
              ' The structure of the words in my list: { swardspeak_words:["Swardspeak word 1", "Swardspeak word 2"], translated_words:["Tagalog word 1", "Tagalog word 2"]}[]' +
              ` Here are the words you need to know: ${JSON.stringify(
                words.map((word) => ({
                  swardspeak_words: word.swardspeak_words,
                  translated_words: word.translated_words,
                })),
              )}
              }))}` +
              ' Your output should be a JSON object with a structured like this { success: true, "translation": <translated_word> }. Do not include any additional information.' +
              ' If the word is not in the list, just return { success: false, "error": "Word not found."}.' +
              ' If there is an error, return { success: false, "error": <error message> }.',
          },
          {
            role: "user",
            content:
              `Translate the following ${input.type === "swardspeak-to-tagalog" ? "Swardspeak word to Tagalog" : "Tagalog word to Swardspeak"}: ` +
              input.input,
          },
        ],
        stream: false,
        response_format: { type: "json_object" },
        max_tokens: 120,
      });
      const res = z
        .object({ success: z.literal(true), translation: z.string() })
        .or(z.object({ success: z.literal(false), error: z.string() }))
        .parse(JSON.parse(response.choices[0]?.message.content ?? ""));

      // const { response } = await ctx.ollama.generate({
      //   model: "mixtral",
      //   system:
      //     "You are a Swardspeak to Tagalog and vice versa translator." +
      //     ` Here are the words you need to know:
      //       The structure of the words is: Swardspeak word: Tagalog word ${words
      //         .map(
      //           (word) =>
      //             `${word.swardspeak_words.join(", ")}: ${word.translated_words.join(", ")}`,
      //         )
      //         .join("\n")}` +
      //     ' Your output should be a JSON object with a structured like this { success: true, "translation": <translated_word> }. Do not include any additional information.' +
      //     ' If the word is not in the list, just return { success: false, "error": "Word not found."}.' +
      //     ' If there is an error, return { success: false, "error": <error message> }.',
      //   prompt:
      //     `Translate the following ${input.type === "swardspeak-to-tagalog" ? "Swardspeak word to Tagalog" : "Tagalog word to Swardspeak"}: ` +
      //     input.input,
      //   stream: false,
      //   format: "json",
      //   options: {
      //     temperature: 0.2,
      //   },
      // });
      // const res = z
      //   .object({ success: z.literal(true), translation: z.string() })
      //   .or(z.object({ success: z.literal(false), error: z.string() }))
      //   .parse(JSON.parse(response));

      // const req = await ctx.openai.chat.completions.create({
      //   model: "gpt-4-turbo",
      //   messages: [
      //     {
      //       role: "system",
      //       content:
      //         "You are a Swardspeak to Tagalog and vice versa translator." +
      //         ` Here are the words you need to know:
      //     The structure of the words is: Swardspeak word: Tagalog word ${words
      //       .map(
      //         (word) =>
      //           `${word.swardspeak_words.join(", ")}: ${word.translated_words.join(", ")}`,
      //       )
      //       .join("\n")}` +
      //         ' Your output should be a JSON object with a structured like this { success: true, "translation": "translated word" }. Do not include any additional information.' +
      //         ' If the word is not in the list, just return { success: false, "error": "Word not found."}.' +
      //         ' If there is an error, return { success: false, "error": <error message> }.',
      //     },
      //     {
      //       role: "user",
      //       content:
      //         `Translate the following ${input.type === "swardspeak-to-tagalog" ? "Swardspeak word to Tagalog" : "Tagalog word to Swardspeak"}: ` +
      //         input.input,
      //     },
      //   ],
      //   max_tokens: 60,
      //   temperature: 0.2,
      //   user: ctx.user?.email,
      //   stream: false,
      //   response_format: { type: "json_object" },
      // });
      // const res = z
      //   .object({ success: z.literal(true), translation: z.string() })
      //   .or(z.object({ success: z.literal(false), error: z.string() }))
      //   .parse(JSON.parse(req.choices[0]?.message.content ?? ""));

      if (!res.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: res.error,
        });
      }

      if (ctx.user) {
        const { error } = await ctx.supabase
          .from("translation_histories")
          .insert({
            user_id: ctx.user.id,
            swardspeak:
              input.type === "swardspeak-to-tagalog"
                ? input.input
                : res.translation,
            tagalog:
              input.type === "tagalog-to-swardspeak"
                ? input.input
                : res.translation,
          });
        if (error)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
      }

      return res.translation;
    }),
  getAllContributions: publicProcedure.query(async ({ ctx }) => {
    const { data: contributions, error: contributions_error } =
      await ctx.supabase
        .from("word_contributions")
        .select()
        .order("created_at", { ascending: false })
        .is("deleted_at", null)
        .is("approved_at", null);

    if (contributions_error)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: contributions_error.message,
      });

    return contributions;
  }),
  contribute: protectedProcedure
    .input(
      z.object({
        swardspeak_words: z.string().array(),
        translated_words: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.supabase.from("word_contributions").insert({
        user_id: ctx.user.id,
        swardspeak_words: input.swardspeak_words,
        translated_words: input.translated_words,
      });
    }),
} satisfies TRPCRouterRecord;
