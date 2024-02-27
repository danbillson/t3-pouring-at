import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { geocode } from "~/utils/maps";
import merge from "deepmerge";
import { eq, sql } from "drizzle-orm";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
});

export const barsRouter = createTRPCRouter({
  getByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const staff = ctx.schema.barStaff;
      const bars = await ctx.db.query.bar.findMany({
        where: (_, { exists }) =>
          exists(
            ctx.db.select().from(staff).where(eq(staff.staffId, input.userId)),
          ),
      });

      return {
        bars,
      };
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const bar = await ctx.db.query.bar.findFirst({
        where: (bar, { eq }) => eq(bar.id, input.id),
        with: {
          staff: true,
        },
      });

      if (!bar) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bar not found",
        });
      }

      return {
        bar,
      };
    }),
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const bar = await ctx.db.query.bar.findFirst({
        where: (bar, { eq }) => eq(bar.slug, input.slug),
        with: {
          staff: true,
          beverages: {
            where: (bev, { isNull }) => isNull(bev.tappedOff),
            with: {
              beverage: {
                with: {
                  brewery: true,
                },
              },
            },
            orderBy: (bev, { desc }) => [desc(bev.tappedOn)],
          },
        },
      });

      if (!bar) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bar not found",
        });
      }

      return {
        bar,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2),
        slug: z
          .string()
          .min(2)
          .regex(/^[a-zA-Z0-9-]+$/i),
        line1: z.string(),
        line2: z.string().optional(),
        city: z.string(),
        postcode: z.string().regex(/^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i),
        openingHours: z.object({
          monday: z.string().optional(),
          tuesday: z.string().optional(),
          wednesday: z.string().optional(),
          thursday: z.string().optional(),
          friday: z.string().optional(),
          saturday: z.string().optional(),
          sunday: z.string().optional(),
        }),
        url: z.string().url().optional().or(z.literal("")),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (reserverdSlugs.includes(input.slug)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reserved slug",
        });
      }

      const { results, status } = await geocode(
        `${input.line1},${input.line2 ? ` ${input.line2} ,` : ""} ${
          input.city
        }, ${input.postcode}`,
        env.GOOGLE_MAPS_SERVER_KEY,
      );

      if (status !== "OK" || !results.length || !results[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid address",
        });
      }

      const [result] = results;

      await ctx.db.insert(ctx.schema.bar).values({
        name: input.name,
        slug: input.slug,
        line1: input.line1,
        line2: input.line2,
        city: input.city,
        postcode: input.postcode,
        longitude: result.geometry.location.lng,
        latitude: result.geometry.location.lat,
        openingHours: input.openingHours,
        url: input.url,
      } satisfies typeof ctx.schema.bar.$inferInsert);

      const bar = await ctx.db.query.bar.findFirst({
        where: (bar, { eq }) => eq(bar.slug, input.slug),
      });

      if (!bar) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create bar",
        });
      }

      await ctx.db.insert(ctx.schema.barStaff).values({
        barId: bar.id,
        staffId: ctx.auth.userId,
      } satisfies typeof ctx.schema.barStaff.$inferInsert);

      return {
        bar,
      };
    }),
  getAllUnverified: protectedProcedure.query(async ({ ctx }) => {
    const bars = await ctx.db.query.bar.findMany({
      where: (bar, { eq }) => eq(bar.verified, false),
      with: {
        staff: true,
      },
    });

    return {
      bars,
    };
  }),
  verify: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(ctx.schema.bar)
        .set({ verified: true, updated: new Date() })
        .where(eq(ctx.schema.bar.id, input.id));

      const bar = await ctx.db.query.bar.findFirst({
        where: (bar, { eq }) => eq(bar.id, input.id),
      });

      if (!bar) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bar not found",
        });
      }

      return {
        bar,
      };
    }),
  search: publicProcedure
    .input(
      z.object({
        location: z.string(),
        style: z.string().optional(),
        brewery: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (ctx.ip) {
        const { success } = await ratelimit.limit(ctx.ip);

        if (!success) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Too many requests",
          });
        }
      }

      const { results, status } = await geocode(
        input.location,
        env.GOOGLE_MAPS_SERVER_KEY,
      );

      if (status !== "OK" || !results.length || !results[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid address",
        });
      }

      const [result] = results;
      const { lng, lat } = result.geometry.location;

      const bars = await ctx.db.query.bar.findMany({
        where: (bar, { and, eq }) =>
          and(
            eq(bar.verified, true),
            sql`ST_Distance_Sphere(POINT(${lng}, ${lat}), POINT(longitude, latitude)) < 1609`,
          ),

        with: {
          beverages: {
            where: (bev, { isNull }) => isNull(bev.tappedOff),
            with: {
              beverage: {
                with: {
                  brewery: true,
                },
              },
            },
            orderBy: (bev, { desc }) => [desc(bev.tappedOn)],
          },
        },
      });

      return { bars, location: { lng, lat } };
    }),
  updateBranding: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        logo: z.string().optional(),
        colours: z
          .object({
            foreground: z.string().optional(),
            background: z.string().optional(),
            accent: z.string().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const bar = await ctx.db.query.bar.findFirst({
        where: (bar, { eq }) => eq(bar.id, input.id),
      });

      if (!bar) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bar not found",
        });
      }

      const branding = bar.branding ?? {};
      const { id: _, ...rest } = input;

      const mergedBranding = merge(branding, rest);

      await ctx.db
        .update(ctx.schema.bar)
        .set({ branding: mergedBranding, updated: new Date() })
        .where(eq(ctx.schema.bar.id, input.id));

      const updatedBar = await ctx.db.query.bar.findFirst({
        where: (bar, { eq }) => eq(bar.id, input.id),
      });

      return {
        bar: updatedBar,
      };
    }),
});

const reserverdSlugs = [
  "api",
  "dashboard",
  "admin",
  "sign-in",
  "sign-out",
  "sign-up",
  "account",
  "settings",
  "create",
  "manage",
  "edit",
  "search",
];
