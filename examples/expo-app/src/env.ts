import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {},
  clientPrefix: "EXPO_PUBLIC",
  client: {
    EXPO_PUBLIC_POCKETBEE_TOKEN: z.string(),
    EXPO_PUBLIC_INGESTION_API_URL: z.string(),
  },
  runtimeEnvStrict: {
    EXPO_PUBLIC_POCKETBEE_TOKEN: process.env.EXPO_PUBLIC_POCKETBEE_TOKEN,
    EXPO_PUBLIC_INGESTION_API_URL: process.env.EXPO_PUBLIC_INGESTION_API_URL,
  },
  emptyStringAsUndefined: true,
});
