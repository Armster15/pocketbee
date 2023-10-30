import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "$/api/trpc";
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
      const res = await prisma.projects.findUnique({
        where: { id: projectId, user_id: user.id },
        include: {
          _count: {
            select: {
              session_events: {
                where: {
                  end_time: null,
                },
              },
            },
          },
        },
      });

      if (!res) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project with id not found",
        });
      }

      return res._count.session_events;
    }),

  getSessions: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input: { projectId }, ctx: { user, prisma } }) => {
      type Res = { event_date: Date; event_count: BigInt }[];

      const res = await prisma.$queryRaw<Res>`
        SELECT DATE(e.start_time) AS event_date, COUNT(*) AS event_count
        FROM public.session_events AS e
        INNER JOIN public.projects AS p ON e.project_token = p.token
        WHERE p.id = uuid(${projectId}) AND p.user_id = uuid(${user.id})
        GROUP BY DATE(e.start_time) -- The DATE(...) makes it so we group it by individual days
      `;

      return res;
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
