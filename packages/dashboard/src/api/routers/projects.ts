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
    .input(
      z.object({
        projectId: z.string(),
        timeZone: z.string(),
        groupingInterval: z.union([
          z.literal("10min"),
          z.literal("hour"),
          z.literal("day"),
          z.literal("month"),
          z.literal("year"),
        ]),
        from: z.date(),
        to: z.date(),
      }),
    )
    .query(
      async ({
        input: { projectId, timeZone, groupingInterval, from, to },
        ctx: { user, prisma },
      }) => {
        type Res = { date: Date; sessions: BigInt }[];
        console.log({ from, to });
        const res = await prisma.$queryRaw<Res>`
          SELECT
              CASE
                  WHEN ${groupingInterval} = '10min' THEN DATE_TRUNC('minute', start_time - (DATE_PART('minute', start_time)::integer % 10) * INTERVAL '1 minute')
                  WHEN ${groupingInterval} = 'hour'  THEN DATE_TRUNC('hour', start_time)
                  WHEN ${groupingInterval} = 'day'   THEN DATE_TRUNC('day', start_time)
                  WHEN ${groupingInterval} = 'month' THEN DATE_TRUNC('month', start_time)
                  WHEN ${groupingInterval} = 'year'  THEN DATE_TRUNC('year', start_time)
              END AS date,
              COUNT(*) AS sessions
          FROM (
              SELECT e.start_time AT TIME ZONE ${timeZone} AS start_time
              FROM public.session_events AS e
              INNER JOIN public.projects AS p ON e.project_token = p.token
              WHERE p.id = uuid(${projectId}) AND p.user_id = uuid(${user.id})
              AND e.start_time >= ${from}
              AND e.start_time <= ${to}
          ) AS subquery
          GROUP BY date
          ORDER BY date;
        `;

        // Turn BigInt to number
        return res.map(({ date, sessions }) => ({
          date,
          sessions: Number(sessions),
        }));
      },
    ),

  edit: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1).optional(),
        image_url: z.string().min(1).url().nullable(),
      }),
    )
    .mutation(
      async ({
        input: { projectId, name, image_url },
        ctx: { user, prisma },
      }) => {
        const res = await niceTry.promise(async () =>
          prisma.projects.update({
            where: { id: projectId, user_id: user.id },
            data: {
              name,
              image_url,
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
      },
    ),

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
