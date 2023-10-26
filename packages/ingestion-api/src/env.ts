import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string(),
    DATABASE_URL: z.string().url(),
  },
  client: {},
  clientPrefix: "",
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
