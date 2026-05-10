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
import { createPurchaseAction } from "../../actions/purchase-actions";

export default function CreatePurchaseForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { purchaseItems, clearPurchaseItems } = useAppStore();

  useEffect(() => {
    clearPurchaseItems();
    return () => clearPurchaseItems();
  }, [clearPurchaseItems]);

  const handleSave = async (formData: FormData) => {
    const supplierId = Number(formData.get("supplierId") || 0);
    const description = String(formData.get("description") || "");

    const response = await createPurchaseAction({
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

    showSuccessToast("Compra registrada correctamente");
    clearPurchaseItems();
    router.push("/administracion/compras-y-proveedores/compras");
    router.refresh();
  };

  return (
    <GradientFormCard gradientId="purchase-create-form" title="Registrar compra">
      <form action={handleSave} className="space-y-6">
        {children}
        <FormSubmitButton pendingText="Guardando...">GUARDAR CAMBIOS</FormSubmitButton>
      </form>
    </GradientFormCard>
  );
}
