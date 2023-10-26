import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {},
  clientPrefix: "EXPO_PUBLIC",
  client: {
    EXPO_PUBLIC_WHATTHEBUZZ_TOKEN: z.string(),
  },
  runtimeEnvStrict: {
    EXPO_PUBLIC_WHATTHEBUZZ_TOKEN: process.env.EXPO_PUBLIC_WHATTHEBUZZ_TOKEN,
  },
  emptyStringAsUndefined: true,
});
