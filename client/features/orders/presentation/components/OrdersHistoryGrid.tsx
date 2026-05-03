import { OrderList } from "../../domain/entities/order-list-item";
import OrderCard from "./OrderCard";

type OrdersHistoryGridProps = {
  orders: OrderList;
};

export default async function OrdersHistoryGrid({
  orders,
}: OrdersHistoryGridProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {orders.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-gray-400 text-lg">No se encontraron órdenes</p>
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </>
  );
}
