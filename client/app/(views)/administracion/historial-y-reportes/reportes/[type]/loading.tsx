export default function Loading() {
  return (
    <div className="flex-1 pb-10">
      <div className="h-8 w-72 bg-gray-700 rounded animate-pulse mb-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-2 px-1 mb-6">
        <div className="h-11 rounded-xl bg-gray-700/60 animate-pulse" />
        <div className="h-11 rounded-xl bg-gray-700/60 animate-pulse" />
        <div className="h-11 rounded-xl bg-gray-700/60 animate-pulse" />
      </div>

      <div className="rounded-2xl bg-gray-800/50 p-6 animate-pulse">
        <div className="h-7 w-64 bg-gray-700 rounded mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="h-20 rounded-xl bg-gray-700/60" />
          <div className="h-20 rounded-xl bg-gray-700/60" />
        </div>

        <div className="h-20 rounded-xl bg-gray-700/60 mb-4" />
        <div className="h-12 rounded-xl bg-gray-700/60 mb-6" />
        <div className="h-12 rounded-xl bg-gray-700/70" />
      </div>
    </div>
  );
}
