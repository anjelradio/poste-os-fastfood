from collections import defaultdict
from decimal import Decimal

from rest_framework import serializers

from apps.inventory.models import InventoryMovement, RawMaterial
from apps.products.models import Product, Recipe


class InventoryService:
    """
    Servicio centralizado para la gestión de inventario.
    Encapsula la validación de stock, el consumo por ventas
    y la reversión de stock por cancelaciones.
    """

    # ------------------------------------------------------------------ #
    #  Método auxiliar: calcula cuánta materia prima necesita una orden
    # ------------------------------------------------------------------ #
    @staticmethod
    def _calculate_requirements(items):
        """
        Recorre cada producto de la orden, consulta su receta y
        acumula cuánta materia prima se necesita EN LA UNIDAD BASE
        de cada RawMaterial (convierte usando factor_to_base).

        Retorna un dict:
            { raw_material_id: { "raw_material": <obj>, "total_needed": Decimal, "products": [str] } }
        """
        requirements = defaultdict(
            lambda: {"raw_material": None, "total_needed": Decimal("0"), "products": []}
        )

        for item in items:
            product = Product.objects.get(id=item["id"])
            order_qty = item["quantity"]  # cuántas unidades del producto se pidieron

            # Todas las líneas de receta del producto (ej: Hamburguesa → Pan, Carne, etc.)
            recipes = Recipe.objects.filter(
                product=product, state=True
            ).select_related("raw_material", "measure_unit", "raw_material__measure_unit")

            for recipe in recipes:
                raw_mat = recipe.raw_material

                # --- Conversión de unidades ---
                # Convertimos la cantidad de la receta a la unidad base del RawMaterial.
                # Ej: receta dice 200 g, materia prima está en kg.
                #   200 g → (200 × 0.001) = 0.2 en base (kg)
                #   Si la materia prima ya está en kg, su factor es 1.0.
                recipe_in_base = recipe.quantity * recipe.measure_unit.factor_to_base
                raw_mat_factor = raw_mat.measure_unit.factor_to_base

                # Cantidad requerida expresada en la unidad del RawMaterial
                needed = (recipe_in_base / raw_mat_factor) * order_qty

                entry = requirements[raw_mat.id]
                entry["raw_material"] = raw_mat
                entry["total_needed"] += needed
                if product.name not in entry["products"]:
                    entry["products"].append(product.name)

        return requirements

    # ------------------------------------------------------------------ #
    #  Validar que haya stock suficiente antes de guardar la orden
    # ------------------------------------------------------------------ #
    @staticmethod
    def validate_stock(items):
        """
        Compara el stock actual de cada materia prima con lo que
        necesita la orden. Si alguna no alcanza, lanza un
        ValidationError indicando qué producto no se puede preparar.
        También valida que los productos marcados con 'has_recipe=True'
        tengan al menos una receta activa registrada.
        """
        for item in items:
            product = Product.objects.get(id=item["id"])
            if product.has_recipe:
                recipe_exists = Recipe.objects.filter(product=product, state=True).exists()
                if not recipe_exists:
                    raise serializers.ValidationError(
                        f'El producto "{product.name}" no tiene una receta registrada.'
                    )

        requirements = InventoryService._calculate_requirements(items)

        for _rm_id, entry in requirements.items():
            raw_mat = entry["raw_material"]
            needed = entry["total_needed"]

            if raw_mat.stock < needed:
                # Mostramos el primer producto que usa esta materia prima
                product_name = entry["products"][0]
                raise serializers.ValidationError(
                    f'No hay cantidad suficiente de "{raw_mat.name}" '
                    f'para poder hacer "{product_name}"'
                )

    # ------------------------------------------------------------------ #
    #  Descontar stock y registrar movimiento de inventario
    # ------------------------------------------------------------------ #
    @staticmethod
    def consume_stock(order, items):
        """
        Resta la materia prima del stock y crea un registro
        en InventoryMovement con tipo SALE_CONSUMPTION.
        Debe llamarse dentro de un transaction.atomic().
        """
        requirements = InventoryService._calculate_requirements(items)

        for _rm_id, entry in requirements.items():
            raw_mat = entry["raw_material"]
            needed = entry["total_needed"]

            # Descontar del stock
            raw_mat.stock -= needed
            raw_mat.save(update_fields=["stock"])

            # Registrar en la bitácora de inventario
            InventoryMovement.objects.create(
                raw_material=raw_mat,
                quantity=needed,
                movement_type=InventoryMovement.MovementType.SALE_CONSUMPTION,
                reason=f"Consumo por venta - Orden #{order.order_number}",
            )

    # ------------------------------------------------------------------ #
    #  Devolver stock cuando se cancela una orden
    # ------------------------------------------------------------------ #
    @staticmethod
    def restore_stock(order):
        """
        Revierte el consumo de materia prima de una orden cancelada.
        Recorre los OrderProducts de la orden, recalcula lo que se
        consumió y lo devuelve al stock.
        """
        # Reconstruimos la lista de items tal como la espera _calculate_requirements
        order_items = [
            {"id": op.product_id, "quantity": op.quantity}
            for op in order.items.select_related("product").all()
        ]

        if not order_items:
            return

        requirements = InventoryService._calculate_requirements(order_items)

        for _rm_id, entry in requirements.items():
            raw_mat = entry["raw_material"]
            amount = entry["total_needed"]

            # Devolver al stock
            raw_mat.stock += amount
            raw_mat.save(update_fields=["stock"])

            # Registrar la reversión en la bitácora
            InventoryMovement.objects.create(
                raw_material=raw_mat,
                quantity=amount,
                movement_type=InventoryMovement.MovementType.ADJUSTMENT_IN,
                reason=f"Reversión por cancelación - Orden #{order.order_number}",
            )
