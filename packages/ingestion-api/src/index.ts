import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { EventEmitter } from "node:events";
import type TypedEmitter from "typed-emitter";
import { PrismaClient } from "@what-the-buzz/db";

const PORT = 5050;

const eventEmitter = new EventEmitter() as TypedEmitter<{
  update: (projectId: string) => void;
}>;

const app = new Elysia()
  .use(cors())
  .decorate("prisma", new PrismaClient())
  .onError(({ code, error, set }) => {
    console.error(error);
  })
  .post(
    "/start",

    // Handler
    async ({ body: { projectToken, userId }, prisma }) => {
      const { id: projectId } = await prisma.projects.update({
        where: {
          token: projectToken,
          NOT: {
            activeUsers: {
              has: userId,
            },
          },
        },
        data: {
          activeUsers: {
            push: userId,
          },
        },
      });

      eventEmitter.emit("update", projectId);
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
    async ({ body: { projectToken, userId }, prisma }) => {
      const activeUsersQuery = await prisma.projects.findUnique({
        where: {
          token: projectToken,
        },
        select: {
          activeUsers: true,
        },
      });

      if (!activeUsersQuery) return;
      const { activeUsers } = activeUsersQuery;

      const { id: projectId } = await prisma.projects.update({
        where: {
          token: projectToken,
        },
        data: {
          activeUsers: {
            set: activeUsers.filter((uid) => uid !== userId),
          },
        },
      });

      eventEmitter.emit("update", projectId);
    },

    // Schema
    {
      body: t.Object({
        projectToken: t.String(),
        userId: t.String(),
      }),
    },
  )
  .ws("/ws", {
    open(ws) {
      function listener(projectId: string) {
        if (projectId === ws.data.query.projectId) {
          ws.send("");
        }
      }

      ws.data.body = { listener };
      eventEmitter.on("update", listener);
    },
    close(ws) {
      eventEmitter.removeListener("update", ws.data.body.listener);
    },
    body: t.Object({
      listener: t.Function(
        [
          // projectId: string
          t.String(),
        ],
        t.Void(),
      ),
    }),
    query: t.Object({
      projectId: t.String(),
    }),
  })
  .listen(PORT);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
