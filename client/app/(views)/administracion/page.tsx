import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import ActionLinkButton from "@/features/shared/components/ui/ActionLinkButton";
import {
  DollarSign,
  Package,
  ShoppingBag,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";

export default function AdminPage() {
  return (
    <div className="flex-1 pb-10">
      {/* Top Stats Cards Row - All same height */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* VENTAS HOY Card */}
        <GradientCard
          gradientId="ventas-hoy"
          minHeight={120}
          contentClassName="p-5"
        >
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-gray-300 text-xs font-medium mb-2 tracking-wide">
                VENTAS HOY
              </p>
              <p className="text-white text-3xl font-bold">$1,250.50</p>
            </div>

            <div
              className="w-14 h-14 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{
                borderRadius: "50%",
                border: "2px solid transparent",
                background:
                  "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)) padding-box, linear-gradient(to bottom, #fbbf24, #f97316, #ea580c) border-box",
              }}
            >
              <DollarSign
                className="h-7 w-7 text-white"
                strokeWidth={2.5}
                fill="none"
              />
            </div>
          </div>
        </GradientCard>

        {/* ÓRDENES HOY Card */}
        <GradientCard
          gradientId="ordenes-hoy"
          minHeight={120}
          contentClassName="p-5"
        >
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-gray-300 text-xs font-medium mb-2 tracking-wide">
                ÓRDENES HOY
              </p>
              <p className="text-white text-3xl font-bold">85</p>
            </div>

            <div
              className="w-14 h-14 rounded-full border-2 flex items-center justify-center flex-shrink-0"
              style={{
                borderRadius: "50%",
                border: "2px solid transparent",
                background:
                  "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)) padding-box, linear-gradient(to bottom, #fbbf24, #f97316, #ea580c) border-box",
              }}
            >
              <Ticket
                className="h-7 w-7 text-white"
                strokeWidth={2.5}
                fill="none"
              />
            </div>
          </div>
        </GradientCard>

        {/* TOP PRODUCTO Card */}
        <GradientCard
          gradientId="top-producto"
          minHeight={120}
          contentClassName="p-5"
        >
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-gray-300 text-xs font-medium mb-2 tracking-wide">
                TOP PRODUCTO
              </p>
              <p className="text-white text-lg font-semibold">
                Hamburguesa Porteña
              </p>
            </div>

            <div className="ml-2 flex-shrink-0">
              {/*<img
                src={burgerImage}
                alt="Hamburguesa"
                className="object-contain"
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))",
                  height: "3.5rem",
                  width: "3.5rem",
                }}
              />*/}
            </div>
          </div>
        </GradientCard>
      </div>

      {/* Bottom Management Cards Row - Aligned heights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* GESTIÓN DE PRODUCTOS Card - Left side with large burger */}
        <GradientCard
          gradientId="gestion-productos"
          height={340}
          className="overflow-hidden rounded-2xl"
          contentClassName="p-6 flex flex-col"
        >
          {/* Content */}
          <div className="mb-4 relative z-10">
            <h3 className="text-white text-xl font-bold mb-1">
              GESTIÓN DE PRODUCTOS
            </h3>
            <p className="text-gray-300 text-sm">
              Agregar, editar precios, inventario.
            </p>
          </div>

          {/* Large Burger Image */}
          <div
            className="absolute pointer-events-none"
            style={{ right: "-21%", bottom: "-7%" }}
          >
            {/*<img
              src={burgerImage}
              alt="Hamburguesa"
              className="object-contain"
              style={{
                filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.7))",
                height: "28.4rem",
                width: "28.4rem",
                opacity: 0.95,
              }}
            />*/}
          </div>

          {/* Spacer to push button to bottom */}
          <div className="flex-1" />

          {/* Button at bottom left */}
          <div className="relative z-10">
            <ActionLinkButton
              pageUrl="/administracion/productos"
              style={{ width: "60%", minWidth: "200px" }}
            >
              ADMINISTRAR CATÁLOGO
            </ActionLinkButton>
          </div>
        </GradientCard>

        {/* Right Column - HISTORIAL Y REPORTES + USUARIOS DEL SISTEMA */}
        <div className="flex flex-col gap-4">
          {/* HISTORIAL Y REPORTES Card */}
          <GradientCard
            gradientId="historial-reportes"
            height={166}
            contentClassName="p-6 flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-white text-xl font-bold mb-1">
                  HISTORIAL Y REPORTES
                </h3>
                <p className="text-gray-300 text-sm">
                  Generar informes de ventas pasadas.
                </p>
              </div>

              <div
                className="w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3"
                style={{
                  borderRadius: "50%",
                  border: "2px solid transparent",
                  background:
                    "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)) padding-box, linear-gradient(to bottom, #fbbf24, #f97316, #ea580c) border-box",
                }}
              >
                <TrendingUp
                  className="h-6 w-6 text-white"
                  strokeWidth={2.5}
                  fill="none"
                />
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Button */}
            <div>
              <ActionLinkButton
                pageUrl="/administracion/historial-y-reportes"
                style={{ width: "45%", minWidth: "150px" }}
              >
                VER HISTORIAL
              </ActionLinkButton>
            </div>
          </GradientCard>

          {/* USUARIOS DEL SISTEMA Card */}
          <GradientCard
            gradientId="usuarios-sistema"
            height={166}
            contentClassName="p-6 flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-white text-xl font-bold mb-1">
                  USUARIOS DEL SISTEMA
                </h3>
                <p className="text-gray-300 text-sm">
                  Cajeros, Cocineros, Admins.
                </p>
              </div>

              <div
                className="w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3"
                style={{
                  borderRadius: "50%",
                  border: "2px solid transparent",
                  background:
                    "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)) padding-box, linear-gradient(to bottom, #fbbf24, #f97316, #ea580c) border-box",
                }}
              >
                <Users
                  className="h-6 w-6 text-white"
                  strokeWidth={2.5}
                  fill="none"
                />
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Button */}
            <div>
              <ActionLinkButton
                pageUrl="/administracion/usuarios"
                style={{ width: "55%", minWidth: "170px" }}
              >
                GESTIONAR CUENTAS
              </ActionLinkButton>
            </div>
          </GradientCard>
        </div>
      </div>
      {/* INVENTARIO Y PROVEEDORES - Two Column Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* INVENTARIO Y MATERIAS PRIMAS Card */}
        <GradientCard
          gradientId="inventario-material"
          height={166}
          contentClassName="p-6 flex flex-col"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-white text-xl font-bold mb-1">
                INVENTARIO Y MATERIAS PRIMAS
              </h3>
              <p className="text-gray-300 text-sm">
                Gestión de stock y materias primas.
              </p>
            </div>

            <div
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3"
              style={{
                borderRadius: "50%",
                border: "2px solid transparent",
                background:
                  "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)) padding-box, linear-gradient(to bottom, #fbbf24, #f97316, #ea580c) border-box",
              }}
            >
              <Package
                className="h-6 w-6 text-white"
                strokeWidth={2.5}
                fill="none"
              />
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Button */}
          <div>
            <ActionLinkButton
              pageUrl="/administracion/inventario"
              style={{ width: "45%", minWidth: "150px" }}
            >
              GESTIONAR INVENTARIO
            </ActionLinkButton>
          </div>
        </GradientCard>
        {/* COMPRAS Y PROVEEDORES Card */}
        <GradientCard
          gradientId="compras-proveedores"
          height={166}
          contentClassName="p-6 flex flex-col"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-white text-xl font-bold mb-1">
                COMPRAS Y PROVEEDORES
              </h3>
              <p className="text-gray-300 text-sm">
                Gestión de pedidos y proveedores.
              </p>
            </div>

            <div
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3"
              style={{
                borderRadius: "50%",
                border: "2px solid transparent",
                background:
                  "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)) padding-box, linear-gradient(to bottom, #fbbf24, #f97316, #ea580c) border-box",
              }}
            >
              <ShoppingBag
                className="h-6 w-6 text-white"
                strokeWidth={2.5}
                fill="none"
              />
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Button */}
          <div>
            <ActionLinkButton
              pageUrl="/administracion/compras-y-proveedores"
              style={{ width: "45%", minWidth: "150px" }}
            >
              GESTIONAR COMPRAS
            </ActionLinkButton>
          </div>
        </GradientCard>
      </div>
    </div>
  );
}
