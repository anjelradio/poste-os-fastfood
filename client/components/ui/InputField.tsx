type InputFieldProps = {
  label: string;
  value: string | undefined;
  name: string;
};

export const InputField = ({ label, value, name }: InputFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="text"
        name={name}
        defaultValue={value ? value : ""}
        className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-white focus:outline-none focus:border-orange-500/50 transition"
      />
    </div>
  );
};
