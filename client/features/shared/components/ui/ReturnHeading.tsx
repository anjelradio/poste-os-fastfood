"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Heading from "./Heading";

type ReturnHeadingProps = {
  titlePage: string;
};

export default function ReturnHeading({ titlePage }: ReturnHeadingProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={() => router.back()}
        className="text-orange-400 hover:text-orange-300 transition-colors duration-200 cursor-pointer"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <Heading>{titlePage}</Heading>
    </div>
  );
}
