import { redirect } from "next/navigation";
import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import LogCard from "@/features/reports/presentation/components/logs/LogCard";
import LogFiltersForm from "@/features/reports/presentation/components/logs/LogFiltersForm";
import LogsPagination from "@/features/reports/presentation/components/logs/LogsPagination";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import { logsRepository } from "@/features/reports/data/repositories/logs.repository";


export default async function BitacoraPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; area?: string; date?: string }>;
}) {
  const pageQuery = await searchParams;
  const page = +(pageQuery.page ?? "1");
  const pageSize = 8;

  const filters = {
    area: pageQuery.area ?? "",
    date: pageQuery.date ?? "",
  };

  if (page < 1) redirect("/administracion/historial-y-reportes/bitacora");

  const response = await logsRepository.getLogs(page, pageSize, filters);
  if (!response.ok) {
    throw new Error(response.errors[0] ?? "Error al obtener la bitacora.");
  }

  const logs = response.data.data;
  const totalLogs = response.data.totalLogs;

  const totalPages = Math.max(1, Math.ceil(totalLogs / pageSize));

  if (page > totalPages)
    redirect("/administracion/historial-y-reportes/bitacora");
  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Historial y Reportes"
        child="Bitácora del Sistema"
        backHref="/administracion/historial-y-reportes"
      />

      {/* Filters Card */}
      <LogFiltersForm />

      <GradientCard
        gradientId="logs-table"
        contentClassName="rounded-2xl overflow-hidden"
        contentStyle={{ maxHeight: "500px" }}
      >
        {/* Table Header - Sticky - Desktop */}
        <div className="hidden md:grid grid-cols-8 gap-4 px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold">Fecha y Hora</div>
          <div className="text-gray-300 font-semibold">Sector</div>
          <div className="text-gray-300 font-semibold">Usuario</div>
          <div className="text-gray-300 font-semibold">Acción</div>
          <div className="text-gray-300 font-semibold">IP</div>
          <div className="text-gray-300 font-semibold col-span-2">
            Descripción
          </div>
        </div>

        {/* Table Header - Mobile */}
        <div className="md:hidden px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold text-lg">Bitácora</div>
        </div>

        {/* Table Body - Scrollable */}
        <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
          {logs.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
        </div>
      </GradientCard>
      <LogsPagination page={page} totalPages={totalPages} filters={filters} />
    </div>
  );
}
