import type { ReactNode } from "react";
import { GradientCard } from "./GradientCard";

type GradientFormCardProps = {
  gradientId: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export default function GradientFormCard({
  gradientId,
  title,
  children,
  className,
}: GradientFormCardProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <GradientCard
        gradientId={gradientId}
        className={className}
        contentClassName="rounded-2xl p-8"
      >
        <h2 className="mb-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 bg-clip-text text-center text-3xl font-bold text-transparent">
          {title}
        </h2>
        {children}
      </GradientCard>
    </div>
  );
}
