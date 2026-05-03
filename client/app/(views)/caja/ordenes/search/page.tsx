import SearchHeading from "@/components/ui/SearchHeading";
import OrdersHistoryGrid from "@/features/orders/presentation/components/OrdersHistoryGrid";
import { getOrdersAction } from "@/features/orders/presentation/actions/orders-list-actions";

export default async function ResultOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ date: string; status: string; type: string; user_id?: string }>;
}) {
  const params = await searchParams;
  const { date, status, type, user_id } = params;

  const response = await getOrdersAction({
    date,
    status,
    type,
    userId: user_id ? Number(user_id) : undefined,
  });
  if (!response.ok) {
    throw new Error(response.errors[0] ?? "Error al obtener las órdenes.");
  }

  const orders = response.data;
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
