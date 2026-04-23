import OrderCard from "@/features/orders/presentation/components/OrderCard";
import Heading from "@/features/shared/components/ui/Heading";
import { getOrders } from "@/lib/api/orders";

export default async function OrdersPage() {
    const today = new Date().toLocaleDateString("en-CA");
    const orders = await getOrders({ date: today, status: "NOT_READY" });
    return (
        <>
            <div className="mb-6">
                <Heading> Órdenes de Hoy</Heading>
                <p className="text-gray-300 text-lg capitalize">Fecha</p>
            </div>
            {/* Orders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {orders.length === 0 ? (
                    <div className="col-span-full py-12 text-center">
                        <p className="text-gray-400 text-lg">
                            No se encontraron órdenes
                        </p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))
                )}
            </div>
        </>
    );
}
