import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import { clientsRepository } from "@/features/reports/data/repositories/clients.repository";
import { getOrdersAction } from "@/features/orders/presentation/actions/orders-list-actions";
import ClientOrderListCard from "@/features/reports/presentation/components/clients/ClientOrderListCard";

export default async function ClientOrdersHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clientId = Number(id);

  if (Number.isNaN(clientId)) {
    throw new Error("Cliente inválido.");
  }

  const [clientResponse, ordersResponse] = await Promise.all([
    clientsRepository.getClientById(clientId),
    getOrdersAction({ clientId }),
  ]);

  if (!clientResponse.ok || !clientResponse.data) {
    throw new Error(clientResponse.errors?.[0] ?? "Error al obtener cliente.");
  }

  if (!ordersResponse.ok) {
    throw new Error(ordersResponse.errors[0] ?? "Error al obtener órdenes del cliente.");
  }

  const client = clientResponse.data;
  const orders = ordersResponse.data;

  const clientCreatedDate = new Date(client.createdDate).toLocaleDateString("es-BO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Clientes"
        child={`Historial de ${client.name}`}
        backHref="/administracion/historial-y-reportes/clientes"
      />

      <GradientCard
        gradientId="client-info"
        contentClassName="rounded-2xl p-6 mb-6"
      >
        <h2 className="text-white text-2xl font-bold mb-4">Información del Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">Nombre</p>
            <p className="text-white text-base font-semibold">{client.name}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">NIT</p>
            <p className="text-white text-base font-semibold">{client.nit || "-"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">Fecha de registro</p>
            <p className="text-white text-base font-semibold">{clientCreatedDate}</p>
          </div>
        </div>
      </GradientCard>

      <GradientCard
        gradientId="client-orders-table"
        contentClassName="rounded-2xl overflow-hidden"
        contentStyle={{ maxHeight: "500px" }}
      >
        <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold">Orden</div>
          <div className="text-gray-300 font-semibold">Fecha</div>
          <div className="text-gray-300 font-semibold">Tipo</div>
          <div className="text-gray-300 font-semibold">Estado</div>
          <div className="text-gray-300 font-semibold">Total</div>
          <div className="text-gray-300 font-semibold">Acciones</div>
        </div>

        <div className="md:hidden px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold text-lg">Órdenes del cliente</div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
          {orders.length === 0 ? (
            <p className="px-6 py-6 text-gray-300 text-sm">Este cliente todavía no tiene órdenes.</p>
          ) : (
            orders.map((order) => <ClientOrderListCard key={order.id} order={order} />)
          )}
        </div>
      </GradientCard>
    </div>
  );
}
