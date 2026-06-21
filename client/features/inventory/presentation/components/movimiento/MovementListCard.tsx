"use client";

import type { InventoryMovement } from "@/features/inventory/domain/entities/inventory-movement";

interface MovementListCardProps {
  movement: InventoryMovement;
}

function formatDateTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MovementListCard({ movement }: MovementListCardProps) {
  const formatAmount = (value: string) => Number(value).toFixed(2);

  // Determinar color de badge según tipo de movimiento
  const getBadgeStyles = (type: string) => {
    switch (type) {
      case "PURCHASE":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "SALE_CONSUMPTION":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "WASTE":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      case "ADJUSTMENT_IN":
        return "bg-teal-500/10 text-teal-400 border border-teal-500/20";
      case "ADJUSTMENT_OUT":
        return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  return (
    <div>
      {/* Vista Desktop (Tabla Grid de 8 columnas, misma distribución que LogCard) */}
      <div
        className="hidden md:grid grid-cols-8 gap-4 px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200 items-center"
        style={{ background: "transparent" }}
      >
        <div className="text-gray-200 text-sm">{formatDateTime(movement.createdAt)}</div>
        <div className="text-gray-200 font-medium col-span-2">{movement.rawMaterialName}</div>
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBadgeStyles(movement.movementType)}`}>
            {movement.movementTypeDisplay}
          </span>
        </div>
        <div className="text-gray-200 font-semibold">{formatAmount(movement.quantity)}</div>
        <div className="text-gray-300 text-sm col-span-2">{movement.reason || "-"}</div>
      </div>

      {/* Vista Mobile (Card) */}
      <div
        className="md:hidden px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-gray-200 font-bold text-base">{movement.rawMaterialName}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeStyles(movement.movementType)}`}>
              {movement.movementTypeDisplay}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Cantidad:</span>
            <span className="text-gray-200 font-semibold">{formatAmount(movement.quantity)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Fecha/Hora:</span>
            <span className="text-gray-300">{formatDateTime(movement.createdAt)}</span>
          </div>

          {movement.reason && (
            <div className="pt-1">
              <span className="text-gray-400 text-xs block">Descripción / Razón:</span>
              <p className="text-gray-300 text-sm mt-0.5 italic">{movement.reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
