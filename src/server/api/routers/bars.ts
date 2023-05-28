import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const barsRouter = createTRPCRouter({
  getByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const bars = await ctx.prisma.bar.findMany({
        where: {
          staff: {
            some: {
              staffId: input.userId,
            },
          },
        },
      });

      return {
        bars,
      };
    }),
});
