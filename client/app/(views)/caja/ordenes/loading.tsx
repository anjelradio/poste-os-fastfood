
export default function Loading() {
  return (
    <div className="flex-1 pb-10">
      <div className="h-8 w-64 bg-gray-700 rounded animate-pulse mb-6" />

      <div className="relative group mb-6">
        <div className="absolute inset-0 rounded-2xl bg-gray-800/50 animate-pulse" />
        <div className="relative rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1">
              <div className="h-4 w-16 bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-12 w-full bg-gray-700/50 rounded-xl animate-pulse" />
            </div>
            <div className="md:col-span-1">
              <div className="h-4 w-16 bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-12 w-full bg-gray-700/50 rounded-xl animate-pulse" />
            </div>
            <div className="md:col-span-1">
              <div className="h-4 w-20 bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-12 w-full bg-gray-700/50 rounded-xl animate-pulse" />
            </div>
            <div className="md:col-span-1">
              <div className="h-12 w-full bg-gray-700/50 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gray-800/30 animate-pulse" />
            <div
              className="relative h-full rounded-2xl p-5 flex flex-col"
              style={{ background: "transparent" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-7 w-16 bg-gray-700 rounded animate-pulse" />
                <div className="h-6 w-20 bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="mb-3">
                <div className="h-3 w-12 bg-gray-700/50 rounded animate-pulse mb-1" />
                <div className="h-4 w-32 bg-gray-700/50 rounded animate-pulse" />
              </div>
              <div className="mb-3 flex-1">
                <div className="h-3 w-16 bg-gray-700/50 rounded animate-pulse mb-2" />
                <div className="space-y-1.5">
                  <div className="h-4 w-40 bg-gray-700/50 rounded animate-pulse" />
                  <div className="h-4 w-28 bg-gray-700/50 rounded animate-pulse" />
                  <div className="h-4 w-36 bg-gray-700/50 rounded animate-pulse" />
                </div>
              </div>
              <div className="mb-3">
                <div className="h-3 w-10 bg-gray-700/50 rounded animate-pulse mb-1" />
                <div className="h-6 w-20 bg-gray-700/50 rounded animate-pulse" />
              </div>
              <div className="mb-3">
                <div className="h-6 w-24 bg-gray-700/50 rounded animate-pulse" />
              </div>
              <div className="pt-3 border-t border-gray-600/30">
                <div className="h-4 w-28 bg-gray-700/50 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
