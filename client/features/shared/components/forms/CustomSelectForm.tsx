import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type CustomSelectFormProps = {
  name: string;
  label: string;
  defaultValue?: string | number;
  className?: string;
  children: ReactNode;
};

const selectArrowStyle: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.75rem center",
  backgroundSize: "1.5em 1.5em",
};

export default function CustomSelectForm({
  name,
  label,
  defaultValue,
  className,
  children,
}: CustomSelectFormProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-gray-300 text-sm font-medium mb-2">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-white focus:outline-none focus:border-orange-500/50 transition-colors duration-200 appearance-none cursor-pointer",
          className,
        )}
        style={selectArrowStyle}
      >
        {children}
      </select>
    </div>
  );
}
