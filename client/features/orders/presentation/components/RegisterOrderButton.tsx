"use client";

import { useState } from "react";
import AppDialogModal from "@/features/shared/components/modals/AppDialogModal";
import OrderActionButton from "./OrderActionButton";
import CreateOrderForm from "./CreateOrderForm";
import OrderForm from "./OrderForm";
import InvoiceForm from "./InvoiceForm";
import { useAppStore } from "@/lib/store/appStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaymentType } from "../../domain/entities/order";

export default function RegisterOrderButton() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState<PaymentType | null>(null);
  const { orderItems, clearOrder } = useAppStore();

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setPaymentType(null);
      }, 300);
    }
  };

  return (
    <>
      <OrderActionButton
        variant="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        Registrar orden
      </OrderActionButton>

      <AppDialogModal
        open={open}
        onOpenChange={handleOpenChange}
        title={step === 1 ? "Confirmar orden" : "Datos de facturación"}
        subtitle={step === 1 ? "Completa los datos para registrar la orden" : "Completa los datos para generar la factura"}
        size="full"
      >
        <div className="h-[70vh]">
          <ScrollArea className="h-full pr-2">
            <div className="mb-6 p-4 rounded-xl bg-gray-800/60 border border-gray-700/50">
              <h3 className="text-sm font-semibold text-orange-400 mb-3">
                Resumen de Productos
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-300">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-white font-semibold">
                      Bs.{(+item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <CreateOrderForm 
              onCancel={() => handleOpenChange(false)}
              step={step}
              setStep={setStep}
            >
              <div style={{ display: step === 1 ? 'block' : 'none' }}>
                <OrderForm />
              </div>
              <div style={{ display: step === 2 ? 'block' : 'none' }}>
                <InvoiceForm 
                  paymentType={paymentType} 
                  setPaymentType={setPaymentType} 
                />
              </div>
            </CreateOrderForm>
          </ScrollArea>
        </div>
      </AppDialogModal>
    </>
  );
}
