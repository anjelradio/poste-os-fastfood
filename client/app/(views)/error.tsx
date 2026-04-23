"use client";

import { RefreshCw, ServerCrash } from "lucide-react";

export default function ViewsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 animate-in zoom-in fade-in flex-col items-center justify-center text-center duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 scale-150 rounded-full bg-orange-500 opacity-20 blur-2xl" />
        <div className="relative rounded-full border-2 border-orange-500/30 bg-gray-800/40 p-6 backdrop-blur-sm">
          <ServerCrash className="h-20 w-20 text-orange-500" />
        </div>
      </div>

      <h2 className="mb-2 text-4xl font-bold text-white">Error de conexion</h2>
      <p className="mb-8 max-w-md text-xl text-gray-400">
        No se pudo cargar la vista en este momento. Verifica la conexion o
        intenta nuevamente.
      </p>

      <button
        type="button"
        onClick={() => {
          reset();
          window.location.reload();
        }}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 px-8 py-3 text-base font-bold text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(251,146,60,0.6)]"
      >
        <RefreshCw className="h-5 w-5" strokeWidth={3} />
        Reintentar
      </button>
    </div>
  );
}
