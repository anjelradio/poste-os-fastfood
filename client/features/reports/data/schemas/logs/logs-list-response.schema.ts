import { z } from "zod";
import { LogResponseDtoSchema } from "./log-response.schema";

export const LogsListResponseSchema = z.object({
  data: z.array(LogResponseDtoSchema),
  total_logs: z.number(),
});

export type LogsListResponseDto = z.infer<typeof LogsListResponseSchema>;
