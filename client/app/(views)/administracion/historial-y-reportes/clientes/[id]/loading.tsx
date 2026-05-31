export default function Loading() {
  return (
    <div className="flex-1 pb-10 space-y-6">
      <div className="h-6 w-96 bg-gray-700 rounded animate-pulse" />

      <div className="h-40 bg-gray-800/50 rounded-2xl animate-pulse" />

      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-gray-800/50 animate-pulse" />
        <div className="relative rounded-2xl overflow-hidden" style={{ maxHeight: "500px" }}>
          <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-600/30">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
            ))}
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-600/20">
                <div className="h-4 w-16 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-8 w-28 bg-gray-700/50 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
