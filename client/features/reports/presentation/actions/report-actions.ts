"use server";

import { reportsRepository } from "../../data/repositories/reports.repository";

export async function generatePurchasesReportAction(data: unknown) {
  return reportsRepository.getPurchasesReport(data);
}
