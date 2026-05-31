import ActionLinkButton from "@/features/shared/components/ui/ActionLinkButton";
import type { Client } from "@/features/reports/domain/entities/client";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function ClientListCard({ client }: { client: Client }) {
  const formattedDate = new Date(client.createdDate).toLocaleDateString("es-BO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <>
      <div
        className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="text-gray-200">{client.name}</div>
        <div className="text-gray-200">{client.nit || "-"}</div>
        <div className="text-gray-200">{formattedDate}</div>
        <div className="flex items-center gap-3">
          <Link
            href={`/administracion/historial-y-reportes/clientes/${client.id}`}
            className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
          >
            <Eye className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div
        className="md:hidden px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="space-y-2">
          <div className="text-gray-200 font-semibold text-lg">{client.name}</div>
          <div className="text-gray-400 text-sm">NIT: {client.nit || "-"}</div>
          <div className="text-gray-400 text-sm">Registro: {formattedDate}</div>
          <div className="pt-1">
            <ActionLinkButton
              pageUrl={`/administracion/historial-y-reportes/clientes/${client.id}`}
              className="w-full"
            >
              VER HISTORIAL DE ORDENES
            </ActionLinkButton>
          </div>
        </div>
      </div>
    </>
  );
}
