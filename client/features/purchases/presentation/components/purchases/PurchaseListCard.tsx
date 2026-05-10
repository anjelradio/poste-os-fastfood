import type { Purchase } from "@/features/purchases/domain/entities/purchase";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import DeletePurchase from "./DeletePurchase";

export default function PurchaseListCard({ purchase }: { purchase: Purchase }) {
  const purchasedAt = new Date(purchase.purchasedAt).toLocaleString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <div
        className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="text-gray-200">{purchase.supplierName}</div>
        <div className="text-gray-200">{purchasedAt}</div>
        <div className="text-gray-200">{purchase.description || "Sin descripcion"}</div>
        <div className="text-orange-400 font-semibold">Bs. {purchase.total}</div>
        <div className="flex items-center gap-3">
          <Link
            href={`/administracion/compras-y-proveedores/compras/${purchase.id}/editar`}
            className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
          >
            <Edit2 className="h-5 w-5" />
          </Link>
          <DeletePurchase
            purchase={purchase}
            className="text-red-400 hover:text-red-300 transition-colors duration-200"
          />
        </div>
      </div>

      <div
        className="md:hidden px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="space-y-2">
          <div className="text-gray-200 font-semibold text-lg">{purchase.supplierName}</div>
          <div className="text-gray-400 text-sm">{purchasedAt}</div>
          <div className="text-gray-400 text-sm">{purchase.description || "Sin descripcion"}</div>
          <div className="text-orange-400 font-bold text-base">Bs. {purchase.total}</div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              href={`/administracion/compras-y-proveedores/compras/${purchase.id}/editar`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition-colors duration-200"
            >
              <Edit2 className="h-4 w-4" />
              <span className="text-sm font-medium">Editar</span>
            </Link>
            <DeletePurchase
              purchase={purchase}
              showLabel
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors duration-200"
            />
          </div>
        </div>
      </div>
    </>
  );
}
