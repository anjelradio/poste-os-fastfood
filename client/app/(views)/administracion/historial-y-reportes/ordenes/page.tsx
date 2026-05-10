import OrderFiltersForm from "@/features/orders/presentation/components/OrderFiltersForm";
import OrdersHistoryGrid from "@/features/orders/presentation/components/OrdersHistoryGrid";
import { getOrdersAction } from "@/features/orders/presentation/actions/orders-list-actions";
import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";

export default async function HistorialOrderPage() {
  const today = new Date().toLocaleDateString("en-CA");
  const response = await getOrdersAction({ date: today });
  if (!response.ok) {
    throw new Error(response.errors[0] ?? "Error al obtener las órdenes.");
  }

  const orders = response.data;
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
