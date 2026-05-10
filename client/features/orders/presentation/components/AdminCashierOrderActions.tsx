"use client";

import Link from "next/link";
import CancelOrderButton from "./CancelOrderButton";

export default function AdminCashierOrderActions({ order }: any) {
  if (order.status !== "PENDING") return null;

  return (
    <div className="grid grid-cols-1 gap-2">
      <Link
        href={`/caja/ordenes/${order.id}/editar`}
        className="w-full px-4 py-2 rounded-xl border-2 border-blue-500/50 text-blue-400 font-semibold text-sm hover:bg-blue-500/10 hover:border-blue-400/70 transition-all duration-200 text-center"
      >
        Editar Orden
      </Link>
      <CancelOrderButton order={order} />
    </div>
  );
}
