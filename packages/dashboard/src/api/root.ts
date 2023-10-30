import { createTRPCRouter } from "$/api/trpc";
import { projectsRouter } from "$/api/routers/projects";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
