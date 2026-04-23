export default function Loading() {
  return (
    <div className="flex-1 pb-10">
      <div className="h-6 w-64 bg-gray-700 rounded animate-pulse mb-6" />

      <div className="h-40 bg-gray-800/50 rounded-2xl mb-6 animate-pulse" />

      <div className="relative group">
        <div className="absolute inset-0 rounded-2xl bg-gray-800/50 animate-pulse" />
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ maxHeight: "500px" }}
        >
          <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-600/30">
            <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-28 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-700 rounded animate-pulse col-span-2" />
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-600/20"
              >
                <div className="h-4 w-32 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-4 w-40 bg-gray-700/50 rounded animate-pulse col-span-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
