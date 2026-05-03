"use client";

import { useState } from "react";
import AppDialogModal from "@/features/shared/components/modals/AppDialogModal";
import OrderActionButton from "./OrderActionButton";
import CreateOrderForm from "./CreateOrderForm";
import OrderForm from "./OrderForm";
import { useAppStore } from "@/lib/store/appStore";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RegisterOrderButton() {
  const [open, setOpen] = useState(false);
  const { orderItems, clearOrder } = useAppStore();

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
        onOpenChange={setOpen}
        title="Confirmar orden"
        subtitle="Completa los datos para registrar la orden"
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
            <CreateOrderForm onCancel={() => setOpen(false)}>
              <OrderForm />
            </CreateOrderForm>
          </ScrollArea>
        </div>
      </AppDialogModal>
    </>
  );
}
