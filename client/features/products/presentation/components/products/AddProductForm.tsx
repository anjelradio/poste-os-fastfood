"use client";

import { useRouter } from "next/navigation";
import { CreateProductRequestSchema } from "@/features/products/data/schemas/create-product-request.schema";
import { submitWithSchema } from "@/features/shared/data/infrastructure/forms/submit-with-schema";
import {
  showSuccessToast,
} from "@/features/shared/components/toast/ToastNotifications";
import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";
import { createProductAction } from "../../actions/product-actions";

export default function AddProductForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    await submitWithSchema({
      schema: CreateProductRequestSchema,
      payload: {
        name: formData.get("name"),
        price: formData.get("price"),
        category: formData.get("category"),
        image: formData.get("image"),
        hasRecipe: formData.get("hasRecipe"),
      },
      action: createProductAction,
      onSuccess: () => {
        showSuccessToast("Producto creado correctamente");
        router.push("/administracion/productos");
        router.refresh();
      },
    });
  };
  return (
    <GradientFormCard gradientId="add-product-form" title="Crear Nuevo Producto">
      <form action={handleSubmit} className="space-y-6">
        {children}
        <div className="pt-4">
          <FormSubmitButton pendingText="Creando...">
            Registrar Producto
          </FormSubmitButton>
        </div>
      </form>
    </GradientFormCard>
  );
}
