"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BreadcrumbProps {
    parent: string;
    child: string;
}

export default function Breadcrumb({ parent, child }: BreadcrumbProps) {
    const router = useRouter();

    return (
        <div className="flex items-center gap-4 mb-6">
            <button
                onClick={() => router.back()}
                className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
            >
                <ArrowLeft className="h-8 w-8" />
            </button>
            <div className="flex items-center gap-2 text-lg">
                <span className="text-gray-400">{parent}</span>
                <span className="text-gray-500">/</span>
                <span className="text-orange-400 font-medium">{child}</span>
            </div>
        </div>
    );
}
