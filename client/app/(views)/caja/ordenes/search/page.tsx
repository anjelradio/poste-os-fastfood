import SearchHeading from "@/components/ui/SearchHeading";
import OrdersHistoryGrid from "@/features/orders/presentation/components/OrdersHistoryGrid";
import { getOrders } from "@/lib/api/orders";

export default async function ResultOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ date: string; status: string; type: string }>;
}) {
  const params = await searchParams;
  const { date, status, type } = params;

  const orders = await getOrders({ date, status, type });
  return (
    <div className="flex-1 pb-10">
      <div className="mb-6">
        <SearchHeading 
          labels={{ date: "Fecha", status: "Estado", type: "Tipo" }}
          values={{ date, status, type }}
        />
      </div>
      <OrdersHistoryGrid orders={orders} />
    </div>
  );
}
