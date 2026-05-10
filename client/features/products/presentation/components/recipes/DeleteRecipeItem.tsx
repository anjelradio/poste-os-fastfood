"use client";

import { Trash2 } from "lucide-react";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";

export default function DeleteRecipeItem({
  item,
  onDelete,
  className,
  showLabel = false,
}: {
  item: { rawMaterialName: string };
  onDelete: () => void;
  className?: string;
  showLabel?: boolean;
}) {
  function handleDelete() {
    onDelete();
    showSuccessToast("Ingrediente eliminado correctamente");
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className={className}
      aria-label={`Eliminar ${item.rawMaterialName}`}
    >
      <Trash2 className={showLabel ? "h-4 w-4" : "h-5 w-5"} />
      {showLabel ? <span className="text-sm font-medium">Eliminar</span> : null}
    </button>
  );
}
