export default function Loading() {
  return (
    <div className="flex-1 pb-10">
      <div className="h-6 w-72 bg-gray-700 rounded animate-pulse mb-6" />

      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-gray-800/50 animate-pulse" />
        <div className="relative rounded-2xl overflow-hidden" style={{ maxHeight: "440px" }}>
          <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-600/30">
            <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-600/20"
              >
                <div className="h-4 w-48 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-4 w-28 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-700/50 rounded animate-pulse" />
                <div className="h-9 w-52 bg-gray-700/50 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
