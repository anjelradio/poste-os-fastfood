import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";
import type { Supplier } from "@/features/purchases/domain/entities/supplier";

type SupplierFormProps = {
  supplier?: Supplier;
};

export default function SupplierForm({ supplier }: SupplierFormProps) {
  return (
    <div className="space-y-6">
      <CustomFieldedFormText
        name="businessName"
        label="Razón social"
        defaultValue={supplier?.businessName}
        placeholder="Ej: Distribuidora Los Andes S.R.L."
      />

      <CustomFieldedFormText
        name="contactName"
        label="Nombre de contacto"
        defaultValue={supplier?.contactName}
        placeholder="Ej: Juan Perez"
      />

      <CustomFieldedFormText
        name="phone"
        label="Teléfono"
        defaultValue={supplier?.phone}
        placeholder="Ej: +591 70000000"
      />

      <CustomFieldedFormText
        type="email"
        name="email"
        label="Correo"
        defaultValue={supplier?.email}
        placeholder="Ej: compras@empresa.com"
      />
    </div>
  );
}
