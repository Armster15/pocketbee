interface Options {
  projectToken: string;
  /** API root of ingestion API */
  apiRoot?: string;
  /** Whether to log debug information to the console. By default, this is enabled in development but disabled in production. */
  debugLogs?: boolean;
}

declare const pocketbee: {
  init: (options: Options) => Promise<void>;
};

export { pocketbee };
