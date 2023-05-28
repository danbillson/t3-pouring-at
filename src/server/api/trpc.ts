import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/api";
import { getAuth } from "@clerk/nextjs/server";
import { TRPCError, initTRPC, type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "~/server/db";

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject;
}

const createInnerTRPCContext = ({ auth }: AuthContext) => {
  return {
    auth,
    prisma,
  };
};

export const createTRPCContext = (opts: CreateNextContextOptions) => {
  return createInnerTRPCContext({ auth: getAuth(opts.req) });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthed);

export type Context = inferAsyncReturnType<typeof createTRPCContext>;
