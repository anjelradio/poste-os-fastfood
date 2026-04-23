"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Category } from "@/lib/schemas/category.schema";

type CategoryButtonProps = {
    category: Category;
};

export default function CategoryButton({ category }: CategoryButtonProps) {
    const params = useParams<{ category: string }>();
    return (
        <button
            className="relative px-4 py-3 rounded-full border-2 text-sm transform flex items-center justify-center overflow-hidden group cursor-pointer"
            style={{
                background:
                    "linear-gradient(rgba(42, 46, 53, 0.6), rgba(42, 46, 53, 0.6)) padding-box, linear-gradient(to right, #f97316, #ea580c) border-box",
                border: "2px solid transparent",
                borderColor:
                    category.slug === params.category
                        ? "transparent"
                        : "rgba(249, 115, 22, 0.3)",
                boxShadow:
                    category.slug === params.category
                        ? "0 0 20px rgba(251, 146, 60, 0.6)"
                        : "0 0 0px rgba(251, 146, 60, 0)",
                transform:
                    category.slug === params.category
                        ? "scale(1.05)"
                        : "scale(1)",
                transition:
                    "all 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.5s ease, transform 0.5s ease, box-shadow 0.5s ease",
            }}
            onMouseEnter={(e) => {
                if (category.slug !== params.category) {
                    e.currentTarget.style.boxShadow =
                        "0 0 15px rgba(251, 146, 60, 0.4)";
                    e.currentTarget.style.transform = "scale(1.05)";
                }
            }}
            onMouseLeave={(e) => {
                if (category.slug !== params.category) {
                    e.currentTarget.style.boxShadow =
                        "0 0 0px rgba(251, 146, 60, 0)";
                    e.currentTarget.style.transform = "scale(1)";
                }
            }}
        >
            <Link href={`${category.slug}`}>
                {/* Gradient background layer with fade transition */}
                <div
                    className="absolute inset-0 rounded-full transition-opacity duration-700 ease-in-out"
                    style={{
                        background:
                            "linear-gradient(to right, #fbbf24, #f97316, #ea580c)",
                        opacity: category.slug === params.category ? 1 : 0,
                    }}
                />

                {/* Glow effect layer */}
                <div
                    className="absolute inset-0 rounded-full transition-opacity duration-700 ease-in-out blur-md"
                    style={{
                        background:
                            "linear-gradient(to right, #fbbf24, #f97316, #ea580c)",
                        opacity: category.slug === params.category ? 0.6 : 0,
                        transform: "scale(1.1)",
                    }}
                />

                <p
                    className="relative z-10 font-medium whitespace-nowrap text-center transition-colors duration-500"
                    style={{
                        color:
                            category.slug === params.category
                                ? "white"
                                : "#d1d5db",
                    }}
                >
                    {category.name}
                </p>
            </Link>
        </button>
    );
}
