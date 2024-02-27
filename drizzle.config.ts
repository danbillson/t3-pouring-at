import { defineConfig } from "drizzle-kit";
import { env } from "~/env.mjs";

export default defineConfig({
  schema: "./src/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
