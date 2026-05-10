"use client";

type CancelFormButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function CancelFormButton({
  children,
  onClick,
}: CancelFormButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border-2 border-red-600/70 bg-red-900/20 px-4 py-3.5 font-semibold text-white transition-all hover:bg-red-800/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
    >
      {children}
    </button>
  );
}
