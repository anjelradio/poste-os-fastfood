"use client";

import { useState } from "react";
import AppAlertModal from "@/features/shared/components/modals/AppAlertModal";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";
import { showErrorToast } from "@/features/shared/components/toast/ToastNotifications";
import { cancelOrder } from "@/actions/orders/cancel-order";

export default function CancelOrderButton({ order }: any) {
  const [open, setOpen] = useState(false);

  async function handleConfirmCancel() {
    const response = await cancelOrder(order.id);

    if (!response.ok) {
      showErrorToast(response.errors?.[0] ?? "Error al cancelar la orden");
      return false;
    }

    showSuccessToast(`Orden #${order.orderNumber} cancelada correctamente`);
    return true;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full px-4 py-2 rounded-xl border-2 border-red-500/50 text-red-400 font-semibold text-sm hover:bg-red-500/10 hover:border-red-400/70 transition-all duration-200 cursor-pointer"
      >
        Cancelar Orden
      </button>

      <AppAlertModal
        open={open}
        onOpenChange={setOpen}
        title="Cancelar orden"
        description="Esta acción cambiará el estado de la orden a cancelado."
        confirmText="Confirmar"
        confirmPendingText="Cancelando..."
        onConfirm={handleConfirmCancel}
      >
        <div className="rounded-xl border border-gray-700/60 bg-white/5 p-4 backdrop-blur-md">
          <p className="text-sm text-gray-300 mb-3">
            ¿Seguro que deseas cancelar la orden <span className="font-semibold text-white">#{order.orderNumber}</span>?
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-gray-400">Cliente:</span>
              <span className="font-semibold text-white">{order.clientName}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-1">Contenido:</span>
              <ul className="space-y-1">
                {order.items.map((item: any) => (
                  <li key={item.id} className="text-gray-300">
                    • {item.name} x{item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </AppAlertModal>
    </>
  );
}
