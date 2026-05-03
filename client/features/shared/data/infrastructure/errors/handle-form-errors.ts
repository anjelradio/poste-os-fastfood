import type { ZodIssue, ZodSafeParseError } from "zod";

import {
  handleApiErrors,
  handleValidationErrors,
  handleZodErrors as handleZodIssues,
} from "@/lib/api/errors";

type ApiResultErrorLike = {
  ok: false;
  errors: string[];
  validationErrors?: Record<string, string[] | undefined>;
};

export function handleApiResultError(response: ApiResultErrorLike) {
  if (response.validationErrors) {
    handleValidationErrors(response.validationErrors);
    return;
  }

  handleApiErrors(response.errors);
}

export function handleZodErrors(
  parsedOrIssues: ZodSafeParseError<unknown> | ZodIssue[],
) {
  if (Array.isArray(parsedOrIssues)) {
    handleZodIssues(parsedOrIssues);
    return;
  }

  handleZodIssues(parsedOrIssues.error.issues);
}
