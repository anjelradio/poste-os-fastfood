import Heading from "@/features/shared/components/ui/Heading";
import ActionLinkButton from "@/features/shared/components/ui/ActionLinkButton";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import { ArrowLeft, BookOpen, Receipt, TrendingUp } from "lucide-react";
import Link from "next/link";
import ReturnHeading from "@/features/shared/components/ui/ReturnHeading";

export default function HistoricalReportPage() {
  return (
    <>
      <ReturnHeading titlePage="Historial y Reportes"/>
      {/* Cards Grid - 2 columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Reporte de Ganancias (Full Height) */}
        <GradientCard
          gradientId="reporte-ganancias"
          minHeight={400}
          contentClassName="h-full rounded-2xl p-8 flex flex-col"
        >
          <div className="flex items-start gap-6 mb-4">
            <div
              className="shrink-0 w-16 h-16 rounded-2xl border-2 flex items-center justify-center"
              style={{
                border: "2px solid transparent",
                background:
                  "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)) padding-box, linear-gradient(to bottom, #fbbf24, #f97316, #ea580c) border-box",
                borderRadius: "1rem",
              }}
            >
              <TrendingUp
                className="h-8 w-8 text-white"
                strokeWidth={2.5}
                fill="none"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-white text-2xl font-bold mb-2">
                Reporte de Ganancias
              </h3>
              <p className="text-gray-300 text-base">
                Genera informes financieros y estadísticas de ventas.
              </p>
            </div>
          </div>

          <div className="flex-1" />

          <ActionLinkButton pageUrl="/administracion/historial-y-reportes/ordenes" className="w-full py-3 text-base">
            VER REPORTES
          </ActionLinkButton>
        </GradientCard>
        {/* Right Column - 2 rows */}
        <div className="flex flex-col gap-4">
          {/* Top Card - Historial de Órdenes */}
          <GradientCard
            gradientId="historial-ordenes"
            minHeight={196}
            contentClassName="h-full rounded-2xl p-6 flex flex-col"
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="shrink-0 w-14 h-14 rounded-2xl border-2 flex items-center justify-center"
                style={{
                  border: "2px solid transparent",
                  background:
                    "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)) padding-box, linear-gradient(to bottom, #fbbf24, #f97316, #ea580c) border-box",
                  borderRadius: "1rem",
                }}
              >
                <Receipt
                  className="h-7 w-7 text-white"
                  strokeWidth={2.5}
                  fill="none"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-white text-xl font-bold mb-1">
                  Historial de Órdenes
                </h3>
                <p className="text-gray-300 text-sm">
                  Consulta y detalle de todas las órdenes pasadas.
                </p>
              </div>
            </div>

            <div className="flex-1" />

            <ActionLinkButton
              pageUrl="/administracion/historial-y-reportes/ordenes"
              className="w-full"
            >
              VER HISTORIAL
            </ActionLinkButton>
          </GradientCard>

          {/* Bottom Card - Bitácora del Sistema */}
          <GradientCard
            gradientId="bitacora-sistema"
            minHeight={196}
            contentClassName="h-full rounded-2xl p-6 flex flex-col"
          >
            <div className="flex items-start gap-4 mb-4">
              <div
                className="shrink-0 w-14 h-14 rounded-2xl border-2 flex items-center justify-center"
                style={{
                  border: "2px solid transparent",
                  background:
                    "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)) padding-box, linear-gradient(to bottom, #fbbf24, #f97316, #ea580c) border-box",
                  borderRadius: "1rem",
                }}
              >
                <BookOpen
                  className="h-7 w-7 text-white"
                  strokeWidth={2.5}
                  fill="none"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-white text-xl font-bold mb-1">
                  Bitácora del Sistema
                </h3>
                <p className="text-gray-300 text-sm">
                  Registro detallado de todas las acciones y eventos del
                  sistema.
                </p>
              </div>
            </div>

            <div className="flex-1" />

            <ActionLinkButton
              pageUrl="/administracion/historial-y-reportes/bitacora"
              className="w-full"
            >
              VER BITÁCORA
            </ActionLinkButton>
          </GradientCard>
        </div>
      </div>
    </>
  );
}
