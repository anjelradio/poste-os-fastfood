"use client";

export default function OrderTypeOptionButton({
  icon,
  label,
  isSelected,
  onClick,
}: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative px-4 py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-300"
      style={{
        border: "2px solid transparent",
        background:
          isSelected
            ? "linear-gradient(rgba(42, 46, 53, 0.6), rgba(42, 46, 53, 0.6)) padding-box, linear-gradient(to right, #fbbf24, #f97316, #ea580c) border-box"
            : "linear-gradient(rgba(42, 46, 53, 0.4), rgba(42, 46, 53, 0.4)) padding-box, linear-gradient(to right, #6b7280, #4b5563) border-box",
        boxShadow: isSelected ? "0 0 20px rgba(251, 146, 60, 0.4)" : "none",
      }}
    >
      {isSelected && (
        <div
          className="absolute inset-0 rounded-xl blur-md -z-10"
          style={{
            background: "linear-gradient(to right, #fbbf24, #f97316, #ea580c)",
            opacity: 0.3,
          }}
        />
      )}
      {icon}
      <span
        className={`text-sm font-semibold transition-colors duration-300 ${
          isSelected ? "text-white" : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
