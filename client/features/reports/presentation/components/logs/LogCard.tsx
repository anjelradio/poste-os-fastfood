import type { Log } from "@/features/reports/domain/entities/log";
import { Edit2, LogIn, LogOut, Plus, X } from "lucide-react";

type LogCardProps = {
  log: Log;
};

const formatDateTime = (date: string, time: string) => {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString("es-AR");
  const timeOnly = time.split(".")[0];
  return `${formattedDate} - ${timeOnly}`;
};

export default function LogCard({ log }: LogCardProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return <Plus className="h-5 w-5 text-green-400" />;
      case "UPDATE":
        return <Edit2 className="h-5 w-5 text-orange-400" />;
      case "DELETE":
        return <X className="h-5 w-5 text-red-400" />;
      case "LOGIN":
        return <LogIn className="h-5 w-5 text-blue-400" />;
      case "LOGOUT":
        return <LogOut className="h-5 w-5 text-pink-400" />;
      default:
        return null;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case "CREATE":
        return "Crear";
      case "UPDATE":
        return "Editar";
      case "DELETE":
        return "Eliminar";
      case "LOGIN":
        return "Inicio Sesion";
      case "LOGOUT":
        return "Finalizo Sesion";
      default:
        return action;
    }
  };

  const getSectorColor = (sector: string) => {
    switch (sector) {
      case "ADMINISTRACION":
      case "ADMINISTRATION":
        return "text-purple-400";
      case "CAJA":
        return "text-blue-400";
      case "COCINA":
        return "text-yellow-400";

      default:
        return "text-gray-400";
    }
  };
  return (
    <div>
      {/* Desktop View */}
      <div
        className="hidden md:grid grid-cols-8 gap-4 px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="text-gray-200 text-sm">
          {formatDateTime(log.createdDate, log.time)}
        </div>
        <div className={`font-semibold text-sm ${getSectorColor(log.area)}`}>
          {log.area}
        </div>
        <div className="text-gray-200 text-sm">{log.user}</div>
        <div className="flex items-center gap-2">
          {getActionIcon(log.action)}
          <span className="text-gray-200 text-sm">
            {getActionText(log.action)}
          </span>
        </div>
        <div className="text-gray-300 text-sm">{log.ipAddress ?? "-"}</div>
        <div className="text-gray-300 text-sm col-span-2">
          {log.description}
        </div>
      </div>

      {/* Mobile View */}
      <div
        className="md:hidden px-6 py-4 border-b border-gray-600/20 hover:bg-orange-500/5 transition-colors duration-200"
        style={{ background: "transparent" }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">
              {formatDateTime(log.createdDate, log.time)}
              </span>
            <span
              className={`text-xs font-semibold ${getSectorColor(log.area)}`}
            >
              {log.area}
            </span>
          </div>
          <div className="text-gray-200 font-semibold">{log.user}</div>
          <div className="text-gray-300 text-xs">IP: {log.ipAddress ?? "-"}</div>
          <div className="flex items-center gap-2">
            {getActionIcon(log.action)}
            <span className="text-gray-200 text-sm font-medium">
              {getActionText(log.action)}
            </span>
          </div>
          <div className="text-gray-300 text-sm">{log.description}</div>
        </div>
      </div>
    </div>
  );
}
