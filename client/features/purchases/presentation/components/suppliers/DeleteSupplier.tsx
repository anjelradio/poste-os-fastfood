"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import AppAlertModal from "@/features/shared/components/modals/AppAlertModal";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";
import { handleApiErrors } from "@/lib/api/errors";
import type { Supplier } from "@/features/purchases/domain/entities/supplier";
import { deleteSupplierAction } from "../../actions/supplier-actions";

type DeleteSupplierProps = {
  supplier: Supplier;
  className?: string;
  showLabel?: boolean;
};

export default function DeleteSupplier({
  supplier,
  className,
  showLabel = false,
}: DeleteSupplierProps) {
  const [open, setOpen] = useState(false);

  async function handleConfirmDelete() {
    const result = await deleteSupplierAction(supplier.id);

    if (result.ok) {
      showSuccessToast("Proveedor eliminado correctamente");
      return true;
    }

    handleApiErrors(
      result.errors.length > 0
        ? result.errors
        : ["Error al eliminar el proveedor."],
    );

    return false;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        aria-label={`Eliminar ${supplier.businessName}`}
      >
        <Trash2 className={showLabel ? "h-4 w-4" : "h-5 w-5"} />
        {showLabel ? <span className="text-sm font-medium">Eliminar</span> : null}
      </button>

      <AppAlertModal
        open={open}
        onOpenChange={setOpen}
        size="lg"
        title="Confirmar Eliminacion"
        description="Esta accion eliminara el proveedor y no se puede deshacer."
        confirmText="Eliminar"
        confirmPendingText="Eliminando..."
        onConfirm={handleConfirmDelete}
      >
        <div className="rounded-xl border border-gray-700/60 bg-white/5 p-4 backdrop-blur-md">
          <div className="space-y-2">
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-400">Razón social:</span>
              <span className="font-semibold text-white">{supplier.businessName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-400">Contacto:</span>
              <span className="font-semibold text-white">{supplier.contactName}</span>
            </div>
          </div>
        </div>
      </AppAlertModal>
    </>
  );
}
