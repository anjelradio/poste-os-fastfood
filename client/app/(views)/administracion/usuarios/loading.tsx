export default function Loading() {
  return (
    <div className="flex-1 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-8 w-8 rounded bg-gray-700 animate-pulse" />
        <div className="h-8 w-52 rounded bg-gray-700 animate-pulse" />
      </div>

      <div className="h-12 w-48 rounded-xl bg-gray-700 mb-6 animate-pulse" />

      <div className="h-40 rounded-2xl bg-gray-800/50 mb-6 animate-pulse" />

      <div className="h-96 rounded-2xl bg-gray-800/50 animate-pulse" />
    </div>
  );
}
