export default function Loading() {
  return (
    <div className="flex-1 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-8 w-8 bg-gray-700 rounded animate-pulse" />
        <div className="h-8 w-56 bg-gray-700 rounded animate-pulse" />
      </div>

      <div className="h-12 w-60 bg-gray-700 rounded-xl mb-6 animate-pulse" />

      <div className="h-96 bg-gray-800/50 rounded-2xl animate-pulse" />
    </div>
  );
}
