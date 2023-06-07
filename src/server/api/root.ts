import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { barsRouter } from "./routers/bars";
import { barBeverageRouter } from "./routers/bar-beverage";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  bars: barsRouter,
  barBeverage: barBeverageRouter,
});

export type AppRouter = typeof appRouter;
