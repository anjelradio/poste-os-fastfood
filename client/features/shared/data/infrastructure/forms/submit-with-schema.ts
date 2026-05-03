import type { ZodType } from "zod";

import {
  handleApiResultError,
  handleZodErrors,
} from "@/features/shared/data/infrastructure/errors/handle-form-errors";

type ApiResultLike<TData> =
  | {
      ok: true;
      data?: TData;
    }
  | {
      ok: false;
      errors: string[];
      validationErrors?: Record<string, string[] | undefined>;
    };

type SubmitWithSchemaOptions<TSchemaData, TSuccessData> = {
  schema: ZodType<TSchemaData>;
  payload: unknown;
  action: (data: TSchemaData) => Promise<ApiResultLike<TSuccessData>>;
  onSuccess: (result: { data: TSuccessData | undefined }) => void;
};

export async function submitWithSchema<TSchemaData, TSuccessData>({
  schema,
  payload,
  action,
  onSuccess,
}: SubmitWithSchemaOptions<TSchemaData, TSuccessData>) {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    handleZodErrors(parsed);
    return;
  }

  const response = await action(parsed.data);
  if (!response.ok) {
    handleApiResultError(response);
    return;
  }

  onSuccess({ data: response.data });
}
