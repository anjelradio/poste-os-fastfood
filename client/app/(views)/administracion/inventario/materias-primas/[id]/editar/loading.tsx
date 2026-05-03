export default function Loading() {
  return (
    <div className="flex-1 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-8 w-8 bg-gray-700 rounded animate-pulse" />
        <div className="h-8 w-72 bg-gray-700 rounded animate-pulse" />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="h-[580px] bg-gray-800/50 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}
