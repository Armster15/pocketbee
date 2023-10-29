import { z } from "zod";

export const wsReqSchema = z.object({ event: z.literal("ping") });
export const wsResSchema = z.union([
  z.object({ event: z.literal("error"), data: z.string() }),
  z.object({ event: z.literal("pong") }),
]);

export type WSReqSchema = z.infer<typeof wsReqSchema>;
export type WSResSchema = z.infer<typeof wsResSchema>;
