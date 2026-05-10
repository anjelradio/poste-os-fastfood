import SearchHeading from "@/components/ui/SearchHeading";
import OrdersHistoryGrid from "@/features/orders/presentation/components/OrdersHistoryGrid";
import { getOrdersAction } from "@/features/orders/presentation/actions/orders-list-actions";

export default async function OrdersResultPage({
  searchParams,
}: {
  searchParams: Promise<{ date: string; status: string; type: string }>;
}) {
  const params = await searchParams;
  const { date, status, type } = params;

  const response = await getOrdersAction({ date, status, type });
  if (!response.ok) {
    throw new Error(response.errors[0] ?? "Error al obtener las órdenes.");
  }

  const orders = response.data;
  return (
    <div className="flex-1 pb-10">
      <SearchHeading
        labels={{ date: "Fecha", status: "Estado", type: "Tipo" }}
        values={{ date, status, type }}
      />
      <OrdersHistoryGrid orders={orders} />
    </div>
  );
}
