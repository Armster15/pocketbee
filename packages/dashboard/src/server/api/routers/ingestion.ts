import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const ingestionRouter = createTRPCRouter({
  start: publicProcedure
    .meta({ openapi: { method: "POST", path: "/v0.1/start" } })
    .input(z.object({ projectToken: z.string(), userId: z.string() }))
    .output(z.boolean())
    .mutation(async ({ input: { projectToken, userId }, ctx: { prisma } }) => {
      await prisma.projects.update({
        where: {
          token: projectToken,
          NOT: {
            active_users: {
              has: userId,
            },
          },
        },
        data: {
          active_users: {
            push: userId,
          },
        },
      });

      return true;
    }),

  end: publicProcedure
    .meta({ openapi: { method: "POST", path: "/v0.1/end" } })
    .input(z.object({ projectToken: z.string(), userId: z.string() }))
    .output(z.boolean())
    .mutation(async ({ input: { projectToken, userId }, ctx: { prisma } }) => {
      const activeUsersQuery = await prisma.projects.findUnique({
        where: {
          token: projectToken,
        },
        select: {
          active_users: true,
        },
      });

      if (!activeUsersQuery) return false;
      const { active_users: activeUsers } = activeUsersQuery;

      await prisma.projects.update({
        where: {
          token: projectToken,
        },
        data: {
          active_users: {
            set: activeUsers.filter((uid) => uid !== userId),
          },
        },
      });

      return true;
    }),
});
