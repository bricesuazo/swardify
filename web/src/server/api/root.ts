import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { mainRouter } from "~/server/api/routers/main";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  main: mainRouter,
});

type AppRouter = typeof appRouter;

type RouterInputs = inferRouterInputs<AppRouter>;

type RouterOutputs = inferRouterOutputs<AppRouter>;

export const createCaller = createCallerFactory(appRouter);

export type { AppRouter, RouterInputs, RouterOutputs };
