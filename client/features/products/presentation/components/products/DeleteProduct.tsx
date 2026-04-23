"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { deleteProductAction } from "../../actions/product-actions";
import {
  showSuccessToast,
} from "@/features/shared/components/toast/ToastNotifications";
import { handleApiErrors } from "@/lib/api/errors";
import AppAlertModal from "@/features/shared/components/modals/AppAlertModal";
import type { Product } from "@/features/products/domain/entities/product";

type DeleteProductProps = {
  product: Product;
  className?: string;
  showLabel?: boolean;
};

export default function DeleteProduct({
  product,
  className,
  showLabel = false,
}: DeleteProductProps) {
  const [open, setOpen] = useState(false);

  async function handleConfirmDelete() {
    const result = await deleteProductAction(product.id);

    if (result.ok) {
      showSuccessToast("Producto eliminado correctamente");
      return true;
    }

    handleApiErrors(
      result.errors.length > 0
        ? result.errors
        : ["Error al eliminar el producto."],
    );

    return false;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        aria-label={`Eliminar ${product.name}`}
      >
        <Trash2 className={showLabel ? "h-4 w-4" : "h-5 w-5"} />
        {showLabel ? <span className="text-sm font-medium">Eliminar</span> : null}
      </button>

      <AppAlertModal
        open={open}
        onOpenChange={setOpen}
        size="xl"
        title="Confirmar Eliminacion"
        description="Esta accion eliminara el producto y no se puede deshacer."
        confirmText="Eliminar"
        confirmPendingText="Eliminando..."
        onConfirm={handleConfirmDelete}
      >
        <div className="rounded-xl border border-gray-700/60 bg-white/5 p-4 backdrop-blur-md">
          <div className="space-y-2">
            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-400">Nombre:</span>
              <span className="font-semibold text-white">{product.name}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-400">Categoria:</span>
              <span className="font-semibold text-white">{product.category.name}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-gray-400">Precio:</span>
              <span className="font-bold text-orange-400">${product.price}</span>
            </div>
          </div>
        </div>
      </AppAlertModal>
    </>
  );
}
