"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import { useAppStore } from "@/lib/store/appStore";
import {
  showErrorToast,
  showSuccessToast,
} from "@/features/shared/components/toast/ToastNotifications";
import { updatePurchaseAction } from "../../actions/purchase-actions";
import type { Purchase } from "@/features/purchases/domain/entities/purchase";

export default function EditPurchaseForm({
  purchase,
  children,
}: {
  purchase: Purchase;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { purchaseItems, hydratePurchaseItems, clearPurchaseItems } = useAppStore();

  useEffect(() => {
    hydratePurchaseItems(
      purchase.items.map((item) => ({
        rawMaterialId: item.rawMaterialId,
        rawMaterialName: item.rawMaterialName,
        measureUnitName: item.measureUnit,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    );

    return () => clearPurchaseItems();
  }, [purchase, hydratePurchaseItems, clearPurchaseItems]);

  const handleSave = async (formData: FormData) => {
    const supplierId = Number(formData.get("supplierId") || 0);
    const description = String(formData.get("description") || "");

    const response = await updatePurchaseAction(purchase.id, {
      supplierId,
      description,
      items: purchaseItems.map((item) => ({
        rawMaterialId: item.rawMaterialId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });

    if (!response.ok) {
      showErrorToast(response.errors[0] ?? "Error al guardar la compra");
      return;
    }

    showSuccessToast("Compra actualizada correctamente");
    clearPurchaseItems();
    router.push("/administracion/compras-y-proveedores/compras");
    router.refresh();
  };

  return (
    <GradientFormCard gradientId="purchase-edit-form" title="Editar compra">
      <form action={handleSave} className="space-y-6">
        {children}
        <FormSubmitButton pendingText="Guardando...">GUARDAR CAMBIOS</FormSubmitButton>
      </form>
    </GradientFormCard>
  );
}
