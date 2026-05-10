"use client";

import { Trash2 } from "lucide-react";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";

export default function DeleteRecipeItem({ item, className, showLabel = false }: any) {
  function handleDelete() {
    showSuccessToast("Ingrediente eliminado correctamente");
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className={className}
      aria-label={`Eliminar ${item.name}`}
    >
      <Trash2 className={showLabel ? "h-4 w-4" : "h-5 w-5"} />
      {showLabel ? <span className="text-sm font-medium">Eliminar</span> : null}
    </button>
  );
}
