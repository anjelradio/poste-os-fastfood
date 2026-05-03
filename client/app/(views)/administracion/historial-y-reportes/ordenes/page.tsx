import OrderFiltersForm from "@/features/orders/presentation/components/OrderFiltersForm";
import OrdersHistoryGrid from "@/features/orders/presentation/components/OrdersHistoryGrid";
import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import { getOrders } from "@/lib/api/orders";

export default async function HistorialOrderPage() {
  const today = new Date().toLocaleDateString("en-CA");

  const orders = await getOrders({ date: today });
  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Historial y Reportes"
        child="Historial de Órdenes"
        backHref="/administracion/historial-y-reportes"
      />
      <OrderFiltersForm urlSearch="/administracion/historial-y-reportes/ordenes" />
      <OrdersHistoryGrid orders={orders} />
    </div>
  );
}
