import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "$/server/api/trpc";
import { TRPCError } from "@trpc/server";
import niceTry from "nice-try";

export const projectsRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input: { projectId }, ctx: { user, prisma } }) => {
      const project = await niceTry.promise(async () =>
        prisma.projects.findFirst({
          where: { id: projectId, userId: user.id },
        }),
      );

      // TODO: Better error handling instead of this generic try/catch all errors
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project with token not found",
        });
      }

      return project;
    }),

  delete: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ input: { projectId }, ctx: { user, prisma } }) => {
      const res = await niceTry.promise(async () =>
        prisma.projects.delete({
          where: { id: projectId, userId: user.id },
        }),
      );

      // TODO Better error handling
      if (!res) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to delete project",
        });
      }

      return true;
    }),

  getAll: protectedProcedure.query(async ({ ctx: { user, prisma } }) => {
    const projects = await prisma.projects.findMany({
      where: { userId: user.id },
    });
    return projects;
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input: { name }, ctx: { user, prisma } }) => {
      await prisma.projects.create({
        data: {
          name,
          userId: user.id,
        },
      });
    }),
});
