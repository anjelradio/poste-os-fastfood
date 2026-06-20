import type { Product } from "@/features/products/domain/entities/product";
import type {
  ParsedVoiceReportQuery,
  ReportFormat,
  ReportRange,
  VoiceReportSummaryData,
  VoiceReportType,
} from "@/features/reports/domain/entities/voice-report";

const monthNames = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "setiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

const displayMonthNames = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

const monthNumberByName = new Map<string, number>([
  ["enero", 0],
  ["febrero", 1],
  ["marzo", 2],
  ["abril", 3],
  ["mayo", 4],
  ["junio", 5],
  ["julio", 6],
  ["agosto", 7],
  ["septiembre", 8],
  ["setiembre", 8],
  ["octubre", 9],
  ["noviembre", 10],
  ["diciembre", 11],
]);

export function toInputDate(date: Date) {
  const normalizedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return normalizedDate.toISOString().slice(0, 10);
}

export function getTodayRange(): ReportRange {
  const today = toInputDate(new Date());
  return { fromDate: today, toDate: today, label: "hoy", preferredFormat: "pdf" };
}

export function getCurrentWeekRange(): ReportRange {
  const today = new Date();
  const day = today.getDay() || 7;
  const start = new Date(today);
  start.setDate(today.getDate() - day + 1);
  return {
    fromDate: toInputDate(start),
    toDate: toInputDate(today),
    label: "esta semana",
    preferredFormat: "pdf",
  };
}

export function getCurrentMonthRange(): ReportRange {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    fromDate: toInputDate(start),
    toDate: toInputDate(today),
    label: "este mes",
    preferredFormat: "pdf",
  };
}

function getPreviousWeekRange(preferredFormat: ReportFormat): ReportRange {
  const today = new Date();
  const day = today.getDay() || 7;
  const start = new Date(today);
  start.setDate(today.getDate() - day - 6);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    fromDate: toInputDate(start),
    toDate: toInputDate(end),
    label: "semana pasada",
    preferredFormat,
  };
}

function getPreviousMonthRange(preferredFormat: ReportFormat): ReportRange {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const end = new Date(today.getFullYear(), today.getMonth(), 0);
  return {
    fromDate: toInputDate(start),
    toDate: toInputDate(end),
    label: "mes pasado",
    preferredFormat,
  };
}

function getCurrentYearRange(): ReportRange {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  return {
    fromDate: toInputDate(start),
    toDate: toInputDate(today),
    label: "este anio",
    preferredFormat: "pdf",
  };
}

function getMonthRange(monthIndex: number, year: number, preferredFormat: ReportFormat): ReportRange {
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0);
  const monthLabel = displayMonthNames[monthIndex] ?? "mes seleccionado";
  return {
    fromDate: toInputDate(start),
    toDate: toInputDate(end),
    label: `${monthLabel} ${year}`,
    preferredFormat,
  };
}

function getLastDaysRange(days: number, preferredFormat: ReportFormat): ReportRange {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - Math.max(days - 1, 0));
  return {
    fromDate: toInputDate(start),
    toDate: toInputDate(today),
    label: `ultimos ${days} dias`,
    preferredFormat,
  };
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function parseDateToken(value: string) {
  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return value;
  }

  const slashMatch = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (!slashMatch) {
    return null;
  }

  const day = slashMatch[1].padStart(2, "0");
  const month = slashMatch[2].padStart(2, "0");
  return `${slashMatch[3]}-${month}-${day}`;
}

function findProductId(query: string, products: Product[]) {
  const normalizedQuery = normalizeText(query);
  return products.find((product) => normalizedQuery.includes(normalizeText(product.name)))?.id;
}

function parseReportType(query: string, fallback: VoiceReportType): VoiceReportType {
  const normalizedQuery = normalizeText(query);
  if (normalizedQuery.includes("compra")) {
    return "purchases";
  }
  if (normalizedQuery.includes("venta") || normalizedQuery.includes("producto")) {
    return "product-sales";
  }
  if (normalizedQuery.includes("ganancia")) {
    return "profits";
  }
  return fallback;
}

export function isSupportedVoiceReportQuery(query: string) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery.trim()) {
    return false;
  }

  const hasReportIntent =
    normalizedQuery.includes("compra") ||
    normalizedQuery.includes("venta") ||
    normalizedQuery.includes("producto") ||
    normalizedQuery.includes("ganancia");
  const hasExplicitDate = /\d{4}-\d{2}-\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{4}/.test(normalizedQuery);
  const hasDateIntent =
    hasExplicitDate ||
    /ultimos?\s+\d+\s+dias?/.test(normalizedQuery) ||
    monthNames.some((month) => normalizedQuery.includes(month)) ||
    normalizedQuery.includes("ayer") ||
    normalizedQuery.includes("hoy") ||
    normalizedQuery.includes("semana") ||
    normalizedQuery.includes("mes") ||
    normalizedQuery.includes("anio") ||
    normalizedQuery.includes("ano");

  return hasReportIntent || hasDateIntent;
}

function parseMonthRange(query: string, preferredFormat: ReportFormat) {
  const monthName = monthNames.find((month) => query.includes(month));
  if (!monthName) {
    return null;
  }

  const yearMatch = query.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? Number(yearMatch[0]) : new Date().getFullYear();
  const monthIndex = monthNumberByName.get(monthName);
  if (monthIndex === undefined) {
    return null;
  }

  return getMonthRange(monthIndex, year, preferredFormat);
}

export function parseVoiceReportQuery(
  query: string,
  fallbackReportType: VoiceReportType,
  products: Product[],
): ParsedVoiceReportQuery {
  const normalizedQuery = normalizeText(query);
  const preferredFormat: ReportFormat = normalizedQuery.includes("excel") ? "excel" : "pdf";
  const explicitDates = Array.from(
    normalizedQuery.matchAll(/\d{4}-\d{2}-\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{4}/g),
  )
    .map((match) => parseDateToken(match[0]))
    .filter(Boolean) as string[];
  const reportType = parseReportType(query, fallbackReportType);
  const productId = reportType === "product-sales" ? findProductId(query, products) : undefined;

  if (explicitDates.length >= 2) {
    const [fromDate, toDate] =
      explicitDates[0] <= explicitDates[1]
        ? [explicitDates[0], explicitDates[1]]
        : [explicitDates[1], explicitDates[0]];
    return { fromDate, toDate, label: `del ${fromDate} al ${toDate}`, preferredFormat, reportType, productId };
  }

  if (explicitDates.length === 1) {
    return {
      fromDate: explicitDates[0],
      toDate: explicitDates[0],
      label: `del dia ${explicitDates[0]}`,
      preferredFormat,
      reportType,
      productId,
    };
  }

  const lastDaysMatch = normalizedQuery.match(/ultimos?\s+(\d+)\s+dias?/);
  if (lastDaysMatch) {
    return { ...getLastDaysRange(Number(lastDaysMatch[1]), preferredFormat), reportType, productId };
  }

  const monthRange = parseMonthRange(normalizedQuery, preferredFormat);
  if (monthRange) {
    return { ...monthRange, reportType, productId };
  }

  if (normalizedQuery.includes("ayer")) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const date = toInputDate(yesterday);
    return { fromDate: date, toDate: date, label: "ayer", preferredFormat, reportType, productId };
  }

  if (normalizedQuery.includes("hoy")) {
    return { ...getTodayRange(), preferredFormat, reportType, productId };
  }

  if (normalizedQuery.includes("semana pasada")) {
    return { ...getPreviousWeekRange(preferredFormat), reportType, productId };
  }

  if (normalizedQuery.includes("semana")) {
    return { ...getCurrentWeekRange(), preferredFormat, reportType, productId };
  }

  if (normalizedQuery.includes("mes pasado")) {
    return { ...getPreviousMonthRange(preferredFormat), reportType, productId };
  }

  if (normalizedQuery.includes("anio") || normalizedQuery.includes("ano")) {
    return { ...getCurrentYearRange(), preferredFormat, reportType, productId };
  }

  return { ...getCurrentMonthRange(), preferredFormat, reportType, productId };
}

export function formatCurrency(value: number) {
  return `Bs. ${value.toFixed(2)}`;
}

export function buildVoiceReportSpeechText(summary: VoiceReportSummaryData) {
  if (summary.type === "profits") {
    return `Reporte de ganancias del ${summary.data.fromDate} al ${summary.data.toDate}. Total: ${formatCurrency(
      summary.data.totalAmount,
    )}. Ordenes: ${summary.data.ordersCount}. Ticket promedio: ${formatCurrency(summary.data.averageTicket)}.`;
  }

  if (summary.type === "purchases") {
    return `Reporte de compras del ${summary.data.fromDate} al ${summary.data.toDate}. Total comprado: ${formatCurrency(
      summary.data.totalAmount,
    )}. Compras registradas: ${summary.data.purchasesCount}. Compra promedio: ${formatCurrency(
      summary.data.averagePurchase,
    )}.`;
  }

  return `Reporte de ventas por producto de ${summary.data.product.name}, del ${summary.data.fromDate} al ${summary.data.toDate}. Total vendido: ${formatCurrency(
    summary.data.totalRevenue,
  )}. Cantidad vendida: ${summary.data.quantitySold}. Ordenes: ${summary.data.ordersCount}.`;
}

export function getDefaultProductId(products: Product[]) {
  return products[0]?.id ?? 0;
}
