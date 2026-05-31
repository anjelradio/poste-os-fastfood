import ActionLinkButton from "@/features/shared/components/ui/ActionLinkButton";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import { BookOpen, Receipt, TrendingUp, Users } from "lucide-react";
import ReturnHeading from "@/features/shared/components/ui/ReturnHeading";

export default function HistoricalReportPage() {
  return (
    <>
      <ReturnHeading
        titlePage="Historial y Reportes"
        backHref="/administracion"
      />
      {/* Cards Grid - 2 columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Reportes del Negocio (Full Height) */}
        <GradientCard
          gradientId="reportes-negocio"
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
                Reportes del Negocio
              </h3>
              <p className="text-gray-300 text-base">
                Genera reportes de ganancias, compras, inventario y ventas por producto.
              </p>
            </div>
          </div>

          <div className="flex-1" />

          <ActionLinkButton
            pageUrl="/administracion/historial-y-reportes/reportes/ganancias"
            className="w-full py-3 text-base"
          >
            MAS REPORTES
          </ActionLinkButton>
        </GradientCard>
        {/* Right Column - 3 rows */}
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

          {/* Clients Card */}
          <GradientCard
            gradientId="clientes"
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
                <Users
                  className="h-7 w-7 text-white"
                  strokeWidth={2.5}
                  fill="none"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-white text-xl font-bold mb-1">
                  Clientes
                </h3>
                <p className="text-gray-300 text-sm">
                  Lista de clientes registrados para consultar su historial de órdenes.
                </p>
              </div>
            </div>

            <div className="flex-1" />

            <ActionLinkButton
              pageUrl="/administracion/historial-y-reportes/clientes"
              className="w-full"
            >
              VER CLIENTES
            </ActionLinkButton>
          </GradientCard>

        </div>
      </div>
    </>
  );
}
