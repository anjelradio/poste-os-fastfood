import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

type ActionLinkButtonProps = {
  pageUrl?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

const baseClassName =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 px-6 py-2.5 text-sm font-bold text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(251,146,60,0.6)]";

export default function ActionLinkButton({
  pageUrl,
  children,
  className,
  style,
  onClick,
}: ActionLinkButtonProps) {
  if (pageUrl) {
    return (
      <Link href={pageUrl} className={cn(baseClassName, className)} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(baseClassName, className)}
      style={style}
    >
      {children}
    </button>
  );
}
