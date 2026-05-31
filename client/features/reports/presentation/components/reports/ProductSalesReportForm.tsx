"use client";

import { submitWithSchema } from "@/features/shared/data/infrastructure/forms/submit-with-schema";
import {
  showErrorToast,
  showSuccessToast,
} from "@/features/shared/components/toast/ToastNotifications";
import CustomCheckboxForm from "@/features/shared/components/forms/CustomCheckboxForm";
import CustomFieldedFormDate from "@/features/shared/components/forms/CustomFieldedFormDate";
import CustomSelectForm from "@/features/shared/components/forms/CustomSelectForm";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import { generateProductSalesReportAction } from "@/features/reports/presentation/actions/report-actions";
import { ProductSalesReportRequestSchema } from "@/features/reports/data/schemas/reports/product-sales-report-request.schema";
import type { Product } from "@/features/products/domain/entities/product";

function downloadFileFromBytes(data: {
  bytes: number[];
  contentType: string;
  fileName: string;
}) {
  const byteArray = new Uint8Array(data.bytes);
  const blob = new Blob([byteArray], { type: data.contentType });
  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = data.fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(fileUrl);
}

export default function ProductSalesReportForm({ products }: { products: Product[] }) {
  const handleSubmit = async (formData: FormData) => {
    await submitWithSchema({
      schema: ProductSalesReportRequestSchema,
      payload: {
        fromDate: formData.get("fromDate"),
        toDate: formData.get("toDate"),
        productId: formData.get("productId"),
        includeOrders: formData.get("includeOrders") === "on",
        reportFormat: formData.get("reportFormat"),
      },
      action: generateProductSalesReportAction,
      onSuccess: ({ data }) => {
        if (!data) {
          showErrorToast("No se encontraron resultados para el filtro seleccionado");
          return;
        }

        downloadFileFromBytes(data);
        showSuccessToast("Reporte generado correctamente");
      },
    });
  };

  return (
    <GradientFormCard gradientId="product-sales-report-form" title="Reporte de Ventas por Producto">
      <form action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomFieldedFormDate name="fromDate" label="Fecha desde" />
          <CustomFieldedFormDate name="toDate" label="Fecha hasta" />
        </div>

        <CustomSelectForm name="productId" label="Producto" defaultValue="">
          <option value="" className="bg-gray-800">
            Seleccionar producto
          </option>
          {products.map((product) => (
            <option key={product.id} value={product.id} className="bg-gray-800">
              {product.name}
            </option>
          ))}
        </CustomSelectForm>

        <CustomCheckboxForm
          name="includeOrders"
          label="Mostrar detalle por órdenes"
          defaultChecked={false}
        />

        <CustomSelectForm name="reportFormat" label="Formato" defaultValue="pdf">
          <option value="pdf" className="bg-gray-800">
            PDF
          </option>
          <option value="excel" className="bg-gray-800">
            Excel
          </option>
        </CustomSelectForm>

        <div className="pt-2">
          <FormSubmitButton pendingText="GENERANDO...">GENERAR REPORTE</FormSubmitButton>
        </div>
      </form>
    </GradientFormCard>
  );
}
