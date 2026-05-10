"use client";

import { Trash2 } from "lucide-react";

export default function DeletePurchaseItem({
  item,
  onDelete,
  className,
}: {
  item: { rawMaterialName: string };
  onDelete: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onDelete}
      className={className}
      aria-label={`Eliminar ${item.rawMaterialName}`}
    >
      <Trash2 className="h-5 w-5" />
    </button>
  );
}
