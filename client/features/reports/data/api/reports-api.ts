import { getAccessToken } from "@/lib/api/get-token";
import { env } from "@/lib/config/env";
import {
  apiRequestMaybeFile,
  apiRequestMaybeJson,
} from "@/features/shared/data/infrastructure/api/api-client";
import { parseWithSchema } from "@/features/shared/data/infrastructure/api/parse-with-schema";
import type { ApiMaybeFileResult } from "@/features/shared/data/types/api-result";
import {
  toProductSalesReportQueryParams,
  toProductSalesSummaryQueryParams,
  toProfitsReportQueryParams,
  toProfitsSummaryQueryParams,
  toPurchasesReportQueryParams,
  toPurchasesSummaryQueryParams,
} from "../mappers/report.mapper";
import { ProfitsReportRequestSchema } from "../schemas/reports/profits-report-request.schema";
import {
  ProfitsSummaryRequestSchema,
  ProfitsSummaryResponseSchema,
} from "../schemas/reports/profits-summary.schema";
import { ProductSalesReportRequestSchema } from "../schemas/reports/product-sales-report-request.schema";
import {
  ProductSalesSummaryRequestSchema,
  ProductSalesSummaryResponseSchema,
} from "../schemas/reports/product-sales-summary.schema";
import { PurchasesReportRequestSchema } from "../schemas/reports/purchases-report-request.schema";
import {
  PurchasesSummaryRequestSchema,
  PurchasesSummaryResponseSchema,
} from "../schemas/reports/purchases-summary.schema";

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

  async getPurchasesSummary(data: unknown) {
    const input = parseWithSchema(PurchasesSummaryRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();
    const params = toPurchasesSummaryQueryParams(input.data);

    return apiRequestMaybeJson({
      url: `${baseUrl}/purchases/summary/?${params.toString()}`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      responseSchema: PurchasesSummaryResponseSchema,
      fallbackMessage: "Error al obtener el resumen de compras.",
    });
  },

  async getProfitsReport(data: unknown): Promise<ApiMaybeFileResult> {
    const input = parseWithSchema(ProfitsReportRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();
    const params = toProfitsReportQueryParams(input.data);

    return apiRequestMaybeFile({
      url: `${baseUrl}/profits/${input.data.reportFormat}/?${params.toString()}`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al generar el reporte de ganancias.",
    });
  },

  async getProfitsSummary(data: unknown) {
    const input = parseWithSchema(ProfitsSummaryRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();
    const params = toProfitsSummaryQueryParams(input.data);

    return apiRequestMaybeJson({
      url: `${baseUrl}/profits/summary/?${params.toString()}`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      responseSchema: ProfitsSummaryResponseSchema,
      fallbackMessage: "Error al obtener el resumen de ganancias.",
    });
  },

  async getProductSalesReport(data: unknown): Promise<ApiMaybeFileResult> {
    const input = parseWithSchema(ProductSalesReportRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();
    const params = toProductSalesReportQueryParams(input.data);

    return apiRequestMaybeFile({
      url: `${baseUrl}/product-sales/${input.data.reportFormat}/?${params.toString()}`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      fallbackMessage: "Error al generar el reporte de ventas por producto.",
    });
  },

  async getProductSalesSummary(data: unknown) {
    const input = parseWithSchema(ProductSalesSummaryRequestSchema, data);
    if (!input.ok) {
      return input;
    }

    const token = await getAccessToken();
    const params = toProductSalesSummaryQueryParams(input.data);

    return apiRequestMaybeJson({
      url: `${baseUrl}/product-sales/summary/?${params.toString()}`,
      method: "GET",
      cache: "no-store",
      token: token ?? undefined,
      responseSchema: ProductSalesSummaryResponseSchema,
      fallbackMessage: "Error al obtener el resumen de ventas por producto.",
    });
  },
};
