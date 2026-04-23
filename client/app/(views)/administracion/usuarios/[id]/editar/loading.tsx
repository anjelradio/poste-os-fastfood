export default function Loading() {
  return (
    <div className="flex-1 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-8 w-8 rounded bg-gray-700 animate-pulse" />
        <div className="h-7 w-56 rounded bg-gray-700 animate-pulse" />
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="h-[520px] rounded-2xl bg-gray-800/50 animate-pulse" />
      </div>
    </div>
  );
}
