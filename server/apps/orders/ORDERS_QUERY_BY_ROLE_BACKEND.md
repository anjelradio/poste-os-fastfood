# Guia Backend - Consulta de Ordenes por Rol

## Objetivo

Documentar el flujo de consulta de ordenes en backend para los tres roles que consumen historial/listado:

- `ADMIN`
- `CAJA`
- `COCINA`

Este flujo esta implementado sobre un unico endpoint de listado y aplica reglas por rol dentro del servidor.

---

## Endpoint principal

El caso de uso se resuelve en:

- `GET /orders/`

Implementado en:

- `server/apps/orders/views/order_views.py`

Clase:

- `OrderViewSet`

Metodo clave:

- `list(self, request)`

---

## Permisos

Para `list`, el endpoint habilita estos roles:

- Admin
- Caja
- Cocina

Referencia:

- `get_permissions()` en `OrderViewSet`
- usa `IsAdminOrCajaOrCocina` para la accion `list`

---

## Filtros soportados por query params

El endpoint acepta filtros opcionales:

- `date`
- `status`
- `type`
- `user_id` (solo tiene sentido para admin)

Reglas de estado/tipo:

- `status=NOT_READY` -> excluye `READY`
- `status=ALL` -> no filtra por estado
- `type=ALL` -> no filtra por tipo
- alias tipo:
  - `MESA` -> `DINE_IN`
  - `LLEVAR` -> `TAKEAWAY`

---

## Logica por rol (core del caso de uso)

## 1) Rol `ADMIN`

Comportamiento:

- puede ver todas las ordenes activas (`state=True`)
- puede aplicar filtros por fecha, estado y tipo
- puede usar `user_id` para filtrar por un usuario especifico

Resultado:

- historial global de ordenes

## 2) Rol `CAJA`

Comportamiento:

- siempre se filtra por `user=request.user`
- ignora la necesidad de enviar `user_id` desde frontend
- aplica filtros de fecha, estado y tipo sobre sus propias ordenes

Resultado:

- vista "mis ordenes"

## 3) Rol `COCINA`

Comportamiento:

- **fecha forzada en backend al dia actual** (`timezone.localdate()`)
- aunque frontend envie otra fecha, backend la reemplaza por hoy
- puede combinar con `status` (ej. `NOT_READY`)
- no usa filtro por `user_id`

Resultado:

- tablero operativo de ordenes del dia

---

## Por que esta logica vive en backend

Se centraliza en backend para garantizar:

- seguridad por rol
- consistencia entre pantallas
- evitar que UI o query params alteren alcance de datos (especialmente caja/cocina)

---

## Ordenamiento y salida

- queryset base: `Order.objects.filter(state=True)`
- salida serializada con `OrderListSerializer`
- orden actual: `order_by("order_number")`

---

## Checklist de verificacion backend

1. Admin ve todas las ordenes con filtros.
2. Caja solo ve ordenes propias, aun sin `user_id`.
3. Cocina solo ve ordenes del dia, siempre.
4. `status=NOT_READY` excluye listas `READY`.
5. Alias de tipo (`MESA`, `LLEVAR`) funcionan.

---

## Nota para documentacion UML

Si se necesita trazabilidad academica (comunicacion/secuencia/analisis):

- el punto de control (`CTRL`) es `OrderViewSet.list`
- las decisiones por rol deben quedar visibles como nodos de decision
- la forzacion de fecha para cocina debe modelarse explicitamente

Si se requiere mas detalle en diagrama, se puede extraer la logica por rol a metodos privados para que el flujo quede aun mas claro:

- `_apply_role_scope(queryset, request)`
- `_apply_filters(queryset, params)`
