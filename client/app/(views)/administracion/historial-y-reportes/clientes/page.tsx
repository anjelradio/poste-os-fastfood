import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import { clientsRepository } from "@/features/reports/data/repositories/clients.repository";
import ClientListCard from "@/features/reports/presentation/components/clients/ClientListCard";

export default async function ClientsPage() {
  const response = await clientsRepository.getClients();

  if (!response.ok) {
    throw new Error(response.errors[0] ?? "Error al obtener los clientes.");
  }

  const clients = response.data;

  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Historial y Reportes"
        child="Clientes"
        backHref="/administracion/historial-y-reportes"
      />

      <GradientCard
        gradientId="clients-table"
        contentClassName="rounded-2xl overflow-hidden"
        contentStyle={{ maxHeight: "440px" }}
      >
        <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold">Nombre</div>
          <div className="text-gray-300 font-semibold">NIT</div>
          <div className="text-gray-300 font-semibold">Fecha registro</div>
          <div className="text-gray-300 font-semibold">Acciones</div>
        </div>

        <div className="md:hidden px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold text-lg">Clientes</div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
          {clients.map((client) => (
            <ClientListCard key={client.id} client={client} />
          ))}
        </div>
      </GradientCard>
    </div>
  );
}
