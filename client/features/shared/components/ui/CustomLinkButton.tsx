import Link from "next/link";

type CustomLinkButtonProps = {
  pageUrl: string;
  label?: string;
};

export default function CustomLinkButton({
  pageUrl,
  label = "CREAR PRODUCTO",
}: CustomLinkButtonProps) {
  return (
    <div className="mb-6">
      <Link
        href={`${pageUrl}`}
        className="cursor-pointer px-8 py-3 rounded-xl font-bold text-base text-gray-900 bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 shadow-lg hover:shadow-[0_0_20px_rgba(251,146,60,0.6)] transition-all duration-300 hover:scale-105"
      >
        {label}
      </Link>
    </div>
  );
}
