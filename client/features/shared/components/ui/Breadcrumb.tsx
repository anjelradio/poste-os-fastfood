"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BreadcrumbProps {
  parent: string;
  child: string;
  backHref: string;
}

export default function Breadcrumb({ parent, child, backHref }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Link
        href={backHref}
        className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
      >
        <ArrowLeft className="h-8 w-8" />
      </Link>
      <div className="flex items-center gap-2 text-lg">
        <span className="text-gray-400">{parent}</span>
        <span className="text-gray-500">/</span>
        <span className="text-orange-400 font-medium">{child}</span>
      </div>
    </div>
  );
}
