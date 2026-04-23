import SearchHeading from "@/components/ui/SearchHeading";
import OrdersHistoryGrid from "@/features/orders/presentation/components/OrdersHistoryGrid";
import { getOrders } from "@/lib/api/orders";

export default async function OrdersResultPage({
  searchParams,
}: {
  searchParams: Promise<{ date: string; status: string; type: string }>;
}) {
  const params = await searchParams;
  const { date, status, type } = params;

  const orders = await getOrders({ date, status, type });
  return (
    <div className="flex-1 pb-10">
      <SearchHeading />
      <OrdersHistoryGrid orders={orders} />
    </div>
  );
}
