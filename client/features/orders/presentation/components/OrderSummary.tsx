"use client";
import { useAppStore } from "@/lib/store/appStore";
import { useMemo } from "react";
import ProductDetails from "./ProductDetails";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import OrderActionButton from "./OrderActionButton";
import RegisterOrderButton from "./RegisterOrderButton";

export default function OrderSummary() {
  const { orderItems, clearOrder } = useAppStore();
  const total = useMemo(
    () =>
      orderItems.reduce(
        (total, item) => total + item.quantity * +item.price,
        0,
      ),
    [orderItems],
  );

  return (
    <GradientCard
      gradientId="order-summary"
      minHeight={300}
      className="h-full min-h-75 lg:min-h-0"
      contentClassName="p-6 flex flex-col h-full rounded-2xl"
      contentStyle={{ background: "transparent" }}
    >
      <h2 className="text-xl font-semibold text-white mb-4 text-center">
        Nueva Orden
      </h2>

      {orderItems.length === 0 ? (
        /* Empty state */
        <div className="flex items-center justify-center flex-1 text-gray-500">
          <p className="text-center">
            Selecciona productos
            <br />
            para crear una orden
          </p>
        </div>
      ) : (
        /* Order content */
        <>
          {/* Order Items List - Scrollable with fixed height */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-0 min-h-0">
            {orderItems.map((item) => (
              <ProductDetails key={item.id} item={item} />
            ))}
          </div>
        </>
      )}

      <div className="mb-4 pb-3 border-b border-gray-600/40 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-lg font-medium">Total</span>
          <span className="text-white text-2xl font-bold">Bs. {total}</span>
        </div>
      </div>

      <div className="flex gap-3 shrink-0">
        <OrderActionButton variant="danger" onClick={() => clearOrder()}>
          Limpiar
        </OrderActionButton>
        <RegisterOrderButton />
      </div>
    </GradientCard>
  );
}
