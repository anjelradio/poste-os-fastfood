import CustomFieldedFormText from "@/features/shared/components/forms/CustomFieldedFormText";

export default function DeliveryDetailsFields({ values }: any) {
  return (
    <div className="space-y-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
      <p className="text-orange-400 text-sm font-semibold">
        Información de Envío
      </p>
      <CustomFieldedFormText
        name="clientPhone"
        label="Teléfono del Cliente"
        defaultValue={values?.clientPhone}
        placeholder="Ej: 644XXXXXX"
      />
      <CustomFieldedFormText
        name="address"
        label="Dirección de Envío"
        defaultValue={values?.address}
        placeholder="Calle, numero, zona"
      />
      <CustomFieldedFormText
        name="referenceNote"
        label="Nota de Referencia"
        defaultValue={values?.referenceNote}
        placeholder="Ej: Casa color blanco, porton negro"
      />
    </div>
  );
}
