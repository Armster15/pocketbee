import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { EventEmitter } from "node:events";
import { PrismaClient } from "@pocketbee/db";
import {
  createClient as createSupabaseClient,
  type User,
} from "@supabase/supabase-js";
import { env } from "./env";
import type TypedEmitter from "typed-emitter";

const PORT = 5050;

const eventEmitter = new EventEmitter() as TypedEmitter<{
  update: (projectId: string) => void;
}>;
const prisma = new PrismaClient();
const supabase = createSupabaseClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// Type for `ws.data.state`, which allows us to store "state" in a websocket connection
type WSState = { listener?: (projectId: string) => void; authedUser?: User };

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
      // @ts-expect-error TODO: Extend ElysiaWS somehow to create a `state` attr
      ws.data.state = {};
      ws.send({ event: "hello" });
    },
    close(ws) {
      // @ts-expect-error TODO: Extend ElysiaWS somehow to create a `state` attr
      const listener = (ws.data.state as WSState).listener;

      if (listener) {
        eventEmitter.removeListener("update", listener);
      } else {
        console.warn("WebSocket closed but no listener was found");
      }
    },
    // On `identify` event, authenticate user and create event listener
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

      function listener(projectId: string) {
        if (
          projectId === ws.data.query.projectId &&
          // @ts-expect-error TODO: Extend ElysiaWS somehow to create a `state` attr
          (ws.data.state as WSState).authedUser
        ) {
          ws.send({ event: "update" });
        }
      }

      // @ts-expect-error TODO: Extend ElysiaWS somehow to create a `state` attr
      (ws.data.state as WSState) = {
        listener,
        authedUser: user,
      };

      eventEmitter.on("update", listener);

      ws.send({ event: "identified" });
    },
    body: t.Object({
      event: t.Literal("identify"),
      data: t.String(),
    }),
    query: t.Object({
      projectId: t.String(),
    }),
    response: t.Union([
      t.Object({
        event: t.Literal("hello"),
        data: t.Optional(t.Undefined()),
      }),

      t.Object({
        event: t.Literal("identified"),
        data: t.Optional(t.Undefined()),
      }),

      t.Object({
        event: t.Literal("update"),
        data: t.Optional(t.Undefined()),
      }),

      t.Object({
        event: t.Literal("error"),
        data: t.String(),
      }),
    ]),
  })
  .listen(PORT);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
