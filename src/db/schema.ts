import {
  mysqlTable,
  primaryKey,
  unique,
  varchar,
  double,
  json,
  datetime,
  boolean,
  index,
} from "drizzle-orm/mysql-core";
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";

type OpeningHours = {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
};

export const bar = mysqlTable(
  "Bar",
  {
    id: varchar("id", { length: 191 })
      .$defaultFn(() => createId())
      .notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    slug: varchar("slug", { length: 191 }).notNull(),
    line1: varchar("line1", { length: 191 }).notNull(),
    line2: varchar("line2", { length: 191 }),
    city: varchar("city", { length: 191 }).notNull(),
    postcode: varchar("postcode", { length: 191 }).notNull(),
    longitude: double("longitude").notNull(),
    latitude: double("latitude").notNull(),
    openingHours: json("opening_hours").$type<OpeningHours>().notNull(),
    url: varchar("url", { length: 191 }),
    branding: json("branding").$type<{
      logo?: string;
      colours?: {
        foreground?: string;
        background?: string;
        accent?: string;
      };
    }>(),
    updated: datetime("updated", { fsp: 3 })
      .$defaultFn(() => new Date())
      .notNull(),
    verified: boolean("verified").default(false).notNull(),
  },
  (table) => {
    return {
      barId: primaryKey({ columns: [table.id], name: "Bar_id" }),
      barSlugKey: unique("Bar_slug_key").on(table.slug),
    };
  },
);

export type Bar = typeof bar.$inferSelect;

export const barRelations = relations(bar, ({ many }) => ({
  staff: many(barStaff),
  beverages: many(barBeverage),
}));

export const barBeverage = mysqlTable(
  "BarBeverage",
  {
    barId: varchar("bar_id", { length: 191 }).notNull(),
    beverageId: varchar("beverage_id", { length: 191 }).notNull(),
    tappedOn: datetime("tappedOn", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    tappedOff: datetime("tappedOff", { mode: "string", fsp: 3 }),
  },
  (table) => {
    return {
      barIdIdx: index("BarBeverage_bar_id_idx").on(table.barId),
      beverageIdIdx: index("BarBeverage_beverage_id_idx").on(table.beverageId),
      barBeverageBarIdBeverageId: primaryKey({
        columns: [table.barId, table.beverageId],
        name: "BarBeverage_bar_id_beverage_id",
      }),
    };
  },
);

export type BarBeverage = typeof barBeverage.$inferSelect;

export const barBeverageRelations = relations(barBeverage, ({ one }) => ({
  bar: one(bar, {
    fields: [barBeverage.barId],
    references: [bar.id],
  }),
  beverage: one(beverage, {
    fields: [barBeverage.beverageId],
    references: [beverage.id],
  }),
}));

export const barStaff = mysqlTable(
  "BarStaff",
  {
    id: varchar("id", { length: 191 })
      .$defaultFn(() => createId())
      .notNull(),
    staffId: varchar("staff_id", { length: 191 }).notNull(),
    barId: varchar("bar_id", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      barIdIdx: index("BarStaff_bar_id_idx").on(table.barId),
      barStaffId: primaryKey({ columns: [table.id], name: "BarStaff_id" }),
    };
  },
);

export type BarStaff = typeof barStaff.$inferSelect;

export const barStaffRelations = relations(barStaff, ({ one }) => ({
  bar: one(bar, {
    fields: [barStaff.barId],
    references: [bar.id],
  }),
}));

export const beverage = mysqlTable(
  "Beverage",
  {
    id: varchar("id", { length: 191 })
      .$defaultFn(() => createId())
      .notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    abv: varchar("abv", { length: 191 }).notNull(),
    style: varchar("style", { length: 191 }).notNull(),
    breweryId: varchar("brewery_id", { length: 191 }).notNull(),
    verified: boolean("verified").default(false).notNull(),
  },
  (table) => {
    return {
      breweryIdIdx: index("Beverage_brewery_id_idx").on(table.breweryId),
      beverageId: primaryKey({ columns: [table.id], name: "Beverage_id" }),
    };
  },
);

export type Beverage = typeof beverage.$inferSelect;

export const beverageRelations = relations(beverage, ({ one, many }) => ({
  brewery: one(brewery, {
    fields: [beverage.breweryId],
    references: [brewery.id],
  }),
  barBeverage: many(barBeverage),
}));

export const brewery = mysqlTable(
  "Brewery",
  {
    id: varchar("id", { length: 191 })
      .$defaultFn(() => createId())
      .notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    url: varchar("url", { length: 191 }),
    location: json("location"),
  },
  (table) => {
    return {
      breweryId: primaryKey({ columns: [table.id], name: "Brewery_id" }),
      breweryNameKey: unique("Brewery_name_key").on(table.name),
    };
  },
);

export type Brewery = typeof brewery.$inferSelect;

export const breweryRelations = relations(brewery, ({ many }) => ({
  beverages: many(beverage),
}));

export type BarWithBeverages = Bar & {
  beverages: (BarBeverage & {
    beverage: (Beverage & { brewery: Brewery | null }) | null;
  })[];
};
