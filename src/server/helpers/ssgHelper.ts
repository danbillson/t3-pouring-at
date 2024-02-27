import { type SignedOutAuthObject } from "@clerk/nextjs/dist/types/server";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { db, schema } from "~/db";

export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { db, schema, auth: {} as SignedOutAuthObject, ip: null },
    transformer: superjson,
  });
