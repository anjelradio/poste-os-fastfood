import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import { getOrderByIdAction } from "@/features/orders/presentation/actions/order-actions";
import EditOrderForm from "@/features/orders/presentation/components/EditOrderForm";
import OrderForm from "@/features/orders/presentation/components/OrderForm";

export default async function EditOrderPage({ params }: any) {
  const resolvedParams = await params;
  const orderId = Number(resolvedParams.id);

  const response = await getOrderByIdAction(orderId);
  if (!response.ok || !response.data) {
    throw new Error(response.ok ? "Orden no encontrada" : response.errors[0]);
  }

  const order = response.data;

  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Historial de Órdenes"
        child={`Editar Orden #${order.orderNumber}`}
        backHref="/caja/ordenes"
      />

      <EditOrderForm order={order}>
        <OrderForm />
      </EditOrderForm>
    </div>
  );
}
