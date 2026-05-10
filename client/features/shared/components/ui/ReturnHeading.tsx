"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Heading from "./Heading";

type ReturnHeadingProps = {
  titlePage: string;
  backHref: string;
};

export default function ReturnHeading({ titlePage, backHref }: ReturnHeadingProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Link
        href={backHref}
        className="text-orange-400 hover:text-orange-300 transition-colors duration-200 cursor-pointer"
      >
        <ArrowLeft className="h-8 w-8" />
      </Link>

      <Heading>{titlePage}</Heading>
    </div>
  );
}
