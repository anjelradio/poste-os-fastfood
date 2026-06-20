import type { Product } from "@/features/products/domain/entities/product";
import type { ProductSalesSummary } from "@/features/reports/data/schemas/reports/product-sales-summary.schema";
import type { ProfitsSummary } from "@/features/reports/data/schemas/reports/profits-summary.schema";
import type { PurchasesSummary } from "@/features/reports/data/schemas/reports/purchases-summary.schema";

export type ReportFormat = "pdf" | "excel";
export type SummarySource = "voice" | "static" | "text";
export type VoiceReportType = "profits" | "purchases" | "product-sales";

export type VoiceReportSummaryData =
  | { type: "profits"; data: ProfitsSummary }
  | { type: "purchases"; data: PurchasesSummary }
  | { type: "product-sales"; data: ProductSalesSummary };

export type ReportRange = {
  fromDate: string;
  toDate: string;
  label: string;
  preferredFormat: ReportFormat;
};

export type ParsedVoiceReportQuery = ReportRange & {
  reportType: VoiceReportType;
  productId?: number;
};

export type VoiceReportSuggestion = {
  label: string;
  query: string;
  reportType: VoiceReportType;
};

export type VoiceReportTypeOption = {
  key: VoiceReportType;
  label: string;
};

export type VoiceReportQueryContext = {
  fallbackReportType: VoiceReportType;
  products: Product[];
};
