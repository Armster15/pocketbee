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
          where: { id: projectId, user_id: user.id },
        }),
      );

      // TODO: Better error handling instead of this generic try/catch all errors
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project with id not found",
        });
      }

      return project;
    }),

  getActiveUsers: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input: { projectId }, ctx: { user, prisma } }) => {
      const { token: projectToken } =
        (await prisma.projects.findUnique({
          where: { id: projectId },
          select: { token: true },
        })) ?? {};

      if (!projectToken) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project with id not found",
        });
      }

      const noOfActiveUsers = await prisma.session_events.count({
        where: {
          project_token: projectToken,
          end_time: null,
        },
      });

      return noOfActiveUsers;
    }),

  rename: protectedProcedure
    .input(z.object({ projectId: z.string(), name: z.string().min(1) }))
    .mutation(async ({ input: { projectId, name }, ctx: { user, prisma } }) => {
      const res = await niceTry.promise(async () =>
        prisma.projects.update({
          where: { id: projectId, user_id: user.id },
          data: {
            name,
          },
        }),
      );

      // TODO: Better error handling instead of this generic try/catch all errors
      if (!res) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to rename project",
        });
      }

      return;
    }),

  delete: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ input: { projectId }, ctx: { user, prisma } }) => {
      const res = await niceTry.promise(async () =>
        prisma.projects.delete({
          where: { id: projectId, user_id: user.id },
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
      where: { user_id: user.id },
    });
    return projects;
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input: { name }, ctx: { user, prisma } }) => {
      await prisma.projects.create({
        data: {
          name,
          user_id: user.id,
        },
      });
    }),
});
