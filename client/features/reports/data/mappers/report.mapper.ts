import type { PurchasesReportRequest } from "../schemas/reports/purchases-report-request.schema";
import type { ProfitsReportRequest } from "../schemas/reports/profits-report-request.schema";
import type { ProductSalesReportRequest } from "../schemas/reports/product-sales-report-request.schema";

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

export function toProfitsReportQueryParams(data: ProfitsReportRequest) {
  const params = new URLSearchParams();
  params.set("from_date", data.fromDate);
  params.set("to_date", data.toDate);
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
