export interface Options {
  projectToken: string;
  /** API root of ingestion API */
  apiRoot?: string;
  /** Whether to log debug information to the console. By default, this is enabled in development but disabled in production. */
  debugLogs?: boolean;
}

export interface Store extends Options {
  userId: string;
}
