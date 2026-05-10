import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toPurchasesSearchQuery } from "@/features/purchases/data/mappers/purchase.mapper";

type PurchasesPaginationProps = {
  page: number;
  totalPages: number;
  filters?: {
    date?: string;
  };
};

function getPurchasesPageHref(page: number, filters?: { date?: string }) {
  const params = toPurchasesSearchQuery(filters);
  params.set("page", page.toString());

  return `/administracion/compras-y-proveedores/compras?${params.toString()}`;
}

export default function PurchasesPagination({
  page,
  totalPages,
  filters,
}: PurchasesPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 sm:gap-3 mt-8 pb-10">
      {page > 1 && (
        <Link
          href={getPurchasesPageHref(page - 1, filters)}
          className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 group"
          style={{
            border: "2px solid transparent",
            background:
              "linear-gradient(rgba(42, 46, 53, 0.4), rgba(42, 46, 53, 0.4)) padding-box, linear-gradient(to right, #6b7280, #4b5563) border-box",
          }}
        >
          <div
            className="absolute inset-0 rounded-xl blur-md -z-10"
            style={{
              background: "linear-gradient(to right, #fbbf24, #f97316, #ea580c)",
              opacity: 0.3,
            }}
          />
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-orange-400 transition-colors" />
        </Link>
      )}

      {pages.map((currentPage) => (
        <Link
          key={currentPage}
          href={getPurchasesPageHref(currentPage, filters)}
          className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 group"
          style={
            page === currentPage
              ? {
                  border: "2px solid transparent",
                  background:
                    "linear-gradient(rgba(42, 46, 53, 0.6), rgba(42, 46, 53, 0.6)) padding-box, linear-gradient(to right, #fbbf24, #f97316, #ea580c) border-box",
                  boxShadow: "0 0 20px rgba(251, 146, 60, 0.4)",
                }
              : {
                  border: "2px solid transparent",
                  background:
                    "linear-gradient(rgba(42, 46, 53, 0.4), rgba(42, 46, 53, 0.4)) padding-box, linear-gradient(to right, #6b7280, #4b5563) border-box",
                }
          }
        >
          <div
            className="absolute inset-0 rounded-xl blur-md -z-10"
            style={{
              background: "linear-gradient(to right, #fbbf24, #f97316, #ea580c)",
              opacity: 0.3,
            }}
          />
          <span
            className={`${page === currentPage && "text-white"} text-gray-400 group-hover:text-white transition-colors font-bold text-sm sm:text-base`}
          >
            {currentPage}
          </span>
        </Link>
      ))}

      {page < totalPages && (
        <Link
          href={getPurchasesPageHref(page + 1, filters)}
          className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-300 group"
          style={{
            border: "2px solid transparent",
            background:
              "linear-gradient(rgba(42, 46, 53, 0.4), rgba(42, 46, 53, 0.4)) padding-box, linear-gradient(to right, #6b7280, #4b5563) border-box",
          }}
        >
          <div
            className="absolute inset-0 rounded-xl blur-md -z-10"
            style={{
              background: "linear-gradient(to right, #fbbf24, #f97316, #ea580c)",
              opacity: 0.3,
            }}
          />
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-orange-400 transition-colors" />
        </Link>
      )}
    </nav>
  );
}
