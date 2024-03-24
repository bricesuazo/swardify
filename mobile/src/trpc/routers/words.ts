import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { protectedProcedure, publicProcedure, router } from '../trpc';

export const wordsRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        search_word: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { data: words, error: words_error } = await ctx.supabase
        .from('words')
        .select()
        .order('created_at', { ascending: true });

      if (words_error)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: words_error.message,
        });

      return words.filter((word) =>
        input.search_word
          ? word.swardspeak_words.find(
              (swardspeak_word) =>
                swardspeak_word
                  .toLowerCase()
                  .includes(input.search_word!.toLowerCase()) ||
                word.translated_words.find((translated_word) =>
                  translated_word
                    .toLowerCase()
                    .includes(input.search_word!.toLowerCase()),
                ),
            )
          : true,
      );
    }),
  get: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { data: word, error: word_error } = await ctx.supabase
        .from('words')
        .select()
        .eq('id', input.id)
        .order('created_at', { ascending: true })
        .single();

      if (word_error)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: word_error.message,
        });

      return word;
    }),
  getAllTranslationHistories: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return [];

    const { data: translation_histories, error: translation_histories_error } =
      await ctx.supabase
        .from('translation_histories')
        .select()
        .eq('user_id', ctx.user.id);

    if (translation_histories_error)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: translation_histories_error.message,
      });

    return translation_histories;
  }),
  toggleFavorite: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { data: favorites, error: favorites_error } = await ctx.supabase
        .from('favorites')
        .select()
        .eq('user_id', ctx.user.id)
        .eq('word_id', input.id);

      if (favorites_error)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: favorites_error.message,
        });

      if (favorites.length > 0) {
        await ctx.supabase
          .from('favorites')
          .delete()
          .eq('word_id', input.id)
          .eq('user_id', ctx.user.id);

        return false;
      }

      await ctx.supabase.from('favorites').insert({
        user_id: ctx.user.id,
        word_id: input.id,
      });

      return true;
    }),
  getFavoriteState: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { data: favorites, error: favorites_error } = await ctx.supabase
        .from('favorites')
        .select()
        .eq('user_id', ctx.user.id)
        .eq('word_id', input.id);

      if (favorites_error)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: favorites_error.message,
        });

      return favorites.length > 0;
    }),
  getAllFavorites: protectedProcedure.query(async ({ ctx }) => {
    const { data: favorites, error: favorites_error } = await ctx.supabase
      .from('favorites')
      .select('id, word_id, word:words(swardspeak_words, translated_words)')
      .eq('user_id', ctx.user.id);

    if (favorites_error)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: favorites_error.message,
      });

    return favorites;
  }),
});
