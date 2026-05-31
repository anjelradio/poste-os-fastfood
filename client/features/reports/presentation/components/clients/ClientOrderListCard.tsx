"use client";

import { useState } from "react";
import type { OrderListItem } from "@/features/orders/domain/entities/order-list-item";
import AppDialogModal from "@/features/shared/components/modals/AppDialogModal";
import ActionLinkButton from "@/features/shared/components/ui/ActionLinkButton";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-BO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function ClientOrderListCard({ order }: { order: OrderListItem }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="text-gray-200">#{order.orderNumber}</div>
        <div className="text-gray-200">{formatDate(order.createdDate)}</div>
        <div className="text-gray-200">{order.type}</div>
        <div className="text-gray-200">{order.status}</div>
        <div className="text-gray-200">Bs. {order.total}</div>
        <div className="flex items-center">
          <ActionLinkButton onClick={() => setOpen(true)} className="px-4 py-2 text-xs">
            VER DETALLE
          </ActionLinkButton>
        </div>
      </div>

      <div
        className="md:hidden px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="space-y-2">
          <div className="text-gray-200 font-semibold text-lg">Orden #{order.orderNumber}</div>
          <div className="text-gray-400 text-sm">Fecha: {formatDate(order.createdDate)}</div>
          <div className="text-gray-400 text-sm">Tipo: {order.type}</div>
          <div className="text-gray-400 text-sm">Estado: {order.status}</div>
          <div className="text-orange-400 font-semibold text-sm">Total: Bs. {order.total}</div>
          <ActionLinkButton onClick={() => setOpen(true)} className="w-full mt-2">
            VER DETALLE
          </ActionLinkButton>
        </div>
      </div>

      <AppDialogModal
        open={open}
        onOpenChange={setOpen}
        title={`Detalle Orden #${order.orderNumber}`}
        subtitle={`Cliente: ${order.clientName}`}
        size="lg"
      >
        <div className="space-y-3">
          {order.items.length === 0 ? (
            <p className="text-gray-300 text-sm">Esta orden no tiene items.</p>
          ) : (
            order.items.map((item) => (
              <div
                key={`${order.id}-${item.id}`}
                className="rounded-xl border border-gray-700/60 bg-white/5 p-3"
              >
                <p className="text-white font-semibold text-sm">{item.name}</p>
                <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-gray-300">
                  <p>Cantidad: {item.quantity}</p>
                  <p className="text-right">Subtotal: Bs. {item.subtotal}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5">
          <ActionLinkButton onClick={() => setOpen(false)} className="w-full">
            CERRAR
          </ActionLinkButton>
        </div>
      </AppDialogModal>
    </>
  );
}
