import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (reserverdSlugs.includes(input.slug)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reserved slug",
        });
      }

      const locationRes = await fetch(
        `https://api.postcodes.io/postcodes/${input.postcode}`
      );
      const locationObj = (await locationRes.json()) as PostcodesResponse;

      if (locationObj.status !== 200) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid postcode",
        });
      }

      const location = {
        lon: locationObj.result.longitude,
        lat: locationObj.result.latitude,
      };

      const bar = await ctx.prisma.bar.create({
        data: {
          name: input.name,
          slug: input.slug,
          line1: input.line1,
          line2: input.line2,
          city: input.city,
          postcode: input.postcode,
          location,
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
});

type PostcodesResponse = {
  status: number;
  result: {
    postcode: string;
    longitude: number;
    latitude: number;
  };
};

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
];
