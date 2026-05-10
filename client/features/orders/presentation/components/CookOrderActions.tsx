"use client";

import { CheckCircle, ChefHat, Clock, XCircle } from "lucide-react";
import { useTransition } from "react";
import { updateOrderStatus } from "@/actions/orders/update-order-status";

export default function CookOrderActions({ orderId, status }: any) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      await updateOrderStatus(orderId);
    });
  };

  if (status === "READY" || status === "CANCELLED") {
    return (
      <button
        type="button"
        disabled
        className="w-full px-4 py-2 rounded-xl border-2 border-gray-500/30 text-gray-500 font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === "READY" ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        {status === "READY" ? "Completado" : "Cancelado"}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        disabled={isPending}
        className={`w-full px-4 py-2 rounded-xl border-2 border-green-500/50 text-green-400 font-semibold text-sm hover:bg-green-500/10 hover:border-green-400/70 transition-all duration-200 flex items-center justify-center gap-2 ${
          isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {status === "PENDING" ? (
          <ChefHat className="h-4 w-4" />
        ) : (
          <Clock className="h-4 w-4" />
        )}
        {isPending ? "Actualizando..." : status === "PENDING" ? "Comenzar" : "Marcar Listo"}
      </button>
    </form>
  );
}
