import { type SignedOutAuthObject } from "@clerk/nextjs/dist/types/server";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, auth: {} as SignedOutAuthObject },
    transformer: superjson,
  });
