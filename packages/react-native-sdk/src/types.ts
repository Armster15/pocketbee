import type { EdenTreaty } from "@elysiajs/eden/src/treaty/types";
import type { App as IngestionApi } from "@pocketbee/ingestion-api";

export interface Options {
  projectToken: string;
  /** API root of ingestion API */
  apiRoot?: string;
  /** Whether to log debug information to the console. By default, this is enabled in development but disabled in production. */
  debugLogs?: boolean;
}

export interface Store extends Options {
  userId: string;
  ingestionApi: EdenTreaty.Create<IngestionApi>;
}
