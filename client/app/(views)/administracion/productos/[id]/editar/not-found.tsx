import { ArrowLeft, XOctagon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 rounded-full scale-150" />
                <div className="relative p-6 rounded-full border-2 border-orange-500/30 bg-gray-800/40 backdrop-blur-sm">
                    <XOctagon className="h-20 w-20 text-orange-500" />
                </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">404</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-md">
                ¡Ups! Parece que esta página (o hamburguesa) se ha perdido en el
                camino. No pudimos encontrar lo que buscabas.
            </p>
            <Link
                href={"/administracion/productos"}
                className="px-8 py-3 rounded-xl font-bold text-base text-gray-900 bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 shadow-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.6)] transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
                <ArrowLeft className="h-5 w-5" strokeWidth={3} />
                Ir a Productos
            </Link>
        </div>
    );
}
