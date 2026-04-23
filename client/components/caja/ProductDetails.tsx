import { useAppStore } from "@/lib/store";
import { OrderItem } from "@/lib/types";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

type ProductDetailsProps = {
  item: OrderItem;
};

export default function ProductDetails({ item }: ProductDetailsProps) {
  const { increaseQuantity, decreaseQuantity, removeItem } = useAppStore();
  const disabledDecreaseButton = useMemo(() => item.quantity === 1, [item]);
  return (
    <>
      <div className="flex items-center gap-3 py-3">
        {/* Image placeholder with grayish glow */}
        <div className="relative w-14 h-14 flex-shrink-0">
          {item.image && item.image !== "" ? (
            <Image
              src={item.image}
              alt={`Imagen de ${item.name}`}
              width={200}
              height={200}
              className="mb-2 aspect-square rounded-lg object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 rounded-lg bg-gray-500/20 blur-sm" />
              <div className="relative w-full h-full rounded-lg border border-gray-500/40 bg-gray-800/40 backdrop-blur-sm flex items-center justify-center">
                <span className="text-gray-600 text-[10px]">Sin img</span>
              </div>
            </>
          )}
        </div>

        {/* Product info */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{item.name}</p>
          <p className="text-orange-400 text-xs font-semibold">
            Bs. {(+item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center gap-2">
          {/* Decrease button - grayish with better contrast */}
          <button
            className="w-7 h-7 rounded-full border-2 border-gray-400/70 flex items-center justify-center transition-all hover:border-gray-300 hover:bg-gray-600/40 cursor-pointer disabled:opacity-20"
            onClick={() => decreaseQuantity(item.id)}
            disabled={disabledDecreaseButton}
          >
            <Minus className="h-4 w-4 text-gray-200" strokeWidth={3} />
          </button>

          {/* Quantity */}
          <span className="text-white text-sm font-semibold min-w-[1.5rem] text-center">
            {item.quantity}
          </span>

          {/* Increase button - orange gradient with better contrast */}
          <button
            className="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all hover:shadow-[0_0_15px_rgba(251,146,60,0.6)] cursor-pointer"
            onClick={() => increaseQuantity(item.id)}
            style={{
              borderImage:
                "linear-gradient(to bottom, #fbbf24, #f97316, #ea580c) 1",
              borderRadius: "50%",
              border: "2px solid transparent",
              background:
                "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)) padding-box, linear-gradient(to bottom, #fbbf24, #f97316, #ea580c) border-box",
            }}
          >
            <Plus className="h-4 w-4 text-orange-300" strokeWidth={3} />
          </button>

          {/* Delete button with better contrast */}
          <button className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-red-500/30 cursor-pointer"
          onClick={() => removeItem(item.id)}>
            <Trash2 className="h-4 w-4 text-red-400" strokeWidth={2.5} />
          </button>
        </div>
      </div>
      {/* Divider line between items */}
      {/* {index < orderItems.length - 1 && (
        <div className="border-t border-gray-600/30" />
      )} */}
    </>
  );
}
