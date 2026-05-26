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
import { generatePurchasesReportAction } from "@/features/reports/presentation/actions/report-actions";
import { PurchasesReportRequestSchema } from "@/features/reports/data/schemas/reports/purchases-report-request.schema";
import type { RawMaterial } from "@/features/inventory/domain/entities/raw-material";
import type { Supplier } from "@/features/purchases/domain/entities/supplier";

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

export default function PurchasesReportForm({
  rawMaterials,
  suppliers,
}: {
  rawMaterials: RawMaterial[];
  suppliers: Supplier[];
}) {
  const handleSubmit = async (formData: FormData) => {
    await submitWithSchema({
      schema: PurchasesReportRequestSchema,
      payload: {
        fromDate: formData.get("fromDate"),
        toDate: formData.get("toDate"),
        includeItems: formData.get("includeItems") === "on",
        rawMaterialId: formData.get("rawMaterialId"),
        supplierId: formData.get("supplierId"),
        reportFormat: formData.get("reportFormat"),
      },
      action: generatePurchasesReportAction,
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
    <GradientFormCard gradientId="purchases-report-form" title="Reporte de Compras">
      <form action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomFieldedFormDate name="fromDate" label="Fecha desde" />
          <CustomFieldedFormDate name="toDate" label="Fecha hasta" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomSelectForm name="supplierId" label="Proveedor (opcional)" defaultValue="">
            <option value="" className="bg-gray-800">
              Todos los proveedores
            </option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id} className="bg-gray-800">
                {supplier.businessName}
              </option>
            ))}
          </CustomSelectForm>

          <CustomSelectForm
            name="rawMaterialId"
            label="Materia prima (opcional)"
            defaultValue=""
          >
            <option value="" className="bg-gray-800">
              Todas las materias primas
            </option>
            {rawMaterials.map((rawMaterial) => (
              <option key={rawMaterial.id} value={rawMaterial.id} className="bg-gray-800">
                {rawMaterial.name} ({rawMaterial.measureUnit.name})
              </option>
            ))}
          </CustomSelectForm>
        </div>

        <CustomCheckboxForm
          name="includeItems"
          label="Incluir detalle de items"
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
