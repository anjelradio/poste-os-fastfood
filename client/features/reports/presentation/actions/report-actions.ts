"use server";

import { reportsRepository } from "../../data/repositories/reports.repository";

export async function generatePurchasesReportAction(data: unknown) {
  return reportsRepository.getPurchasesReport(data);
}

export async function getPurchasesSummaryAction(data: unknown) {
  return reportsRepository.getPurchasesSummary(data);
}

export async function generateProfitsReportAction(data: unknown) {
  return reportsRepository.getProfitsReport(data);
}

export async function getProfitsSummaryAction(data: unknown) {
  return reportsRepository.getProfitsSummary(data);
}

export async function generateProductSalesReportAction(data: unknown) {
  return reportsRepository.getProductSalesReport(data);
}

export async function getProductSalesSummaryAction(data: unknown) {
  return reportsRepository.getProductSalesSummary(data);
}
