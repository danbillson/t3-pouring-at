import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const barBeverageRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        barId: z.string(),
        brewery: z.string().nonempty(),
        name: z.string().nonempty(),
        style: z.string().nonempty(),
        abv: z.number().nonnegative().lte(100).multipleOf(0.1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const barBeverage = await ctx.prisma.barBeverage.create({
        data: {
          bar: {
            connect: {
              id: input.barId,
            },
          },
          beverage: {
            create: {
              name: input.name,
              abv: input.abv,
              style: input.style,
              brewery: {
                connectOrCreate: {
                  where: {
                    name: input.brewery,
                  },
                  create: {
                    name: input.brewery,
                    location: {},
                  },
                },
              },
            },
          },
        },
      });

      return { barBeverage };
    }),
  untap: protectedProcedure
    .input(z.object({ barId: z.string(), beverageId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const barBeverage = await ctx.prisma.barBeverage.update({
        where: {
          barId_beverageId: {
            barId: input.barId,
            beverageId: input.beverageId,
          },
        },
        data: {
          tappedOff: new Date(),
        },
      });

      return { barBeverage };
    }),
});
