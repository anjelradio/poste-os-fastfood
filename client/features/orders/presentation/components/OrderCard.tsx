"use client";
import {
    CheckCircle,
    ChefHat,
    Clock,
    ShoppingBag,
    Utensils,
} from "lucide-react";
import { OrderListItem } from "@/lib/schemas/order.schema";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/actions/orders/update-order-status";
import { useAppStore } from "@/lib/store/appStore";

interface OrderCardProps {
    order: OrderListItem;
}

function formatDateTime(isoString: string | null) {
    if (!isoString) return null;
    const date = new Date(isoString);
    return date.toLocaleString("es-BO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function OrderCard({ order }: OrderCardProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { user } = useAppStore();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(async () => {
            await updateOrderStatus(order.id);
        });
    };

    const getActionButton = () => {
        if (order.status === "READY") {
            return (
                <button
                    type="button"
                    disabled
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-500/30 text-gray-500 font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <CheckCircle className="h-4 w-4" />
                    Completado
                </button>
            );
        }

        return (
            <button
                type="submit"
                disabled={isPending}
                className={`w-full px-4 py-2 rounded-xl border-2 border-green-500/50 text-green-400 font-semibold text-sm hover:bg-green-500/10 hover:border-green-400/70 transition-all duration-200 flex items-center justify-center gap-2 ${
                    isPending
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                }`}
            >
                <ChefHat className="h-4 w-4" />
                {isPending
                    ? "Actualizando..."
                    : order.status === "PENDING"
                      ? "Comenzar"
                      : "Marcar Listo"}
            </button>
        );
    };
    return (
        <div className="relative group">
            {/* Glow effect - only on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-yellow-400 via-orange-500 to-orange-600 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20" />

            {/* Card container */}
            <div className="relative h-full">
                {/* SVG Border */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    style={{ pointerEvents: "none" }}
                >
                    <defs>
                        <linearGradient
                            id={`borderGradient${order.id}`}
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                style={{ stopColor: "#fbbf24", stopOpacity: 1 }}
                            />
                            <stop
                                offset="50%"
                                style={{ stopColor: "#f97316", stopOpacity: 1 }}
                            />
                            <stop
                                offset="100%"
                                style={{ stopColor: "#ea580c", stopOpacity: 1 }}
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
                        stroke={`url(#borderGradient${order.id})`}
                        strokeWidth="2"
                    />
                </svg>

                {/* Content */}
                <div
                    className="relative h-full rounded-2xl p-5 flex flex-col"
                    style={{ background: "transparent" }}
                >
                    {/* Order Number and Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white text-xl font-bold">
                            #{order.nro}
                        </h3>
                        <div
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${
                                order.status === "READY"
                                    ? "bg-green-500/20 border border-green-500/40"
                                    : "bg-orange-500/20 border border-orange-500/40"
                            }`}
                        >
                            {order.status === "READY" ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                                <Clock className="h-4 w-4 text-orange-400" />
                            )}
                            <span
                                className={`text-xs font-semibold ${
                                    order.status === "READY"
                                        ? "text-green-400"
                                        : "text-orange-400"
                                }`}
                            >
                                {order.status === "READY"
                                    ? "Entregado"
                                    : order.status === "PREPARING"
                                      ? "Preparando"
                                      : "Pendiente"}
                            </span>
                        </div>
                    </div>

                    {/* Customer Name */}
                    <div className="mb-3">
                        <p className="text-gray-400 text-xs font-semibold mb-1">
                            Cliente
                        </p>
                        <p className="text-white text-sm font-semibold">
                            {order.client}
                        </p>
                    </div>

                    {/* Order Items */}
                    <div className="mb-3 flex-1">
                        <p className="text-gray-400 text-xs font-semibold mb-1">
                            Contenido
                        </p>
                        <ul className="space-y-1">
                            {order.items.map((item) => (
                                <li
                                    key={item.id}
                                    className="text-gray-300 text-sm flex items-start gap-1.5"
                                >
                                    <span className="text-orange-400 mt-1">
                                        •
                                    </span>
                                    <span>
                                        {item.name} x{item.quantity}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Total Price */}
                    <div className="mb-3">
                        <p className="text-gray-400 text-xs font-semibold mb-1">
                            Total
                        </p>
                        <p className="text-white text-lg font-bold">
                            Bs. {order.total}
                        </p>
                    </div>

                    {/* Order Type */}
                    <div className="mb-3">
                        <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${
                                order.type === "LLEVAR"
                                    ? "bg-blue-500/20 border border-blue-500/40"
                                    : "bg-purple-500/20 border border-purple-500/40"
                            }`}
                        >
                            {order.type === "LLEVAR" ? (
                                <ShoppingBag
                                    className={`h-4 w-4 ${
                                        order.type === "LLEVAR"
                                            ? "text-blue-400"
                                            : "text-purple-400"
                                    }`}
                                />
                            ) : (
                                <Utensils
                                    className={`h-4 w-4 ${
                                        order.type === "LLEVAR"
                                            ? "text-blue-400"
                                            : "text-purple-400"
                                    }`}
                                />
                            )}
                            <span
                                className={`text-xs font-semibold ${
                                    order.type === "LLEVAR"
                                        ? "text-blue-400"
                                        : "text-purple-400"
                                }`}
                            >
                                {order.type === "LLEVAR"
                                    ? "Para llevar"
                                    : "Para mesa"}
                            </span>
                        </div>
                    </div>

                    {/* orderReadyAt */}
                    <div className="pt-3 mb-3 border-t border-gray-600/30 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                                {order.status === "READY"
                                    ? "Entregado"
                                    : "Hora de entrega"}
                            </span>
                            {order.orderReadyAt ? (
                                <p className="text-green-400 text-xs font-bold">
                                    {formatDateTime(order.orderReadyAt)}
                                </p>
                            ) : (
                                <p className="text-orange-400 text-xs font-bold italic">
                                    Por entregar
                                </p>
                            )}
                        </div>
                    </div>

                    {user?.role === "COCINA"  && (
                        <form onSubmit={handleSubmit}>{getActionButton()}</form>
                    )}
                </div>
            </div>
        </div>
    );
}
