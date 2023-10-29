import { createOpenApiNextHandler } from "trpc-openapi";

import { env } from "$/env.mjs";
import { ingestionRouter } from "$/server/api/routers/ingestion";
import { createTRPCContext } from "$/server/api/trpc";

// export API handler
export default createOpenApiNextHandler({
  router: ingestionRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
});
