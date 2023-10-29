import { WebSocketServer } from "ws";
import {
  PrismaClient,
  type session_events as SessionEvent,
} from "@pocketbee/db";
import url from "node:url";
import * as dotenv from "dotenv";
import { wsReqSchema, type WSResSchema } from "./schema";
import niceTry from "nice-try";

dotenv.config();

const PORT = process.env.PORT ?? 5050;
const wss = new WebSocketServer({ host: "0.0.0.0", port: Number(PORT) });

if (!process.env.DATABASE_URL) {
  throw new Error("Please set environment variable `DATABASE_URL`");
}
const prisma = new PrismaClient();

wss.on("connection", async function connection(ws, req) {
  ws.on("error", console.error);

  const searchParams = new URLSearchParams(
    url.parse(req.url ?? "").query ?? "",
  );

  const projectToken = searchParams.get("projectToken");
  const userId = searchParams.get("userId");

  if (!projectToken || !userId) {
    ws.close(
      1007,
      "Please pass the query parameters `projectToken` and/or `userId`",
    );
    return;
  }

  let sessionEvent: SessionEvent | undefined = undefined;

  // on close
  ws.on("close", async (code) => {
    if (code !== 1011 && code !== 1007) {
      if (sessionEvent) {
        try {
          await prisma.session_events.update({
            where: {
              id: sessionEvent.id,
              app_user_id: sessionEvent.app_user_id,
              project_token: projectToken,
            },
            data: {
              end_time: new Date(),
            },
          });
        } catch (err) {
          console.error(err);
          ws.close(1011, "An error occurred");
        }
      } else {
        console.warn(`No session event id for user id of ${userId}`);
      }
    }
  });

  ws.on("message", async (data, isBinary) => {
    const message = isBinary ? data : data.toString();
    const parseRes = await wsReqSchema.safeParseAsync(
      niceTry(() => JSON.parse(message as any)),
    );

    if (!parseRes.success) {
      ws.send(
        JSON.stringify({
          event: "error",
          data: "Invalid payload",
        } satisfies WSResSchema),
      );
      return;
    }

    const { event } = parseRes.data;

    if (event === "ping") {
      ws.send(
        JSON.stringify({
          event: "pong",
        } satisfies WSResSchema),
      );
    }
  });

  // on open
  try {
    sessionEvent = await prisma.session_events.create({
      data: {
        app_user_id: userId,
        project_token: projectToken,
      },
    });
  } catch (err) {
    console.error(err);
    ws.close(1011, "An error occurred");
  }
});

console.info(`WebSocket server running on port ${PORT}`);
