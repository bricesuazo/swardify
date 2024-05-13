import type { SupabaseClient } from "@supabase/supabase-js";
import { initTRPC, TRPCError } from "@trpc/server";
import Groq from "groq-sdk";
import ollama from "ollama";
import OpenAI from "openai";
import Replicate from "replicate";
import superjson from "superjson";
import { ZodError } from "zod";

import type { Database } from "./../../../supabase/types";
import { env } from "./env";

export const createTRPCContext = async (opts: {
  headers: Headers;
  supabase: SupabaseClient<Database>;
}) => {
  const source = opts.headers.get("x-trpc-source") ?? "unknown";

  const token = opts.headers.get("authorization");

  const {
    data: { user },
  } = token
    ? await opts.supabase.auth.getUser(token)
    : await opts.supabase.auth.getUser();

  console.log(">>> tRPC Request from", source, "by", user?.email);

  return {
    supabase: opts.supabase,
    user,
    openai: new OpenAI({
      apiKey: env.OPENAI_KEY,
    }),
    ollama,
    groq: new Groq({
      apiKey: env.GROQ_API_KEY,
    }),
    replicate: new Replicate({ auth: env.REPLICATE_API_TOKEN }),
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: { user: ctx.user },
  });
});
