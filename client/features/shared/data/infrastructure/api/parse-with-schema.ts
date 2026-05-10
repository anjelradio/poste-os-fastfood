import type { ZodType } from "zod";

import { zodValidationErrorResult } from "@/features/shared/data/infrastructure/api-error-result";

type ParseOk<T> = {
  ok: true;
  data: T;
};

type ParseError = ReturnType<typeof zodValidationErrorResult>;

export function parseWithSchema<T>(
  schema: ZodType<T>,
  data: unknown,
): ParseOk<T> | ParseError {
  const parsedResult = schema.safeParse(data);
  if (!parsedResult.success) {
    return zodValidationErrorResult(parsedResult.error);
  }

  return {
    ok: true,
    data: parsedResult.data,
  };
}
