import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

export const wordsRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { data: words, error: words_error } = await ctx.supabase
      .from('words')
      .select()
      .order('created_at', { ascending: true });

    if (words_error)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: words_error.message,
      });

    return words;
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
});
