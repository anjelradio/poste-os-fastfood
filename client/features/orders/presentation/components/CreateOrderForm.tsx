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
  step,
  setStep,
  children,
}: {
  onCancel: () => void;
  step: number;
  setStep: (step: number) => void;
  children: ReactNode;
}) {
  const { orderItems, orderType, clearOrder } = useAppStore();

  const handleNextStep = () => {
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (formData: FormData) => {
    if (step === 1) {
      handleNextStep();
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
        nit: formData.get("nit"),
        paymentType: formData.get("paymentType"),
        email: formData.get("email"),
        orderType,
        order: orderItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      },
      action: createOrderAction,
      onSuccess: ({ data }) => {
        if (data && typeof data === 'string') {
          // Descargar el PDF
          const byteCharacters = atob(data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'factura.pdf';
          link.click();
          URL.revokeObjectURL(url);
        }
        
        showSuccessToast("Orden registrada y factura generada");
        clearOrder();
        onCancel?.();
      },
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      {children}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {step === 1 ? (
          <>
            <CancelFormButton onClick={onCancel}>Cancelar</CancelFormButton>
            <button
              type="button"
              onClick={handleNextStep}
              className="relative w-full h-full overflow-hidden rounded-xl bg-linear-to-r from-yellow-400 via-orange-500 to-orange-600 py-3.5 font-semibold text-white shadow-[0_0_20px_rgba(251,146,60,0.5)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(251,146,60,0.7)] active:scale-[0.98]"
            >
              Siguiente
            </button>
          </>
        ) : (
          <>
            <CancelFormButton onClick={handlePrevStep}>Atrás</CancelFormButton>
            <FormSubmitButton pendingText="Facturando...">
              Confirmar y Facturar
            </FormSubmitButton>
          </>
        )}
      </div>
    </form>
  );
}

