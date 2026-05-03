"use client";

type OrderActionButtonProps = {
  variant: "primary" | "danger";
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function OrderActionButton({
  variant,
  children,
  onClick,
}: OrderActionButtonProps) {
  const baseClass =
    "flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 cursor-pointer";

  if (variant === "danger") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClass} border-2 text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]`}
        style={{
          borderImage: "linear-gradient(to right, #dc2626, #991b1b) 1",
          borderRadius: "0.75rem",
          border: "2px solid transparent",
          background:
            "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)) padding-box, linear-gradient(to right, #dc2626, #991b1b) border-box",
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClass} text-gray-900 bg-linear-to-r from-yellow-400 via-orange-500 to-orange-600 shadow-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.6)]`}
    >
      {children}
    </button>
  );
}
