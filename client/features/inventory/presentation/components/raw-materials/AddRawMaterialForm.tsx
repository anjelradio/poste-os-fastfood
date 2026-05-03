"use client";

import GradientFormCard from "@/features/shared/components/ui/GradientFormCard";
import FormSubmitButton from "@/features/shared/components/submit/FormSubmitButton";

export default function AddRawMaterialForm({ children }: any) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <GradientFormCard
      gradientId="add-raw-material-form"
      title="Registrar Materia Prima"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {children}

        <div className="pt-4">
          <FormSubmitButton pendingText="Guardando...">
            Registrar materia prima
          </FormSubmitButton>
        </div>
      </form>
    </GradientFormCard>
  );
}
