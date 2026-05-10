"use client";

import { Send, ShoppingBag, Utensils } from "lucide-react";
import OrderTypeOptionButton from "./OrderTypeOptionButton";
import { useAppStore } from "@/lib/store/appStore";
import { OrderType } from "../../domain/entities/order";

export default function OrderTypeOptions() {
  const { orderType, setOrderType } = useAppStore();
  const selectedOrderType = orderType;
  const onSetOrderType = setOrderType;

  return (
    <div className="mb-3 shrink-0">
      <label className="text-gray-300 text-sm font-medium mb-2 block">
        Tipo de Orden:
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <OrderTypeOptionButton
          label="Para Llevar"
          isSelected={selectedOrderType === OrderType.TAKEAWAY}
          onClick={() => onSetOrderType(OrderType.TAKEAWAY)}
          icon={
            <ShoppingBag
              className={`h-6 w-6 transition-colors duration-300 ${
                selectedOrderType === OrderType.TAKEAWAY ? "text-orange-400" : "text-gray-500"
              }`}
              strokeWidth={2}
            />
          }
        />
        <OrderTypeOptionButton
          label="Para Mesa"
          isSelected={selectedOrderType === OrderType.DINE_IN}
          onClick={() => onSetOrderType(OrderType.DINE_IN)}
          icon={
            <Utensils
              className={`h-6 w-6 transition-colors duration-300 ${
                selectedOrderType === OrderType.DINE_IN ? "text-orange-400" : "text-gray-500"
              }`}
              strokeWidth={2}
            />
          }
        />
        <OrderTypeOptionButton
          label="Para Enviar"
          isSelected={selectedOrderType === OrderType.DELIVERY}
          onClick={() => onSetOrderType(OrderType.DELIVERY)}
          icon={
            <Send
              className={`h-6 w-6 transition-colors duration-300 ${
                selectedOrderType === OrderType.DELIVERY ? "text-orange-400" : "text-gray-500"
              }`}
              strokeWidth={2}
            />
          }
        />
      </div>
    </div>
  );
}
