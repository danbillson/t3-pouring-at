import { createTRPCRouter } from "~/server/api/trpc";
import { barBeverageRouter } from "./routers/bar-beverage";
import { barsRouter } from "./routers/bars";

export const appRouter = createTRPCRouter({
  bars: barsRouter,
  barBeverage: barBeverageRouter,
});

export type AppRouter = typeof appRouter;
