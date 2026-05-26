import type { PurchasesReportRequest } from "../schemas/reports/purchases-report-request.schema";

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
