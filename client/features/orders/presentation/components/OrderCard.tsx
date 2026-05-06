"use client";
import {
  CheckCircle,
  Clock,
  XCircle,
  Send,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { OrderListItem } from "../../domain/entities/order-list-item";
import { useAppStore } from "@/lib/store/appStore";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import AdminCashierOrderActions from "./AdminCashierOrderActions";
import CookOrderActions from "./CookOrderActions";

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
  const { user } = useAppStore();

  const getOrderTypeMeta = () => {
    const typeConfig = {
      TAKEAWAY: {
        label: "Para llevar",
        icon: ShoppingBag,
        containerClass: "bg-blue-500/20 border border-blue-500/40",
        textClass: "text-blue-400",
      },
      DINE_IN: {
        label: "Para mesa",
        icon: Utensils,
        containerClass: "bg-purple-500/20 border border-purple-500/40",
        textClass: "text-purple-400",
      },
      DELIVERY: {
        label: "Para enviar",
        icon: Send,
        containerClass: "bg-cyan-500/20 border border-cyan-500/40",
        textClass: "text-cyan-400",
      },
    } as const;

    return (
      typeConfig[order.type as keyof typeof typeConfig] ?? typeConfig.DINE_IN
    );
  };

  const orderTypeMeta = getOrderTypeMeta();
  const OrderTypeIcon = orderTypeMeta.icon;

  const getOrderStatusMeta = () => {
    const statusConfig = {
      PENDING: {
        label: "Pendiente",
        icon: Clock,
        containerClass: "bg-orange-500/20 border border-orange-500/40",
        textClass: "text-orange-400",
      },
      PREPARING: {
        label: "Preparando",
        icon: Clock,
        containerClass: "bg-amber-500/20 border border-amber-500/40",
        textClass: "text-amber-400",
      },
      READY: {
        label: "Entregado",
        icon: CheckCircle,
        containerClass: "bg-green-500/20 border border-green-500/40",
        textClass: "text-green-400",
      },
      CANCELLED: {
        label: "Cancelado",
        icon: XCircle,
        containerClass: "bg-red-500/20 border border-red-500/40",
        textClass: "text-red-400",
      },
    } as const;

    return (
      statusConfig[order.status as keyof typeof statusConfig] ??
      statusConfig.PENDING
    );
  };

  const orderStatusMeta = getOrderStatusMeta();
  const OrderStatusIcon = orderStatusMeta.icon;

  return (
    <GradientCard
      gradientId={`order-card-${order.id}`}
      contentClassName="h-full rounded-2xl p-5 flex flex-col"
      contentStyle={{ background: "transparent" }}
    >
      {/* Order Number and Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-xl font-bold">#{order.orderNumber}</h3>
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${orderStatusMeta.containerClass}`}
        >
          <OrderStatusIcon className={`h-4 w-4 ${orderStatusMeta.textClass}`} />
          <span
            className={`text-xs font-semibold ${orderStatusMeta.textClass}`}
          >
            {orderStatusMeta.label}
          </span>
        </div>
      </div>

      {/* Customer Name */}
      <div className="mb-3">
        <p className="text-gray-400 text-xs font-semibold mb-1">Cliente</p>
        <p className="text-white text-sm font-semibold">{order.clientName}</p>
      </div>

      {/* Order Items */}
      <div className="mb-3 flex-1">
        <p className="text-gray-400 text-xs font-semibold mb-1">Contenido</p>
        <ul className="space-y-1">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="text-gray-300 text-sm flex items-start gap-1.5"
            >
              <span className="text-orange-400 mt-1">•</span>
              <span>
                {item.name} x{item.quantity}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Total Price */}
      <div className="mb-3">
        <p className="text-gray-400 text-xs font-semibold mb-1">Total</p>
        <p className="text-white text-lg font-bold">Bs. {order.total}</p>
      </div>

      {/* Order Type */}
      <div className="mb-3">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${orderTypeMeta.containerClass}`}
        >
          <OrderTypeIcon className={`h-4 w-4 ${orderTypeMeta.textClass}`} />
          <span className={`text-xs font-semibold ${orderTypeMeta.textClass}`}>
            {orderTypeMeta.label}
          </span>
        </div>
      </div>

      {/* readyAt */}
      <div className="pt-3 mb-3 border-t border-gray-600/30 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">
            {order.status === "READY"
              ? "Entregado"
              : order.status === "CANCELLED"
                ? "Cancelado"
                : "Hora de entrega"}
          </span>
          {order.status === "CANCELLED" ? (
            <p className="text-red-400 text-xs font-bold">Orden cancelada</p>
          ) : order.readyAt ? (
            <p className="text-green-400 text-xs font-bold">
              {formatDateTime(order.readyAt)}
            </p>
          ) : (
            <p className="text-orange-400 text-xs font-bold italic">
              Por entregar
            </p>
          )}
        </div>
      </div>

      {user?.role === "COCINA" && (
        <CookOrderActions orderId={order.id} status={order.status} />
      )}

      {(user?.role === "CAJA" || user?.role === "ADMIN") && (
        <AdminCashierOrderActions order={order} />
      )}
    </GradientCard>
  );
}
