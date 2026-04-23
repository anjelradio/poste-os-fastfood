"use client";

import { useParams, useRouter } from "next/navigation";
import { UpdateProductRequestSchema } from "@/features/products/data/schemas/create-product-request.schema";
import {
  handleApiErrors,
  handleValidationErrors,
  handleZodErrors,
} from "@/lib/api/errors";
import { updateProductAction } from "../../actions/product-actions";
import {
  showSuccessToast,
} from "@/features/shared/components/toast/ToastNotifications";
import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";

export default function EditProductForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const id = +params.id!;
  const handleSubmit = async (formData: FormData) => {
    const data = {
      name: formData.get("name"),
      price: formData.get("price"),
      category: formData.get("category"),
      image: formData.get("image"),
      hasRecipe: formData.get("hasRecipe"),
    };
    const result = UpdateProductRequestSchema.safeParse(data);
    if (!result.success) {
      handleZodErrors(result.error.issues);
      return;
    }
    const response = await updateProductAction(id, result.data);

    if (response.ok) {
      showSuccessToast("Producto Actualizado correctamente");
      router.push("/administracion/productos");
      router.refresh();
      return;
    }

    if (response.validationErrors) {
      handleValidationErrors(response.validationErrors);
      return;
    }

    handleApiErrors(response.errors);
  };
  return (
    <GradientFormCard gradientId="edit-product-form" title="Editar Producto">
      <form action={handleSubmit} className="space-y-6">
        {children}
        <div className="pt-4">
          <FormSubmitButton pendingText="Guardando...">EDITAR</FormSubmitButton>
        </div>
      </form>
    </GradientFormCard>
  );
}
