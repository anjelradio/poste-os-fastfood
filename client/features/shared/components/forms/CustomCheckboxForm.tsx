import { cn } from "@/lib/utils";

type CustomCheckboxFormProps = {
  name: string;
  label: string;
  defaultChecked?: boolean;
  className?: string;
};

export default function CustomCheckboxForm({
  name,
  label,
  defaultChecked,
  className,
}: CustomCheckboxFormProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-gray-600/50 bg-gray-800/50 px-4 py-3",
        className,
      )}
    >
      <input
        id={name}
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-gray-500 bg-gray-900 text-orange-500 focus:ring-orange-500"
      />
      <label htmlFor={name} className="text-sm font-medium text-gray-300">
        {label}
      </label>
    </div>
  );
}
