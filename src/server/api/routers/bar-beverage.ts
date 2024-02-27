import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const barBeverageRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        barId: z.string(),
        brewery: z.string().min(1),
        name: z.string().min(1),
        style: z.string().min(1),
        abv: z.number().nonnegative().lte(100).multipleOf(0.1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      let brewery = await ctx.db.query.brewery.findFirst({
        where: (brewery, { eq }) => eq(brewery.name, input.brewery),
      });

      if (!brewery) {
        await ctx.db.insert(ctx.schema.brewery).values({
          name: input.brewery,
        } satisfies typeof ctx.schema.brewery.$inferInsert);

        brewery = await ctx.db.query.brewery.findFirst({
          where: (brewery, { eq }) => eq(brewery.name, input.brewery),
        });

        if (!brewery)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create brewery",
          });
      }

      let beverage = await ctx.db.query.beverage.findFirst({
        where: (bev, { eq, and }) =>
          and(eq(bev.name, input.name), eq(bev.breweryId, brewery!.id)),
      });

      if (!beverage) {
        await ctx.db.insert(ctx.schema.beverage).values({
          name: input.name,
          abv: String(input.abv),
          style: input.style,
          breweryId: brewery.id,
        } satisfies typeof ctx.schema.beverage.$inferInsert);
        beverage = await ctx.db.query.beverage.findFirst({
          where: (bev, { eq, and }) =>
            and(eq(bev.name, input.name), eq(bev.breweryId, brewery!.id)),
        });
        if (!beverage)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create beverage",
          });
      }

      await ctx.db.insert(ctx.schema.barBeverage).values({
        barId: input.barId,
        beverageId: beverage.id,
      } satisfies typeof ctx.schema.barBeverage.$inferInsert);

      const barBeverage = await ctx.db.query.barBeverage.findFirst({
        where: (bb, { and, eq }) =>
          and(eq(bb.barId, input.barId), eq(bb.beverageId, beverage!.id)),
      });

      return { barBeverage };
    }),
  untap: protectedProcedure
    .input(z.object({ barId: z.string(), beverageId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const barBeverageSchema = ctx.schema.barBeverage;

      await ctx.db
        .update(barBeverageSchema)
        .set({
          tappedOff: new Date().toISOString(),
        })
        .where(
          and(
            eq(barBeverageSchema.barId, input.barId),
            eq(barBeverageSchema.beverageId, input.beverageId),
          ),
        );

      const barBeverage = await ctx.db.query.barBeverage.findFirst({
        where: (bb, { and, eq }) =>
          and(eq(bb.barId, input.barId), eq(bb.beverageId, input.beverageId)),
      });

      return { barBeverage };
    }),
});
