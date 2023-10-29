import { WebSocketServer } from "ws";
import { PrismaClient } from "@pocketbee/db";
import url from "node:url";
import * as dotenv from "dotenv";

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

  // on close
  ws.on("close", async (code) => {
    if (code !== 1011 && code !== 1007) {
      try {
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
      } catch (err) {
        console.error(err);
        ws.close(1011, "An error occurred");
      }
    }
  });

  // on open
  try {
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
  } catch (err) {
    console.error(err);
    ws.close(1011, "An error occurred");
  }
});

console.info(`WebSocket server running on port ${PORT}`);
