import type { PurchasesReportRequest } from "../schemas/reports/purchases-report-request.schema";
import type { PurchasesSummaryRequest } from "../schemas/reports/purchases-summary.schema";
import type { ProfitsReportRequest } from "../schemas/reports/profits-report-request.schema";
import type { ProfitsSummaryRequest } from "../schemas/reports/profits-summary.schema";
import type { ProductSalesReportRequest } from "../schemas/reports/product-sales-report-request.schema";
import type { ProductSalesSummaryRequest } from "../schemas/reports/product-sales-summary.schema";

export function toPurchasesReportQueryParams(data: PurchasesReportRequest) {
  const params = new URLSearchParams();
  params.set("from_date", data.fromDate);
  params.set("to_date", data.toDate);
  params.set("include_items", String(data.includeItems ?? false));
  if (data.rawMaterialId) {
    params.set("raw_material_id", String(data.rawMaterialId));
  }
  if (data.supplierId) {
    params.set("supplier_id", String(data.supplierId));
  }
  return params;
}

export function toPurchasesSummaryQueryParams(data: PurchasesSummaryRequest) {
  const params = new URLSearchParams();
  params.set("from_date", data.fromDate);
  params.set("to_date", data.toDate);
  params.set("source", data.source);
  return params;
}

export function toProfitsReportQueryParams(data: ProfitsReportRequest) {
  const params = new URLSearchParams();
  params.set("from_date", data.fromDate);
  params.set("to_date", data.toDate);
  return params;
}

export function toProfitsSummaryQueryParams(data: ProfitsSummaryRequest) {
  const params = new URLSearchParams();
  params.set("from_date", data.fromDate);
  params.set("to_date", data.toDate);
  params.set("source", data.source);
  return params;
}

export function toProductSalesReportQueryParams(data: ProductSalesReportRequest) {
  const params = new URLSearchParams();
  params.set("from_date", data.fromDate);
  params.set("to_date", data.toDate);
  params.set("product_id", String(data.productId));
  params.set("include_orders", String(data.includeOrders ?? false));
  return params;
}

export function toProductSalesSummaryQueryParams(data: ProductSalesSummaryRequest) {
  const params = new URLSearchParams();
  params.set("from_date", data.fromDate);
  params.set("to_date", data.toDate);
  params.set("product_id", String(data.productId));
  params.set("source", data.source);
  return params;
}
