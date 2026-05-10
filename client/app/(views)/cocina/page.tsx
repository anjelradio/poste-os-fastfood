import OrderCard from "@/features/orders/presentation/components/OrderCard";
import { getOrdersAction } from "@/features/orders/presentation/actions/orders-list-actions";
import Heading from "@/features/shared/components/ui/Heading";

export default async function OrdersPage() {
    const today = new Date().toLocaleDateString("en-CA");
    const response = await getOrdersAction({ date: today, status: "NOT_READY" });
    if (!response.ok) {
        throw new Error(response.errors[0] ?? "Error al obtener las órdenes.");
    }

    const orders = response.data;
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
