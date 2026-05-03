"use client";

import { useParams, useRouter } from "next/navigation";
import { UpdateProductRequestSchema } from "@/features/products/data/schemas/create-product-request.schema";
import { submitWithSchema } from "@/features/shared/data/infrastructure/forms/submit-with-schema";
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
    await submitWithSchema({
      schema: UpdateProductRequestSchema,
      payload: {
        name: formData.get("name"),
        price: formData.get("price"),
        category: formData.get("category"),
        image: formData.get("image"),
        hasRecipe: formData.get("hasRecipe"),
      },
      action: async (data) => updateProductAction(id, data),
      onSuccess: () => {
        showSuccessToast("Producto Actualizado correctamente");
        router.push("/administracion/productos");
        router.refresh();
      },
    });
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
