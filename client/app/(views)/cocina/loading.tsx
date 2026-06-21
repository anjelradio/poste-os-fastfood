function SkeletonCard({ className = "" }: { className?: string }) {
  return <div className={`rounded-2xl bg-white/10 animate-pulse ${className}`} />;
}

export default function CocinaLoading() {
  return (
    <div className="flex-1 pb-10">
      <div className="mb-6 space-y-2">
        {/* Skeleton para el Heading y Fecha */}
        <SkeletonCard className="h-10 w-48" />
        <SkeletonCard className="h-6 w-32" />
      </div>
      
      {/* Grid de órdenes cocina */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <SkeletonCard className="h-[280px]" />
        <SkeletonCard className="h-[280px]" />
        <SkeletonCard className="h-[280px]" />
        <SkeletonCard className="h-[280px]" />
        <SkeletonCard className="h-[280px]" />
        <SkeletonCard className="h-[280px]" />
        <SkeletonCard className="h-[280px]" />
        <SkeletonCard className="h-[280px]" />
      </div>
    </div>
  );
}
