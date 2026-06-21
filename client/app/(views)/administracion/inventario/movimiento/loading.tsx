function SkeletonCard({ className = "" }: { className?: string }) {
  return <div className={`rounded-2xl bg-white/10 animate-pulse ${className}`} />;
}

export default function MovimientoLoading() {
  return (
    <div className="flex-1 pb-10 space-y-6">
      {/* Skeleton para el Heading de retorno */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonCard className="h-10 w-72" />
        </div>
      </div>

      {/* Skeleton para la tabla del listado de movimientos */}
      <div className="rounded-2xl bg-white/5 border border-gray-600/20 p-6 space-y-4">
        {/* Cabecera simulada (8 columnas al igual que la bitácora) */}
        <div className="grid grid-cols-8 gap-4 border-b border-gray-600/20 pb-4">
          <SkeletonCard className="h-4 w-24 col-span-2" />
          <SkeletonCard className="h-4 w-28 col-span-2" />
          <SkeletonCard className="h-4 w-20 col-span-1" />
          <SkeletonCard className="h-4 w-16 col-span-1" />
          <SkeletonCard className="h-4 w-40 col-span-2" />
        </div>

        {/* Filas animadas */}
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="grid grid-cols-8 gap-4 py-2 border-b border-gray-600/10 last:border-0 items-center">
              <SkeletonCard className="h-4 w-20 col-span-2" />
              <SkeletonCard className="h-4 w-28 col-span-2" />
              <SkeletonCard className="h-5 w-24 rounded-full col-span-1" />
              <SkeletonCard className="h-4 w-12 col-span-1" />
              <SkeletonCard className="h-4 w-full col-span-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
