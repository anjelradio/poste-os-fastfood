import ActionLinkButton from "@/features/shared/components/ui/ActionLinkButton";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import ReturnHeading from "@/features/shared/components/ui/ReturnHeading";
import { ShoppingCart, Truck } from "lucide-react";

export default function PurchasesAndSuppliersPage() {
  return (
    <>
      <ReturnHeading titlePage="Compras y Proveedores" backHref="/administracion" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
              <ShoppingCart
                className="h-7 w-7 text-white"
                strokeWidth={2.5}
                fill="none"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-white text-xl font-bold mb-1">
                Gestión de Compras
              </h3>
              <p className="text-gray-300 text-sm">
                Registrar y consultar órdenes de compra.
              </p>
            </div>
          </div>

          <div className="flex-1" />

          <ActionLinkButton
            pageUrl="/administracion/compras-y-proveedores/compras"
            className="w-full"
          >
            GESTIONAR COMPRAS
          </ActionLinkButton>
        </GradientCard>
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
              <Truck
                className="h-7 w-7 text-white"
                strokeWidth={2.5}
                fill="none"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-white text-xl font-bold mb-1">
                Gestión de Proveedores
              </h3>
              <p className="text-gray-300 text-sm">
                Gestionar contactos y productos.
              </p>
            </div>
          </div>

          <div className="flex-1" />

          <ActionLinkButton
            pageUrl="/administracion/compras-y-proveedores/proveedores"
            className="w-full"
          >
            GESTIONAR PROVEEDORES
          </ActionLinkButton>
        </GradientCard>
      </div>
    </>
  );
}
