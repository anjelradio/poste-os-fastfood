type SectionDividerProps = {
  label?: string;
};

export default function SectionDivider({ label }: SectionDividerProps) {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-600/50" />
      </div>
      {label ? (
        <div className="relative flex justify-center">
          <span className="bg-[#1a1d23] px-4 text-sm font-semibold bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            {label}
          </span>
        </div>
      ) : null}
    </div>
  );
}
