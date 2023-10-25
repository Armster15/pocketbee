import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { EventEmitter } from "node:events";
import { PrismaClient } from "@what-the-buzz/db";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";
import type TypedEmitter from "typed-emitter";

const PORT = 5050;

const eventEmitter = new EventEmitter() as TypedEmitter<{
  update: (projectId: string) => void;
}>;
const prisma = new PrismaClient();
const supabase = createSupabaseClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

const app = new Elysia()
  .use(cors())
  .onError(({ code, error, set }) => {
    console.error(error);
  })
  .post(
    "/start",

    // Handler
    async ({ body: { projectToken, userId } }) => {
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
    async ({ body: { projectToken, userId } }) => {
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
        if (
          projectId === ws.data.query.projectId &&
          // @ts-expect-error - TODO: Extend ElysiaWS somehow to create a `state` attr
          ws.raw.data.authedUser
        ) {
          ws.send({ event: "update" });
        }
      }

      // prettier-ignore
      // @ts-expect-error - TODO: Extend ElysiaWS somehow to create a `state` attr
      ws.raw.data ? (ws.raw.data.listener = listener) : (ws.raw.data = { listener });

      eventEmitter.on("update", listener);
      ws.send({ event: "hello", data: {} });
    },
    close(ws) {
      // @ts-expect-error - TODO: Extend ElysiaWS somehow to create a `state` attr
      const listener = ws.raw.data?.listener;

      if (listener) {
        eventEmitter.removeListener("update", listener);
      } else {
        console.warn("WebSocket closed but no listener was found");
      }
    },
    async message(ws, message) {
      const { data: jwt } = message;
      const {
        data: { user: user },
      } = await supabase.auth.getUser(jwt);

      if (!user) {
        ws.send({
          event: "error",
          data: "Bad auth",
        });
        ws.close();
        return;
      }

      const project = await prisma.projects.findUnique({
        where: {
          userId: user.id,
          id: ws.data.query.projectId,
        },
      });

      if (!project) {
        ws.send({
          event: "error",
          data: "Either the provided project does not exist or the user does not have access to it",
        });
        ws.close();
        return;
      }

      // prettier-ignore
      // @ts-expect-error - TODO: Extend ElysiaWS somehow to create a `state` attr
      ws.raw.data ? ws.raw.data.authedUser = user : ws.raw.data = {authedUser: user};

      ws.send({ event: "identified", data: {} });
    },
    body: t.Object({
      event: t.Literal("identify"),
      data: t.String(),
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
