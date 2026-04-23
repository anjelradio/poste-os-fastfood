import { showErrorToast } from "@/components/ui/ToastNotifications";
import { ZodIssue } from "zod";

type ValidationErrors = Record<string, string[] | undefined>;

export function handleApiErrors(errors: string[]) {
  errors.forEach((msg) => showErrorToast(msg));
}

export function handleZodErrors(issues: ZodIssue[]) {
  issues.forEach((issue) => showErrorToast(issue.message));
}

export function handleValidationErrors(validationErrors: ValidationErrors) {
  Object.values(validationErrors).forEach((messages) => {
    messages?.forEach((msg) => showErrorToast(msg));
  });
}
