import Image from "next/image";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";

export default function LoginCard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <GradientCard gradientId="login-card" contentClassName="rounded-2xl p-8">
          <div className="mb-8 flex justify-center">
            <Image
              src="/assets/logo.png"
              alt="Los Porteños"
              width={144}
              height={144}
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
          {children}
        </GradientCard>
      </div>
    </div>
  );
}
