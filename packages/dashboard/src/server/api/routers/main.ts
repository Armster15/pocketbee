import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import niceTry from "nice-try";

export const mainRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input: { name }, ctx: { user, prisma } }) => {
      await prisma.project.create({
        data: {
          name,
          userId: user.id,
        },
      });
    }),

  activeUsers: protectedProcedure
    .input(
      z.object({
        projectToken: z.string(),
      }),
    )
    .query(async ({ input: { projectToken }, ctx: { prisma, user } }) => {
      const project = await niceTry.promise(async () =>
        prisma.project.findFirst({
          where: { token: projectToken, userId: user.id },
        }),
      );

      // TODO: Better error handling instead of this generic try/catch all errors
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project with token not found",
        });
      }

      return project.activeUsers;
    }),
});
