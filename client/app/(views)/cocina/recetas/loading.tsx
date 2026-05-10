export default function Loading() {
  return (
    <div className="flex-1 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-8 w-8 bg-gray-700 rounded animate-pulse" />
        <div className="h-6 w-60 bg-gray-700 rounded animate-pulse" />
      </div>

      <div className="relative group mb-6">
        <div className="absolute inset-0 rounded-2xl bg-gray-800/50 animate-pulse" />
        <div className="relative p-6 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="h-12 bg-gray-700/50 rounded-xl animate-pulse" />
            <div className="h-12 bg-gray-700/50 rounded-xl animate-pulse" />
            <div className="h-12 bg-gray-700/50 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 rounded-2xl bg-gray-800/50 animate-pulse" />

        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ maxHeight: "400px" }}
        >
          <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-600/30">
            <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-600/20"
              >
                <div className="h-4 w-40 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-700/50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
