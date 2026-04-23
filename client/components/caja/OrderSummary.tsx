"use client";
import { useAppStore } from "@/lib/store";
import ProductDetails from "./ProductDetails";
import { useMemo, useState, useTransition } from "react";
import { OrderSchema } from "@/lib/schemas/order.schema";
import { createOrder } from "@/lib/api/orders";
import { handleApiErrors, handleZodErrors } from "@/lib/api/errors";
import { showSuccessToast } from "../ui/ToastNotifications";
import { ShoppingBag, Utensils } from "lucide-react";

export default function OrderSummary() {
  const { order, clearOrder } = useAppStore();
  const [orderType, setOrderType] = useState("");
  const [isPending, startTransition] = useTransition();
  const total = useMemo(
    () => order.reduce((total, item) => total + item.quantity * +item.price, 0),
    [order],
  );

  const handleCreateOrder = (formdata: FormData) => {
    const type = orderType;
    const data = {
      client: formdata.get("client"),
      total,
      type,
      order,
    };

    const result = OrderSchema.safeParse(data);
    if (!result.success) {
      handleZodErrors(result.error.issues);
      return;
    }

    startTransition(async () => {
      try {
        const response = await createOrder(result.data);

        if (response.ok) {
          showSuccessToast("Orden creada correctamente");
          clearOrder();
          return;
        }

        if (response.errors) {
          handleApiErrors(response.errors);
        }
      } catch {
        handleApiErrors(["Error inesperado al crear la orden"]);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleCreateOrder(formData);
  };

  return (
    <div className="relative h-full min-h-75 lg:min-h-0">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-yellow-400 via-orange-500 to-orange-600 opacity-20 blur-xl" />
      {/* Order Panel with gradient border - using SVG approach */}
      <div className="relative h-full">
        {/* SVG Border */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: "none" }}
        >
          <defs>
            <linearGradient
              id="borderGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{
                  stopColor: "#fbbf24",
                  stopOpacity: 1,
                }}
              />
              <stop
                offset="50%"
                style={{
                  stopColor: "#f97316",
                  stopOpacity: 1,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "#ea580c",
                  stopOpacity: 1,
                }}
              />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="16"
            ry="16"
            fill="none"
            stroke="url(#borderGradient)"
            strokeWidth="2"
          />
        </svg>
        {/* Content - Completely transparent background */}
        <div
          className="relative h-full rounded-2xl p-6 flex flex-col"
          style={{ background: "transparent" }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 text-center">
            Nueva Orden
          </h2>

          {order.length === 0 ? (
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
                {order.map((item) => (
                  <ProductDetails key={item.id} item={item} />
                ))}
              </div>
            </>
          )}

          <form onSubmit={handleSubmit}>
            {/* Customer Name Input */}
            <div className="mb-3 shrink-0">
              <input
                type="text"
                placeholder="Nombre del Cliente"
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-600/50 bg-gray-800/40 backdrop-blur-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-400/60 transition-colors"
                name="client"
              />
            </div>
            {/* Order Type Selection */}
            <div className="mb-3 shrink-0">
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Tipo de Orden:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Para Llevar Button */}
                <button
                  type="button"
                  onClick={() => setOrderType("Llevar")}
                  className="relative px-4 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    border: "2px solid transparent",
                    background:
                      orderType === "Llevar"
                        ? "linear-gradient(rgba(42, 46, 53, 0.6), rgba(42, 46, 53, 0.6)) padding-box, linear-gradient(to right, #fbbf24, #f97316, #ea580c) border-box"
                        : "linear-gradient(rgba(42, 46, 53, 0.4), rgba(42, 46, 53, 0.4)) padding-box, linear-gradient(to right, #6b7280, #4b5563) border-box",
                    boxShadow:
                      orderType === "Llevar"
                        ? "0 0 20px rgba(251, 146, 60, 0.4)"
                        : "none",
                  }}
                >
                  {/* Glow effect for active state */}
                  {orderType === "Llevar" && (
                    <div
                      className="absolute inset-0 rounded-xl blur-md -z-10"
                      style={{
                        background:
                          "linear-gradient(to right, #fbbf24, #f97316, #ea580c)",
                        opacity: 0.3,
                      }}
                    />
                  )}
                  <ShoppingBag
                    className={`h-6 w-6 transition-colors duration-300 ${
                      orderType === "para-llevar"
                        ? "text-orange-400"
                        : "text-gray-500"
                    }`}
                    strokeWidth={2}
                  />
                  <span
                    className={`text-sm font-semibold transition-colors duration-300 ${
                      orderType === "Llevar" ? "text-white" : "text-gray-400"
                    }`}
                  >
                    Para Llevar
                  </span>
                </button>

                {/* Para Mesa Button */}
                <button
                  type="button"
                  onClick={() => setOrderType("Mesa")}
                  className="relative px-4 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    border: "2px solid transparent",
                    background:
                      orderType === "Mesa"
                        ? "linear-gradient(rgba(42, 46, 53, 0.6), rgba(42, 46, 53, 0.6)) padding-box, linear-gradient(to right, #fbbf24, #f97316, #ea580c) border-box"
                        : "linear-gradient(rgba(42, 46, 53, 0.4), rgba(42, 46, 53, 0.4)) padding-box, linear-gradient(to right, #6b7280, #4b5563) border-box",
                    boxShadow:
                      orderType === "Mesa"
                        ? "0 0 20px rgba(251, 146, 60, 0.4)"
                        : "none",
                  }}
                >
                  {/* Glow effect for active state */}
                  {orderType === "Mesa" && (
                    <div
                      className="absolute inset-0 rounded-xl blur-md -z-10"
                      style={{
                        background:
                          "linear-gradient(to right, #fbbf24, #f97316, #ea580c)",
                        opacity: 0.3,
                      }}
                    />
                  )}
                  <Utensils
                    className={`h-6 w-6 transition-colors duration-300 ${
                      orderType === "Mesa" ? "text-orange-400" : "text-gray-500"
                    }`}
                    strokeWidth={2}
                  />
                  <span
                    className={`text-sm font-semibold transition-colors duration-300 ${
                      orderType === "Mesa" ? "text-white" : "text-gray-400"
                    }`}
                  >
                    Para Mesa
                  </span>
                </button>
              </div>
            </div>
            {/* Total */}
            <div className="mb-4 pb-3 border-b border-gray-600/40 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-lg font-medium">Total</span>
                <span className="text-white text-2xl font-bold">
                  Bs. {total}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                className="flex-1 px-4 py-2.5 rounded-xl border-2 text-white font-semibold transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer"
                style={{
                  borderImage: "linear-gradient(to right, #dc2626, #991b1b) 1",
                  borderRadius: "0.75rem",
                  border: "2px solid transparent",
                  background:
                    "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)) padding-box, linear-gradient(to right, #dc2626, #991b1b) border-box",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  clearOrder();
                  setOrderType("");
                  e.currentTarget.form?.reset();
                }}
              >
                Limpiar
              </button>
              <input
                type="submit"
                disabled={isPending}
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-gray-900 bg-linear-to-r from-yellow-400 via-orange-500 to-orange-600 shadow-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.6)] transition-all duration-300 cursor-pointer ${
                  isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
                value={isPending ? "Creando..." : "Confirmar"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
