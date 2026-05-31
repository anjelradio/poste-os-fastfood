function SkeletonCard({ className = "" }: { className?: string }) {
  return <div className={`rounded-2xl bg-white/10 animate-pulse ${className}`} />;
}

export default function AdminLoading() {
  return (
    <div className="flex-1 pb-10 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkeletonCard className="h-[120px]" />
        <SkeletonCard className="h-[120px]" />
        <SkeletonCard className="h-[120px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonCard className="h-[340px]" />
        <div className="space-y-4">
          <SkeletonCard className="h-[166px]" />
          <SkeletonCard className="h-[166px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonCard className="h-[166px]" />
        <SkeletonCard className="h-[166px]" />
      </div>
    </div>
  );
}
