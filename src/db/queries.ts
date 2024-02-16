import { geocode } from "~/utils/maps";
import { db } from ".";
import { barStaff } from "./schema";
import { eq, sql } from "drizzle-orm";
import "server-only";
import { env } from "~/env.mjs";
import { rateLimit } from "~/utils/ratelimit";

export async function getAllUnverified() {
  return db.query.bar.findMany({
    where: (bar, { eq }) => eq(bar.verified, false),
    with: {
      staff: true,
    },
  });
}

export async function getBarsByUserId(userId: string) {
  return db.query.bar.findMany({
    where: (_, { exists }) =>
      exists(db.select().from(barStaff).where(eq(barStaff.staffId, userId))),
  });
}

export async function searchBars(location: string) {
  await rateLimit();

  const { results, status } = await geocode(
    location,
    env.GOOGLE_MAPS_SERVER_KEY,
  );

  if (status !== "OK" || !results.length || !results[0]) {
    throw new Error("Invalid address");
  }

  const [result] = results;
  const { lng, lat } = result.geometry.location;

  const bars = await db.query.bar.findMany({
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
}

export async function getBarBySlug(slug: string) {
  const bar = await db.query.bar.findFirst({
    where: (bar, { eq }) => eq(bar.slug, slug),
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
    throw new Error("Bar not found");
  }

  return bar;
}
