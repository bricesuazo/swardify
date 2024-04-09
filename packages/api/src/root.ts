import { authRouter } from "./router/auth";
import { mobileRouter } from "./router/mobile";
import { webRouter } from "./router/web";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  web: webRouter,
  mobile: mobileRouter,
});

export type AppRouter = typeof appRouter;
