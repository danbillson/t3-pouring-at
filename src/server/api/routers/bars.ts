import type { Prisma } from "@prisma/client";
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
import { prisma } from "~/server/db";
import { geocode } from "~/utils/maps";
import merge from "deepmerge";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
});

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
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const bar = await ctx.prisma.bar.findUnique({
        where: {
          id: input.id,
        },
        include: {
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
      const bar = await ctx.prisma.bar.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          staff: true,
          beverages: {
            where: {
              tappedOff: null,
            },
            include: {
              beverage: {
                include: {
                  brewery: true,
                },
              },
            },
            orderBy: {
              tappedOn: "desc",
            },
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

      const bar = await ctx.prisma.bar.create({
        data: {
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
          updated: new Date(),
          staff: {
            create: {
              staffId: ctx.auth.userId,
            },
          },
        },
      });

      return {
        bar,
      };
    }),
  getAllUnverified: protectedProcedure.query(async ({ ctx }) => {
    const bars = await ctx.prisma.bar.findMany({
      where: {
        verified: false,
      },
      include: {
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
      const bar = await ctx.prisma.bar.update({
        where: {
          id: input.id,
        },
        data: {
          verified: true,
        },
      });

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

      const query = await prisma.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM Bar WHERE ST_Distance_Sphere(POINT(${lng}, ${lat}), POINT(longitude, latitude)) < 1609;`;

      const bars = await ctx.prisma.bar.findMany({
        where: {
          id: {
            in: query.map((bar) => bar.id),
          },
          verified: true,
        },
        include: {
          beverages: {
            where: {
              tappedOff: null,
            },
            include: {
              beverage: {
                include: {
                  brewery: true,
                },
              },
            },
            orderBy: {
              tappedOn: "desc",
            },
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
      const bar = await ctx.prisma.bar.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!bar) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bar not found",
        });
      }

      const branding = bar.branding as Prisma.JsonObject;
      const { id: _, ...rest } = input;

      const mergedBranding = merge(branding, rest);

      const updatedBar = await ctx.prisma.bar.update({
        where: {
          id: input.id,
        },
        data: {
          branding: mergedBranding,
        },
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
