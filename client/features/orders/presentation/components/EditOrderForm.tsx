"use client";

import { cloneElement, isValidElement, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { submitWithSchema } from "@/features/shared/data/infrastructure/forms/submit-with-schema";
import { showSuccessToast } from "@/features/shared/components/toast/ToastNotifications";
import { showErrorToast } from "@/features/shared/components/toast/ToastNotifications";
import CancelFormButton from "@/features/shared/components/submit/CancelFormButton";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import { useAppStore } from "@/lib/store/appStore";
import { RegisterOrderRequestSchema } from "../../data/schemas/order.schema";
import { updateOrderAction } from "../actions/order-actions";
import type { ReactNode } from "react";
import OrderItemsList from "./OrderItemsList";

export default function EditOrderForm({ order, children }: { order: any; children: ReactNode }) {
  const router = useRouter();
  const {
    orderItems,
    orderType,
    hydrateOrder,
    removeOrderItem,
    increaseOrderItemQuantity,
    decreaseOrderItemQuantity,
    clearOrder,
  } = useAppStore();

  useEffect(() => {
    hydrateOrder(order);
    return () => clearOrder();
  }, [order, hydrateOrder, clearOrder]);

  const initialValues = useMemo(
    () => ({
      clientName: order.clientName,
      reservedAt: order.reservedAt ? order.reservedAt.slice(11, 16) : "",
      clientPhone: order.clientPhone ?? "",
      address: order.address ?? "",
      referenceNote: order.referenceNote ?? "",
    }),
    [order],
  );

  const handleSubmit = async (formData: FormData) => {
    if (orderItems.length === 0) {
      showErrorToast("La orden debe tener al menos un producto");
      return;
    }

    await submitWithSchema({
      schema: RegisterOrderRequestSchema,
      payload: {
        clientName: formData.get("clientName"),
        reservedAt: formData.get("reservedAt"),
        clientPhone: formData.get("clientPhone"),
        address: formData.get("address"),
        referenceNote: formData.get("referenceNote"),
        orderType,
        order: orderItems.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      },
      action: async (data) => updateOrderAction(order.id, data),
      onSuccess: () => {
        showSuccessToast("Orden actualizada correctamente");
        clearOrder();
        router.push("/caja/ordenes");
        router.refresh();
      },
    });
  };

  return (
    <GradientFormCard gradientId="edit-order-form" title="Editar Orden">
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        <form action={handleSubmit} className="space-y-4">
          <OrderItemsList
            items={orderItems}
            onRemove={removeOrderItem}
            onIncrease={increaseOrderItemQuantity}
            onDecrease={decreaseOrderItemQuantity}
          />

          {isValidElement(children)
            ? cloneElement(children as React.ReactElement<any>, {
                values: initialValues,
              })
            : children}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <CancelFormButton
              onClick={() => {
                clearOrder();
                router.push("/caja/ordenes");
              }}
            >
              Cancelar
            </CancelFormButton>
            <FormSubmitButton pendingText="Guardando...">Guardar cambios</FormSubmitButton>
          </div>
        </form>
      </div>
    </GradientFormCard>
  );
}
