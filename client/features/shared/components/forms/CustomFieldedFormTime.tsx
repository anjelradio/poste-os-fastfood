import { cn } from "@/lib/utils";

type CustomFieldedFormTimeProps = {
  name: string;
  label: string;
  defaultValue?: string;
  className?: string;
};

export default function CustomFieldedFormTime({
  name,
  label,
  defaultValue,
  className,
}: CustomFieldedFormTimeProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        id={name}
        type="time"
        name={name}
        defaultValue={defaultValue}
        className={cn(
          "w-full rounded-xl border border-gray-600/50 bg-gray-800/50 px-4 py-3 text-gray-300 transition-colors duration-200 focus:border-orange-500/50 focus:outline-none",
          className,
        )}
      />
    </div>
  );
}
