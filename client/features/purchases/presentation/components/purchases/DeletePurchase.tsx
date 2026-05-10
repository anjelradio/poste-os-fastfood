"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import AppAlertModal from "@/features/shared/components/modals/AppAlertModal";
import {
  showErrorToast,
  showSuccessToast,
} from "@/features/shared/components/toast/ToastNotifications";
import { deletePurchaseAction } from "../../actions/purchase-actions";
import type { Purchase } from "@/features/purchases/domain/entities/purchase";

export default function DeletePurchase({
  purchase,
  className,
  showLabel = false,
}: {
  purchase: Purchase;
  className?: string;
  showLabel?: boolean;
}) {
  const [open, setOpen] = useState(false);

  async function handleConfirmDelete() {
    const response = await deletePurchaseAction(purchase.id);

    if (!response.ok) {
      showErrorToast(response.errors[0] ?? "Error al eliminar la compra");
      return false;
    }

    showSuccessToast("Compra eliminada correctamente");
    return true;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        aria-label={`Eliminar compra ${purchase.id}`}
      >
        <Trash2 className={showLabel ? "h-4 w-4" : "h-5 w-5"} />
        {showLabel ? <span className="text-sm font-medium">Eliminar</span> : null}
      </button>

      <AppAlertModal
        open={open}
        onOpenChange={setOpen}
        title="Confirmar eliminación"
        description="Esta acción eliminará la compra y no se puede deshacer."
        confirmText="Eliminar"
        confirmPendingText="Eliminando..."
        onConfirm={handleConfirmDelete}
      >
        <div className="rounded-xl border border-gray-700/60 bg-white/5 p-4 backdrop-blur-md">
          <div className="space-y-2">
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-400">Proveedor:</span>
              <span className="font-semibold text-white">{purchase.supplierName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-400">Total:</span>
              <span className="font-bold text-orange-400">Bs. {purchase.total}</span>
            </div>
          </div>
        </div>
      </AppAlertModal>
    </>
  );
}
