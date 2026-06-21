import Breadcrumb from "@/features/shared/components/ui/Breadcrumb";
import { GradientCard } from "@/features/shared/components/ui/GradientCard";
import { inventoryRepository } from "@/features/inventory/data/repositories/inventory.repository";
import MovementListCard from "@/features/inventory/presentation/components/movimiento/MovementListCard";

export default async function InventoryMovementPage() {
  const response = await inventoryRepository.getInventoryMovements();

  if (!response.ok) {
    throw new Error(response.errors[0] ?? "Error al obtener la bitácora de movimientos.");
  }

  const movements = response.data;

  return (
    <div className="flex-1 pb-10">
      <Breadcrumb
        parent="Inventario"
        child="Movimientos de Inventario"
        backHref="/administracion/inventario"
      />

      <GradientCard
        gradientId="movements-table"
        contentClassName="rounded-2xl overflow-hidden"
        contentStyle={{ maxHeight: "500px" }}
      >
        {/* Table Header - Sticky - Desktop (Exacta replicación de bitácora sin fondo fijo) */}
        <div className="hidden md:grid grid-cols-8 gap-4 px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold text-sm">Fecha y Hora</div>
          <div className="text-gray-300 font-semibold text-sm col-span-2">Materia Prima</div>
          <div className="text-gray-300 font-semibold text-sm">Movimiento</div>
          <div className="text-gray-300 font-semibold text-sm">Cantidad</div>
          <div className="text-gray-300 font-semibold text-sm col-span-2">Razón / Descripción</div>
        </div>

        {/* Table Header - Mobile */}
        <div className="md:hidden px-6 py-4 border-b border-gray-600/30 sticky top-0">
          <div className="text-gray-300 font-semibold text-lg">Bitácora de Inventario</div>
        </div>

        {/* Table Body - Scrollable (mismas dimensiones de la bitácora) */}
        <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
          {movements.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No hay registros de movimientos en el inventario.
            </div>
          ) : (
            movements.map((movement) => (
              <MovementListCard key={movement.id} movement={movement} />
            ))
          )}
        </div>
      </GradientCard>
    </div>
  );
}
