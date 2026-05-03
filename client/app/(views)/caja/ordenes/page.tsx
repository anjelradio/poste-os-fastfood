
import OrderFiltersForm from "@/features/orders/presentation/components/OrderFiltersForm";
import OrdersHistoryGrid from "@/features/orders/presentation/components/OrdersHistoryGrid";
import Heading from "@/features/shared/components/ui/Heading";
import { getOrdersAction } from "@/features/orders/presentation/actions/orders-list-actions";

export default async function OrdersPage() {
  const today = new Date().toLocaleDateString("en-CA");

  const response = await getOrdersAction({ date: today });
  if (!response.ok) {
    throw new Error(response.errors[0] ?? "Error al obtener las órdenes.");
  }

  const orders = response.data;
  return (
    <div className="flex-1 pb-10">
      <div className="mb-6">
        <Heading>Historial de Órdenes</Heading>
      </div>
      <OrderFiltersForm urlSearch="/caja/ordenes" />
      <OrdersHistoryGrid orders={orders} />
    </div>
  );
}
