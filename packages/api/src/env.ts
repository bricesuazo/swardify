import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  server: {
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
    OPENAI_KEY: z.string(),
    GROQ_API_KEY: z.string(),
    HUGGINGFACE_API_KEY: z.string(),
    REPLICATE_API_TOKEN: z.string(),
    DISCORD_WEBHOOK_URL: z.string(),
  },
  client: {},
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation:
    !!process.env.CI ||
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === "lint",
});
