import SearchHeading from "@/components/ui/SearchHeading";
import LogCard from "@/features/reports/presentation/components/logs/LogCard";
import { logsRepository } from "@/features/reports/data/repositories/logs.repository";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";

export default async function SearchLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; date?: string }>;
}) {
  const params = await searchParams;
  const area = params.area || "";
  const date = params.date || "";

  const response = await logsRepository.getLogs(1, 1000, { area, date });
  if (!response.ok) {
    throw new Error(response.errors[0] ?? "Error al obtener la bitacora.");
  }

  const logs = response.data.data;

  return (
    <div className="flex-1 pb-10">
      <SearchHeading
        labels={{ area: "Sector", date: "Fecha" }}
        values={{ area, date }}
      />

      {/* Log Table Card */}
      <GradientCard
        gradientId="search-logs-table"
        contentClassName="rounded-2xl overflow-hidden"
        contentStyle={{ maxHeight: "900px" }}
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
        <div className="overflow-y-auto" style={{ maxHeight: "900px" }}>
          {logs.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
        </div>
      </GradientCard>
    </div>
  );
}
