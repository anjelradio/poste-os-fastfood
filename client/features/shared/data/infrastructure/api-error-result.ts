import { type ZodError, type ZodType } from "zod";
import { type ApiError } from "../types/api-result";

type ValidationErrors = Record<string, string[] | undefined>;

export function errorResult(message: string): ApiError {
  return {
    ok: false,
    errors: [message],
  };
}

export function mapValidationErrorsToMessages(
  validationErrors: ValidationErrors,
): string[] {
  return Object.values(validationErrors).flatMap((messages) => messages ?? []);
}

export function zodValidationErrorResult(error: ZodError): ApiError {
  const validationErrors = error.flatten().fieldErrors;

  return {
    ok: false,
    validationErrors,
    errors: mapValidationErrorsToMessages(validationErrors),
  };
}

export async function serverErrorResult(
  res: Response,
  fallbackMessage: string,
): Promise<ApiError> {
  let responseData: unknown;

  try {
    responseData = await res.json();
  } catch {
    return errorResult(fallbackMessage);
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "errors" in responseData &&
    Array.isArray(responseData.errors) &&
    responseData.errors.every((item) => typeof item === "string")
  ) {
    return {
      ok: false,
      errors: responseData.errors,
    };
  }

  return errorResult(fallbackMessage);
}

export async function serverValidationErrorResult(
  res: Response,
  schema: ZodType<Record<string, string[]>>,
  fallbackMessage: string,
): Promise<ApiError> {
  let responseData: unknown;

  try {
    responseData = await res.json();
  } catch {
    return errorResult(fallbackMessage);
  }

  const parsedResult = schema.safeParse(responseData);

  if (parsedResult.success) {
    return {
      ok: false,
      validationErrors: parsedResult.data,
      errors: mapValidationErrorsToMessages(parsedResult.data),
    };
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "errors" in responseData &&
    Array.isArray(responseData.errors) &&
    responseData.errors.every((item) => typeof item === "string")
  ) {
    return {
      ok: false,
      errors: responseData.errors,
    };
  }

  return errorResult(fallbackMessage);
}
