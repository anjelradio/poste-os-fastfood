export default function Loading() {
  return (
    <div className="flex-1 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-8 w-8 rounded bg-gray-700 animate-pulse" />
        <div className="h-6 w-60 rounded bg-gray-700 animate-pulse" />
      </div>

      <div className="relative group">
        <div className="absolute inset-0 rounded-2xl bg-gray-800/50 animate-pulse" />

        <div className="relative rounded-2xl overflow-hidden" style={{ maxHeight: "900px" }}>
          <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-600/30">
            <div className="h-4 w-24 rounded bg-gray-700 animate-pulse" />
            <div className="h-4 w-24 rounded bg-gray-700 animate-pulse" />
            <div className="h-4 w-24 rounded bg-gray-700 animate-pulse" />
            <div className="h-4 w-24 rounded bg-gray-700 animate-pulse" />
            <div className="h-4 w-20 rounded bg-gray-700 animate-pulse" />
            <div className="h-4 w-20 rounded bg-gray-700 animate-pulse" />
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "900px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="hidden md:grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-600/20"
              >
                <div className="h-4 w-24 rounded bg-gray-700/50 animate-pulse" />
                <div className="h-4 w-24 rounded bg-gray-700/50 animate-pulse" />
                <div className="h-4 w-24 rounded bg-gray-700/50 animate-pulse" />
                <div className="h-4 w-32 rounded bg-gray-700/50 animate-pulse" />
                <div className="h-4 w-20 rounded bg-gray-700/50 animate-pulse" />
                <div className="h-4 w-16 rounded bg-gray-700/50 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
