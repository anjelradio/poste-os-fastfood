
import OrderFiltersForm from "@/features/orders/presentation/components/OrderFiltersForm";
import OrdersHistoryGrid from "@/features/orders/presentation/components/OrdersHistoryGrid";
import Heading from "@/features/shared/components/ui/Heading";
import { getOrders } from "@/lib/api/orders";

export default async function OrdersPage() {
  const today = new Date().toLocaleDateString("en-CA");

  const orders = await getOrders({ date: today });
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
