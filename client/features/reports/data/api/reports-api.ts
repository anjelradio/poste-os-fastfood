import { getAccessToken } from "@/lib/api/get-token";
import { env } from "@/lib/config/env";
import { apiRequestMaybeFile } from "@/features/shared/data/infrastructure/api/api-client";
import { parseWithSchema } from "@/features/shared/data/infrastructure/api/parse-with-schema";
import type { ApiMaybeFileResult } from "@/features/shared/data/types/api-result";
import { toPurchasesReportQueryParams } from "../mappers/report.mapper";
import { PurchasesReportRequestSchema } from "../schemas/reports/purchases-report-request.schema";

const baseUrl = `${env.API_URL}/reports`;

export const reportsApi = {
  async getPurchasesReport(data: unknown): Promise<ApiMaybeFileResult> {
    const input = parseWithSchema(PurchasesReportRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();
    const params = toPurchasesReportQueryParams(input.data);

    return apiRequestMaybeFile({
      url: `${baseUrl}/purchases/${input.data.reportFormat}/?${params.toString()}`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al generar el reporte de compras.",
    });
  },
};
