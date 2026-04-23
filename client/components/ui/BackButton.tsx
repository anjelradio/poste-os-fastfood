"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.back()}>
      <ArrowLeft className="h-8 w-8 text-orange-400 hover:text-orange-300 transition-colors duration-200" />
    </button>
  );
}
