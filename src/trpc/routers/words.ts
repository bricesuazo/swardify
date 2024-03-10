import { TRPCError } from '@trpc/server';

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
});
