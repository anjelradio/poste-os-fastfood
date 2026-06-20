import type {
  VoiceReportSuggestion,
  VoiceReportTypeOption,
} from "@/features/reports/domain/entities/voice-report";

export const reportTypeOptions: VoiceReportTypeOption[] = [
  { key: "profits", label: "Ganancias" },
  { key: "purchases", label: "Compras" },
  { key: "product-sales", label: "Ventas por Producto" },
];

export const speechLanguageOptions = [
  { value: "es-ES", label: "Espanol" },
  { value: "es-419", label: "Espanol Latinoamerica" },
  { value: "es-MX", label: "Espanol Mexico" },
  { value: "es-BO", label: "Espanol Bolivia" },
];

export const suggestedVoiceReportQueries: VoiceReportSuggestion[] = [
  { label: "Ganancias de hoy", query: "ganancias de hoy", reportType: "profits" },
  { label: "Ganancias 7 dias", query: "ganancias ultimos 7 dias en pdf", reportType: "profits" },
  { label: "Ganancias enero", query: "ganancias del mes de enero", reportType: "profits" },
  { label: "Ganancias semana pasada", query: "ganancias de la semana pasada", reportType: "profits" },
  { label: "Compras del mes", query: "compras de este mes", reportType: "purchases" },
  { label: "Compras enero 2026", query: "compras de enero 2026", reportType: "purchases" },
  { label: "Compras mes pasado", query: "compras del mes pasado", reportType: "purchases" },
  { label: "Compras en Excel", query: "compras ultimos 30 dias en excel", reportType: "purchases" },
  {
    label: "Ventas esta semana",
    query: "ventas por producto esta semana",
    reportType: "product-sales",
  },
  {
    label: "Ventas enero",
    query: "ventas por producto del mes de enero",
    reportType: "product-sales",
  },
  {
    label: "Ventas en Excel",
    query: "ventas por producto ultimos 7 dias en excel",
    reportType: "product-sales",
  },
  {
    label: "Rango especifico",
    query: "ganancias del 01/06/2026 al 19/06/2026",
    reportType: "profits",
  },
  {
    label: "Rango compras",
    query: "compras del 01/06/2026 al 19/06/2026 en excel",
    reportType: "purchases",
  },
];

export const voiceReportCommandExamples = suggestedVoiceReportQueries.map((suggestion) => suggestion.query);
