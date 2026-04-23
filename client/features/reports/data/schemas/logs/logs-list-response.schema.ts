import { z } from "zod";
import { LogSchema } from "../../../domain/entities/log";

export const LogsListResponseSchema = z.object({
  data: z.array(LogSchema),
  totalLogs: z.number(),
});

export type LogsListResponse = z.infer<typeof LogsListResponseSchema>;
