import Link from "next/link";

const reportTypes = [
  { key: "ganancias", label: "Ganancias" },
  { key: "compras", label: "Compras" },
  { key: "ventas-producto", label: "Ventas por Producto" },
] as const;

type ReportType = (typeof reportTypes)[number]["key"];

export default function ReportsTypeNavbar({ activeType }: { activeType: ReportType }) {
  return (
    <nav className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-2 px-1">
        {reportTypes.map((type) => {
          const isActive = type.key === activeType;
          return (
            <Link
              key={type.key}
              href={`/administracion/historial-y-reportes/reportes/${type.key}`}
              className={
                isActive
                  ? "inline-flex items-center justify-center rounded-xl border-2 border-orange-400/80 bg-orange-500/20 px-4 py-2.5 text-sm font-bold text-orange-300 transition-colors duration-200"
                  : "inline-flex items-center justify-center rounded-xl border-2 border-gray-600/50 bg-gray-800/40 px-4 py-2.5 text-sm font-semibold text-gray-300 transition-all duration-200 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-300"
              }
            >
              {type.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { reportTypes };
export type { ReportType };
