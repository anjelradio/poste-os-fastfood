"use client";

import { useRef, useState, useTransition } from "react";
import { FileText, Loader2, Mic, MicOff, Table2, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import {
  showErrorToast,
  showSuccessToast,
} from "@/features/shared/components/toast/ToastNotifications";
import {
  generateProductSalesReportAction,
  generateProfitsReportAction,
  generatePurchasesReportAction,
  getProductSalesSummaryAction,
  getProfitsSummaryAction,
  getPurchasesSummaryAction,
} from "@/features/reports/presentation/actions/report-actions";
import type { Product } from "@/features/products/domain/entities/product";
import type {
  ReportFormat,
  ReportRange,
  SummarySource,
  VoiceReportSummaryData,
  VoiceReportType,
} from "@/features/reports/domain/entities/voice-report";
import {
  buildVoiceReportSpeechText,
  getCurrentMonthRange,
  getDefaultProductId,
  isSupportedVoiceReportQuery,
  parseVoiceReportQuery,
} from "@/features/reports/domain/services/voice-report-query";
import {
  reportTypeOptions,
  speechLanguageOptions,
  voiceReportCommandExamples,
  suggestedVoiceReportQueries,
} from "@/features/reports/presentation/constants/voice-report-options";
import type {
  SpeechRecognitionLike,
  SpeechRecognitionWindow,
} from "@/features/reports/presentation/types/speech-recognition";
import VoiceReportSummaryContent from "./VoiceReportSummaryContent";

function downloadFileFromBytes(data: {
  bytes: number[];
  contentType: string;
  fileName: string;
}) {
  const byteArray = new Uint8Array(data.bytes);
  const blob = new Blob([byteArray], { type: data.contentType });
  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = data.fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(fileUrl);
}

function getSpeechErrorMessage(error: string) {
  const messages: Record<string, string> = {
    "audio-capture": "No encuentro un microfono activo en el equipo.",
    "language-not-supported": "Ese idioma no esta soportado por el navegador.",
    network: "El navegador no pudo conectar con su servicio de reconocimiento de voz.",
    "no-speech": "No detecte voz. Habla un poco mas cerca del microfono e intentalo otra vez.",
    "not-allowed": "El navegador no tiene permiso para usar el microfono.",
    "service-not-allowed": "El navegador bloqueo el servicio de reconocimiento de voz.",
  };

  return messages[error] ?? "No se pudo reconocer la voz. Intenta otra vez.";
}

function buildUnsupportedQueryMessage(query: string) {
  const spokenQuery = query.trim() ? ` "${query.trim()}"` : "";
  return `No reconozco la consulta${spokenQuery}. Prueba con una consulta de ganancias, compras o ventas por producto.`;
}

export default function VoiceReportsPanel({ products }: { products: Product[] }) {
  const [activeReportType, setActiveReportType] = useState<VoiceReportType>("profits");
  const [query, setQuery] = useState("");
  const [speechLanguage, setSpeechLanguage] = useState("es-ES");
  const [voiceStatus, setVoiceStatus] = useState("");
  const [resultText, setResultText] = useState("");
  const [selectedRange, setSelectedRange] = useState<ReportRange>(getCurrentMonthRange);
  const [selectedProductId, setSelectedProductId] = useState(getDefaultProductId(products));
  const [summary, setSummary] = useState<VoiceReportSummaryData | null>(null);
  const [isQueryHelpVisible, setIsQueryHelpVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPending, startTransition] = useTransition();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const lastVoiceQueryRef = useRef("");

  const speechRecognitionApi =
    typeof window !== "undefined"
      ? (window as SpeechRecognitionWindow).SpeechRecognition ??
        (window as SpeechRecognitionWindow).webkitSpeechRecognition
      : undefined;
  const canUseSpeechRecognition = Boolean(speechRecognitionApi);
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

  const speakSummary = (nextSummary: VoiceReportSummaryData) => {
    if (!canSpeak) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(buildVoiceReportSpeechText(nextSummary));
    utterance.lang = speechLanguage;
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const speakMessage = (message: string) => {
    if (!canSpeak) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = speechLanguage;
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopVoiceOutput = () => {
    recognitionRef.current?.stop();
    if (canSpeak) {
      window.speechSynthesis.cancel();
    }
    setIsListening(false);
    setIsSpeaking(false);
    setVoiceStatus("Voz detenida.");
  };

  const requestSummary = (
    reportType: VoiceReportType,
    range: ReportRange,
    source: SummarySource,
    productId = selectedProductId,
  ) => {
    setActiveReportType(reportType);
    setSelectedRange(range);
    if (reportType === "product-sales") {
      setSelectedProductId(productId);
    }

    startTransition(async () => {
      const basePayload = {
        fromDate: range.fromDate,
        toDate: range.toDate,
        source,
      };
      const result =
        reportType === "profits"
          ? await getProfitsSummaryAction(basePayload)
          : reportType === "purchases"
            ? await getPurchasesSummaryAction(basePayload)
            : await getProductSalesSummaryAction({ ...basePayload, productId });

      if (!result.ok) {
        setResultText("");
        setIsQueryHelpVisible(false);
        showErrorToast(result.errors[0] ?? "No se pudo obtener el reporte por voz");
        return;
      }

      if (!result.data) {
        setSummary(null);
        setResultText("");
        setIsQueryHelpVisible(false);
        showErrorToast("No se encontraron resultados para el filtro seleccionado");
        return;
      }

      const nextSummary = { type: reportType, data: result.data } as VoiceReportSummaryData;
      const nextResultText = buildVoiceReportSpeechText(nextSummary);
      setSummary(nextSummary);
      setResultText(nextResultText);
      setIsQueryHelpVisible(false);
      speakSummary(nextSummary);
    });
  };

  const handleDynamicQuery = (source: SummarySource = "text") => {
    if (!isSupportedVoiceReportQuery(query)) {
      const message = buildUnsupportedQueryMessage(query);
      setSummary(null);
      setResultText(message);
      setIsQueryHelpVisible(true);
      setVoiceStatus("Orden no reconocida.");
      speakMessage("Orden no reconocida. Prueba con ganancias, compras o ventas por producto.");
      showErrorToast("Orden no reconocida. Revisa los comandos disponibles.");
      return;
    }

    const parsedQuery = parseVoiceReportQuery(query, activeReportType, products);
    const nextProductId =
      parsedQuery.reportType === "product-sales"
        ? parsedQuery.productId ?? selectedProductId
        : selectedProductId;

    if (parsedQuery.reportType === "product-sales" && !nextProductId) {
      showErrorToast("Selecciona un producto para el reporte de ventas");
      return;
    }

    requestSummary(parsedQuery.reportType, parsedQuery, source, nextProductId);
  };

  const startListening = () => {
    if (!speechRecognitionApi) {
      const message = "Tu navegador no soporta reconocimiento de voz";
      setVoiceStatus(message);
      showErrorToast(message);
      return;
    }

    const recognition = new speechRecognitionApi();
    lastVoiceQueryRef.current = "";
    recognitionRef.current = recognition;
    recognition.lang = speechLanguage;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const resultIndex = event.resultIndex ?? 0;
      const result = event.results[resultIndex];
      const transcript = result?.[0]?.transcript?.trim();
      if (!transcript) {
        return;
      }

      setQuery(transcript);
      setVoiceStatus(`${result?.isFinal ? "Detectado" : "Escuchando"}: ${transcript}`);

      if (!result?.isFinal || transcript === lastVoiceQueryRef.current) {
        return;
      }

      lastVoiceQueryRef.current = transcript;
      if (!isSupportedVoiceReportQuery(transcript)) {
        const message = buildUnsupportedQueryMessage(transcript);
        setSummary(null);
        setResultText(message);
        setIsQueryHelpVisible(true);
        setVoiceStatus("Orden no reconocida.");
        speakMessage("Orden no reconocida. Prueba con ganancias, compras o ventas por producto.");
        showErrorToast("Orden no reconocida. Revisa los comandos disponibles.");
        return;
      }

      const parsedQuery = parseVoiceReportQuery(transcript, activeReportType, products);
      const nextProductId =
        parsedQuery.reportType === "product-sales"
          ? parsedQuery.productId ?? selectedProductId
          : selectedProductId;

      if (parsedQuery.reportType === "product-sales" && !nextProductId) {
        showErrorToast("Selecciona un producto para el reporte de ventas");
        return;
      }

      requestSummary(parsedQuery.reportType, parsedQuery, "voice", nextProductId);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      const message = getSpeechErrorMessage(event.error);
      setVoiceStatus(message);
      showErrorToast(message);
    };
    recognition.onnomatch = () => {
      const message = "Escuche audio, pero no pude convertirlo en texto.";
      setVoiceStatus(message);
      showErrorToast(message);
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    setVoiceStatus("Escuchando... habla despues de permitir el microfono.");
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setVoiceStatus("Escucha detenida.");
    setIsListening(false);
  };

  const handleSelectedRangeChange = (field: "fromDate" | "toDate", value: string) => {
    setSelectedRange((currentRange) => ({
      ...currentRange,
      [field]: value,
      label: "rango manual",
    }));
  };

  const handleApplySelectedRange = () => {
    if (!selectedRange.fromDate || !selectedRange.toDate) {
      showErrorToast("Selecciona fecha inicial y fecha final");
      return;
    }

    const normalizedRange =
      selectedRange.fromDate <= selectedRange.toDate
        ? selectedRange
        : {
            ...selectedRange,
            fromDate: selectedRange.toDate,
            toDate: selectedRange.fromDate,
          };

    if (activeReportType === "product-sales" && !selectedProductId) {
      showErrorToast("Selecciona un producto para el reporte de ventas");
      return;
    }

    setSelectedRange(normalizedRange);
    requestSummary(activeReportType, normalizedRange, "text", selectedProductId);
  };

  const handleDownload = (format: ReportFormat) => {
    startTransition(async () => {
      const basePayload = {
        fromDate: selectedRange.fromDate,
        toDate: selectedRange.toDate,
        reportFormat: format,
      };
      const result =
        activeReportType === "profits"
          ? await generateProfitsReportAction(basePayload)
          : activeReportType === "purchases"
            ? await generatePurchasesReportAction({ ...basePayload, includeItems: true })
            : await generateProductSalesReportAction({
                ...basePayload,
                productId: selectedProductId,
                includeOrders: true,
              });

      if (!result.ok) {
        showErrorToast(result.errors[0] ?? "No se pudo descargar el reporte");
        return;
      }

      if (!result.data) {
        showErrorToast("No se encontraron resultados para el filtro seleccionado");
        return;
      }

      downloadFileFromBytes(result.data);
      showSuccessToast(`Reporte ${format === "pdf" ? "PDF" : "Excel"} descargado`);
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <GradientCard gradientId="voice-reports-panel" contentClassName="rounded-2xl p-8">
        <div className="mb-6">
          <div>
            <h2 className="bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 bg-clip-text text-3xl font-bold text-transparent">
              Consultas por voz
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Consulta ganancias, compras o ventas por producto con voz y descarga PDF o Excel.
            </p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {reportTypeOptions.map((option) => (
            <Button
              key={option.key}
              type="button"
              variant="outline"
              onClick={() => setActiveReportType(option.key)}
              className={cn(
                "h-11 rounded-xl border-orange-400/30 bg-white/5 text-white hover:bg-orange-500/20",
                activeReportType === option.key && "border-orange-400 bg-orange-500/25 text-orange-100",
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {activeReportType === "product-sales" ? (
          <label className="mb-5 flex flex-col gap-1 text-sm text-gray-300">
            Producto para ventas
            <select
              value={selectedProductId || ""}
              onChange={(event) => setSelectedProductId(Number(event.target.value))}
              className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-orange-400"
            >
              {products.length === 0 ? (
                <option value="" className="bg-gray-800">
                  No hay productos disponibles
                </option>
              ) : null}
              {products.map((product) => (
                <option key={product.id} value={product.id} className="bg-gray-800">
                  {product.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto_auto]">
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Idioma de voz
              <select
                value={speechLanguage}
                onChange={(event) => setSpeechLanguage(event.target.value)}
                className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-orange-400"
              >
                {speechLanguageOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <Button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={!canUseSpeechRecognition || isPending}
              className="h-11 self-end rounded-xl bg-orange-500 px-4 font-semibold text-white hover:bg-orange-600"
            >
              {isListening ? <MicOff /> : <Mic />}
              {isListening ? "Detener" : "Hablar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={stopVoiceOutput}
              disabled={!isListening && !isSpeaking}
              className="h-11 self-end rounded-xl border-red-400/50 bg-white/5 text-white hover:bg-red-500/20"
            >
              <VolumeX />
              Stop voz
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDynamicQuery("text")}
              disabled={isPending}
              className="h-11 self-end rounded-xl border-orange-400/50 bg-white/5 text-white hover:bg-orange-500/20"
            >
              {isPending ? <Loader2 className="animate-spin" /> : <Volume2 />}
              Interpretar
            </Button>
          </div>

          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ej: ganancias de hoy, compras ultimos 30 dias en excel, ventas por producto esta semana"
            className="min-h-24 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-orange-400"
          />

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">Consultas que puedes decir</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedVoiceReportQueries.map((suggestion) => (
                <button
                  key={suggestion.query}
                  type="button"
                  onClick={() => {
                    setQuery(suggestion.query);
                    setActiveReportType(suggestion.reportType);
                  }}
                  className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1.5 text-xs text-orange-100 transition hover:bg-orange-500/25"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>

          {!canUseSpeechRecognition ? (
            <p className="text-sm text-yellow-300">
              El reconocimiento de voz no esta disponible en este navegador. Puedes escribir la consulta.
            </p>
          ) : null}
          {voiceStatus ? (
            <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200">
              {voiceStatus}
            </p>
          ) : null}
          {resultText ? (
            <div
              className={cn(
                "rounded-xl border p-4",
                isQueryHelpVisible
                  ? "border-red-400/30 bg-red-500/10"
                  : "border-orange-400/20 bg-orange-500/10",
              )}
            >
              <p
                className={cn(
                  "text-xs uppercase tracking-wide",
                  isQueryHelpVisible ? "text-red-200" : "text-orange-200",
                )}
              >
                {isQueryHelpVisible ? "Comandos disponibles" : "Resultado"}
              </p>
              <p className="mt-2 text-sm leading-6 text-orange-50">{resultText}</p>
              {isQueryHelpVisible ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {voiceReportCommandExamples.map((command) => (
                    <button
                      key={command}
                      type="button"
                      onClick={() => setQuery(command)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-orange-50 transition hover:bg-orange-500/20"
                    >
                      {command}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Rango seleccionado</p>
              <p className="mt-1 text-sm font-semibold text-white">
                {selectedRange.fromDate} a {selectedRange.toDate}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
              <label className="flex flex-col gap-1 text-sm text-gray-300">
                Desde
                <input
                  type="date"
                  value={selectedRange.fromDate}
                  onChange={(event) => handleSelectedRangeChange("fromDate", event.target.value)}
                  className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-orange-400"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-gray-300">
                Hasta
                <input
                  type="date"
                  value={selectedRange.toDate}
                  onChange={(event) => handleSelectedRangeChange("toDate", event.target.value)}
                  className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-orange-400"
                />
              </label>
              <Button
                type="button"
                variant="outline"
                onClick={handleApplySelectedRange}
                disabled={isPending}
                className="h-11 self-end rounded-xl border-orange-400/50 bg-white/5 text-white hover:bg-orange-500/20"
              >
                {isPending ? <Loader2 className="animate-spin" /> : null}
                Aplicar rango
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 md:self-end">
              <Button
                type="button"
                onClick={() => handleDownload("pdf")}
                disabled={isPending}
                className="rounded-xl bg-red-500 px-4 text-white hover:bg-red-600"
              >
                <FileText />
                PDF
              </Button>
              <Button
                type="button"
                onClick={() => handleDownload("excel")}
                disabled={isPending}
                className="rounded-xl bg-emerald-600 px-4 text-white hover:bg-emerald-700"
              >
                <Table2 />
                Excel
              </Button>
            </div>
          </div>
        </div>

        {summary ? <VoiceReportSummaryContent summary={summary} /> : null}
      </GradientCard>
    </div>
  );
}
