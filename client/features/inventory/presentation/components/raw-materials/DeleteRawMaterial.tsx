"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import AppAlertModal from "@/features/shared/components/modals/AppAlertModal";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";

export default function DeleteRawMaterial({ rawMaterial, className, showLabel = false }: any) {
  const [open, setOpen] = useState(false);

  async function handleConfirmDelete() {
    showSuccessToast("Materia prima eliminada correctamente");
    return true;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        aria-label={`Eliminar ${rawMaterial.name}`}
      >
        <Trash2 className={showLabel ? "h-4 w-4" : "h-5 w-5"} />
        {showLabel ? <span className="text-sm font-medium">Eliminar</span> : null}
      </button>

      <AppAlertModal
        open={open}
        onOpenChange={setOpen}
        size="lg"
        title="Confirmar Eliminacion"
        description="Esta accion eliminara la materia prima y no se puede deshacer."
        confirmText="Eliminar"
        confirmPendingText="Eliminando..."
        onConfirm={handleConfirmDelete}
      >
        <div className="rounded-xl border border-gray-700/60 bg-white/5 p-4 backdrop-blur-md">
          <div className="space-y-2">
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-400">Nombre:</span>
              <span className="font-semibold text-white">{rawMaterial.name}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-400">Stock:</span>
              <span className="font-semibold text-orange-400">{rawMaterial.stock}</span>
            </div>
          </div>
        </div>
      </AppAlertModal>
    </>
  );
}
