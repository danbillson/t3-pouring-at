"use server";
import { eq, and } from "drizzle-orm";
import { db, schema } from ".";
import { z } from "zod";
import { geocode } from "~/utils/maps";
import { env } from "~/env.mjs";
import { auth } from "@clerk/nextjs";
import merge from "deepmerge";

export async function verifyBar(id: string) {
  await db
    .update(schema.bar)
    .set({ verified: true, updated: new Date() })
    .where(eq(schema.bar.id, id));

  const bar = await db.query.bar.findFirst({
    where: (bar, { eq }) => eq(bar.id, id),
  });

  if (!bar) {
    throw new Error("bar not found");
  }

  return {
    bar,
  };
}

const CreateBarInput = z.object({
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
});

type Result =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
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
  "search",
];
export async function createBar(
  input: z.infer<typeof CreateBarInput>,
): Promise<Result> {
  const { userId } = auth();

  if (!userId) {
    return { success: false, message: "Not authenticated" };
  }

  if (reserverdSlugs.includes(input.slug)) {
    return { success: false, message: "Reserved slug" };
  }

  const { results, status } = await geocode(
    `${input.line1},${input.line2 ? ` ${input.line2} ,` : ""} ${input.city}, ${
      input.postcode
    }`,
    env.GOOGLE_MAPS_SERVER_KEY,
  );

  if (status !== "OK" || !results.length || !results[0]) {
    return { success: false, message: "Invalid address" };
  }

  const [result] = results;

  await db.insert(schema.bar).values({
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
  } satisfies typeof schema.bar.$inferInsert);

  const bar = await db.query.bar.findFirst({
    where: (bar, { eq }) => eq(bar.slug, input.slug),
  });

  if (!bar) {
    return { success: false, message: "Failed to create bar" };
  }

  await db.insert(schema.barStaff).values({
    barId: bar.id,
    staffId: userId,
  } satisfies typeof schema.barStaff.$inferInsert);

  return {
    success: true,
  };
}
const BrandingInput = z.object({
  id: z.string(),
  logo: z.string().optional(),
  colours: z
    .object({
      foreground: z.string().optional(),
      background: z.string().optional(),
      accent: z.string().optional(),
    })
    .optional(),
});

export async function updateBranding(input: z.infer<typeof BrandingInput>) {
  const bar = await db.query.bar.findFirst({
    where: (bar, { eq }) => eq(bar.id, input.id),
  });

  if (!bar) {
    throw new Error("Bar not found");
  }

  const branding = bar.branding ?? {};
  const { id: _, ...rest } = input;

  const mergedBranding = merge(branding, rest);

  await db
    .update(schema.bar)
    .set({ branding: mergedBranding, updated: new Date() })
    .where(eq(schema.bar.id, input.id));

  const updatedBar = await db.query.bar.findFirst({
    where: (bar, { eq }) => eq(bar.id, input.id),
  });

  return updatedBar;
}
const createBeverageInput = z.object({
  barId: z.string(),
  brewery: z.string().min(1),
  name: z.string().min(1),
  style: z.string().min(1),
  abv: z.number().nonnegative().lte(100).multipleOf(0.1),
});

export async function createBeverage(
  input: z.infer<typeof createBeverageInput>,
) {
  let brewery = await db.query.brewery.findFirst({
    where: (brewery, { eq }) => eq(brewery.name, input.brewery),
  });

  if (!brewery) {
    await db.insert(schema.brewery).values({
      name: input.brewery,
    } satisfies typeof schema.brewery.$inferInsert);

    brewery = await db.query.brewery.findFirst({
      where: (brewery, { eq }) => eq(brewery.name, input.brewery),
    });

    if (!brewery) throw new Error("Failed to create brewery");
  }

  let beverage = await db.query.beverage.findFirst({
    where: (bev, { eq, and }) =>
      and(eq(bev.name, input.name), eq(bev.breweryId, brewery!.id)),
  });

  if (!beverage) {
    await db.insert(schema.beverage).values({
      name: input.name,
      abv: String(input.abv),
      style: input.style,
      breweryId: brewery.id,
    } satisfies typeof schema.beverage.$inferInsert);
    beverage = await db.query.beverage.findFirst({
      where: (bev, { eq, and }) =>
        and(eq(bev.name, input.name), eq(bev.breweryId, brewery!.id)),
    });

    if (!beverage) throw new Error("Failed to create beverage");
  }

  await db.insert(schema.barBeverage).values({
    barId: input.barId,
    beverageId: beverage.id,
  } satisfies typeof schema.barBeverage.$inferInsert);

  const barBeverage = await db.query.barBeverage.findFirst({
    where: (bb, { and, eq }) =>
      and(eq(bb.barId, input.barId), eq(bb.beverageId, beverage!.id)),
  });

  return { barBeverage };
}

export async function untapBeverage(barId: string, beverageId: string) {
  const barBeverageSchema = schema.barBeverage;

  await db
    .update(barBeverageSchema)
    .set({
      tappedOff: new Date().toISOString(),
    })
    .where(
      and(
        eq(barBeverageSchema.barId, barId),
        eq(barBeverageSchema.beverageId, beverageId),
      ),
    );

  const barBeverage = await db.query.barBeverage.findFirst({
    where: (bb, { and, eq }) =>
      and(eq(bb.barId, barId), eq(bb.beverageId, beverageId)),
  });

  return { barBeverage };
}
