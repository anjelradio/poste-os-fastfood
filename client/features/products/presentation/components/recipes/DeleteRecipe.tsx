"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import AppAlertModal from "@/features/shared/components/modals/AppAlertModal";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";

export default function DeleteRecipe({ recipe, className, showLabel = false }: any) {
  const [open, setOpen] = useState(false);

  async function handleConfirmDelete() {
    showSuccessToast("Receta eliminada correctamente");
    return true;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        aria-label={`Eliminar receta de ${recipe.name}`}
      >
        <Trash2 className={showLabel ? "h-4 w-4" : "h-5 w-5"} />
        {showLabel ? <span className="text-sm font-medium">Eliminar</span> : null}
      </button>

      <AppAlertModal
        open={open}
        onOpenChange={setOpen}
        size="lg"
        title="Confirmar Eliminacion"
        description="Esta accion eliminara la receta y no se puede deshacer."
        confirmText="Eliminar"
        confirmPendingText="Eliminando..."
        onConfirm={handleConfirmDelete}
      >
        <div className="rounded-xl border border-gray-700/60 bg-white/5 p-4 backdrop-blur-md">
          <div className="space-y-2">
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-400">Producto:</span>
              <span className="font-semibold text-white">{recipe.name}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-400">Categoria:</span>
              <span className="font-semibold text-white">{recipe.category}</span>
            </div>
          </div>
        </div>
      </AppAlertModal>
    </>
  );
}
