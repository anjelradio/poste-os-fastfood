import { cn } from "@/lib/utils";

type CustomFieldedFormTextProps = {
  type?: "text" | "number" | "email" | "password";
  name: string;
  label: string;
  defaultValue?: string | number;
  placeholder?: string;
  className?: string;
};

export default function CustomFieldedFormText({
  type = "text",
  name,
  label,
  defaultValue,
  placeholder,
  className,
}: CustomFieldedFormTextProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-gray-300 text-sm font-medium mb-2">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors duration-200",
          className,
        )}
      />
    </div>
  );
}
