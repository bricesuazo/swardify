import { router } from '../trpc';
import { authRouter } from './auth';
import { wordsRouter } from './words';

export const appRouter = router({
  auth: authRouter,
  words: wordsRouter,
});

export type AppRouter = typeof appRouter;
