"use client";

import { Minus, Plus, Trash2 } from "lucide-react";

type OrderListItem = {
  id: number;
  name: string;
  price: string;
  quantity: number;
};

type OrderItemsListProps = {
  items: OrderListItem[];
  onRemove: (id: number) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
};

export default function OrderItemsList({
  items,
  onRemove,
  onIncrease,
  onDecrease,
}: OrderItemsListProps) {
  return (
    <div className="mb-6 rounded-xl border border-gray-600/40 bg-gray-800/30 p-4">
      <h3 className="mb-3 text-sm font-semibold text-orange-400">
        Productos de la orden
      </h3>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No hay productos en esta orden.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-700/60 bg-gray-800/40 px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="text-xs text-gray-400">Bs. {(+item.price * item.quantity).toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDecrease(item.id)}
                  disabled={item.quantity <= 1}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-500/70 text-gray-200 transition-colors hover:bg-gray-600/40 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="min-w-6 text-center text-sm font-semibold text-white">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={() => onIncrease(item.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-orange-400/60 text-orange-300 transition-colors hover:bg-orange-500/10"
                >
                  <Plus className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="rounded-lg p-2 text-red-400 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
