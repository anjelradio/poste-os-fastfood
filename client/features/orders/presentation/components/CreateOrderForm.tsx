"use client";

import { submitWithSchema } from "@/features/shared/data/infrastructure/forms/submit-with-schema";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";
import { useAppStore } from "@/lib/store/appStore";
import CancelFormButton from "@/features/shared/components/submit/CancelFormButton";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import { RegisterOrderRequestSchema } from "../../data/schemas/order.schema";
import { createOrderAction } from "../actions/order-actions";
import { type ReactNode } from "react";

export default function CreateOrderForm({
  onCancel,
  children,
}: {
  onCancel: () => void;
  children: ReactNode;
}) {
  const { orderItems, orderType, clearOrder } = useAppStore();

  const handleSubmit = async (formData: FormData) => {
    await submitWithSchema({
      schema: RegisterOrderRequestSchema,
      payload: {
        clientName: formData.get("clientName"),
        reservedAt: formData.get("reservedAt"),
        clientPhone: formData.get("clientPhone"),
        address: formData.get("address"),
        referenceNote: formData.get("referenceNote"),
        orderType,
        order: orderItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      },
      action: createOrderAction,
      onSuccess: () => {
        showSuccessToast("Orden registrada correctamente");
        clearOrder();
        onCancel?.();
      },
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      {children}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <CancelFormButton onClick={onCancel}>Cancelar</CancelFormButton>
        <FormSubmitButton pendingText="Confirmando...">
          Confirmar
        </FormSubmitButton>
      </div>
    </form>
  );
}
