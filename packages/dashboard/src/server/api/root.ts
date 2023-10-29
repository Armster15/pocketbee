import { createTRPCRouter } from "$/server/api/trpc";
import { projectsRouter } from "$/server/api/routers/projects";
import { ingestionRouter } from "$/server/api/routers/ingestion";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  ingestion: ingestionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
