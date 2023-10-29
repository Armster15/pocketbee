import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { PrismaClient } from "@pocketbee/db";
import "./env";

const PORT = 5050;

const prisma = new PrismaClient();

const app = new Elysia()
  .use(cors())
  .onError(({ code, error, set }) => {
    console.error(error);
  })
  .get("/", () => "Hello World!")
  .post(
    "/start",

    // Handler
    async ({ body: { projectToken, userId } }) => {
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
    },

    // Schema
    {
      body: t.Object({
        projectToken: t.String(),
        userId: t.String(),
      }),
    },
  )
  .post(
    "/end",

    // Handler
    async ({ body: { projectToken, userId } }) => {
      const activeUsersQuery = await prisma.projects.findUnique({
        where: {
          token: projectToken,
        },
        select: {
          active_users: true,
        },
      });

      if (!activeUsersQuery) return;
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
    },

    // Schema
    {
      body: t.Object({
        projectToken: t.String(),
        userId: t.String(),
      }),
    },
  )
  .listen(PORT);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
