# Instrucciones Frontend - Flujo de Consulta de Ordenes por Rol

## Proposito de este documento

Este documento esta orientado a una persona que necesita **estudiar, mantener o extender** el flujo de consulta de ordenes en frontend.

El objetivo es que pueda responder rapidamente:

- que pagina consume que flujo
- que componentes participan
- donde viven los filtros
- donde esta la capa de datos (api/repository/mapper)
- como cambia el comportamiento por rol (admin, caja, cocina)

---

## Resumen funcional del caso de uso

En frontend existen tres contextos que consultan ordenes:

1. Admin (historial global con filtros)
2. Caja (mis ordenes con filtros)
3. Cocina (ordenes del dia, sin formulario de filtros)

Los tres reutilizan la misma cadena tecnica de consulta:

`Page -> Action -> Repository -> API -> Backend /orders/ -> Mapper -> UI`

---

## 1) Rutas/paginas a revisar primero

## 1.1 Admin - Historial y reportes

- `client/app/(views)/administracion/historial-y-reportes/ordenes/page.tsx`
- `client/app/(views)/administracion/historial-y-reportes/ordenes/search/page.tsx`

Que hacen:

- `page.tsx`: carga inicial (normalmente fecha de hoy) + muestra formulario de filtros
- `search/page.tsx`: recibe query params (`date`, `status`, `type`) y muestra resultados filtrados

## 1.2 Caja - Mis ordenes

- `client/app/(views)/caja/ordenes/page.tsx`
- `client/app/(views)/caja/ordenes/search/page.tsx`

Que hacen:

- usan el mismo formulario de filtros
- muestran resultados en la misma grilla de historial
- no envian `user_id` por defecto; el backend restringe por rol caja

## 1.3 Cocina - Ordenes de hoy

- `client/app/(views)/cocina/page.tsx`

Que hace:

- no usa formulario de filtros
- consulta ordenes operativas con `status=NOT_READY`
- backend fuerza fecha de hoy para cocina

---

## 2) Componentes clave por pantalla

## 2.1 Componente de filtros

- `client/features/orders/presentation/components/OrderFiltersForm.tsx`

Responsabilidad:

- renderizar campos de filtro: `date`, `status`, `type`
- validar input de busqueda con schema
- construir query string y navegar a `/search`

Importante:

- actualmente **no** envia `user_id` por defecto
- el alcance por rol se decide en backend

## 2.2 Grilla/historial

- `client/features/orders/presentation/components/OrdersHistoryGrid.tsx`

Responsabilidad:

- renderizar coleccion de ordenes
- delegar card individual a `OrderCard`

## 2.3 Card de orden

- `client/features/orders/presentation/components/OrderCard.tsx`

Responsabilidad:

- mostrar orden completa: numero, cliente, items, total, estado, tipo, hora
- mostrar acciones por rol:
  - cocina -> `CookOrderActions`
  - admin/caja -> `AdminCashierOrderActions`

---

## 3) Capa de datos (donde leer si hay errores de consulta)

## 3.1 Action

- `client/features/orders/presentation/actions/orders-list-actions.ts`

Punto de entrada desde paginas server component:

- `getOrdersAction(filters)`

## 3.2 Repository

- `client/features/orders/data/repositories/orders-list.repository.ts`

Responsabilidad:

- encapsular llamadas a API
- exponer metodos simples a presentation

## 3.3 API

- `client/features/orders/data/api/orders-list-api.ts`

Responsabilidad:

- obtener token (`getAccessToken()`)
- construir URL final con query params
- consumir `GET /orders/`
- validar respuesta con schema

## 3.4 Mapper

- `client/features/orders/data/mappers/orders-list.mapper.ts`

Responsabilidad:

- traducir nombres backend (`snake_case`) a frontend (`camelCase`)
- construir query params desde filtros frontend

Conversiones principales:

- `order_number` -> `orderNumber`
- `client_name` -> `clientName`
- `ready_at` -> `readyAt`

---

## 4) Entidad frontend que consume la UI

Archivo:

- `client/features/orders/domain/entities/order-list-item.ts`

Campos principales de `OrderListItem`:

- `id`
- `orderNumber`
- `clientName`
- `total`
- `type`
- `status`
- `readyAt`
- `items`

Nota:

- mantener estos nombres en camelCase
- evitar alias ambiguos (`nro`, `client`) para no romper consistencia entre features

---

## 5) Flujo por rol explicado paso a paso

## 5.1 Admin (historial global)

1. entra a `.../historial-y-reportes/ordenes`
2. carga inicial consulta `getOrdersAction({ date: hoy })`
3. aplica filtros en `OrderFiltersForm`
4. navega a `/search?date=...&status=...&type=...`
5. `search/page.tsx` vuelve a consultar con esos filtros
6. backend devuelve alcance global (admin)

## 5.2 Caja (mis ordenes)

1. entra a `.../caja/ordenes`
2. carga inicial consulta por fecha
3. aplica filtros con el mismo formulario
4. backend aplica restriccion por rol caja (usuario autenticado)
5. solo aparecen ordenes propias

## 5.3 Cocina (operativo del dia)

1. entra a `.../cocina`
2. pagina consulta `status=NOT_READY` (y puede enviar fecha hoy)
3. backend fuerza fecha actual para cocina
4. resultado: ordenes del dia para trabajo operativo

---

## 6) Que revisar cuando algo falle

Si no aparecen ordenes:

1. revisar pagina origen (params enviados)
2. revisar `OrderFiltersForm` (query string)
3. revisar `orders-list.mapper.ts` (`toOrdersQueryParams`)
4. revisar `orders-list-api.ts` (url final + token)
5. revisar backend list por rol

Si la UI muestra campos vacios o mal nombrados:

1. revisar `OrderListItemResponseDtoSchema`
2. revisar mapper snake->camel
3. revisar entidad `OrderListItem`
4. revisar `OrderCard`/`CancelOrderButton`

---

## 7) Reglas para extender este flujo

Si agregas un filtro nuevo (por ejemplo `payment_status`):

1. agregar campo en UI (`OrderFiltersForm`)
2. agregar mapping en `toOrdersQueryParams`
3. ajustar API/schema si aplica
4. ajustar backend `list`
5. validar en admin, caja y cocina

Si agregas nuevo campo en card:

1. agregar campo en DTO schema
2. mapear en mapper
3. agregar en entidad domain
4. usar en componente

---

## 8) Nota sobre componentes legacy

Existe una implementacion legacy en:

- `client/lib/api/orders.ts`

Para este caso de uso de historial/listado, mantener como fuente principal:

- `features/orders/data/api/orders-list-api.ts`

Esto evita inconsistencias entre dos caminos de consulta.

---

## 9) Mini checklist de validacion funcional

1. Admin ve ordenes globales con filtros.
2. Caja nunca ve ordenes de otros usuarios.
3. Cocina solo ve ordenes del dia.
4. `NOT_READY` excluye `READY`.
5. `type=DELIVERY` filtra correctamente.
6. UI consume `orderNumber/clientName/readyAt` (camelCase consistente).

---

## 10) Nota para diagramas (GUI, secuencia, comunicacion)

Para documentacion de GUI:

- usar `OrderFiltersForm` para admin/caja
- usar pagina `cocina/page.tsx` para flujo sin filtros

Para secuencia/comunicacion:

- `Page -> getOrdersAction -> ordersListRepository -> ordersListApi -> GET /orders/ -> mapper -> UI`

Para comunicacion por rol:

- marcar decision en backend `OrderViewSet.list`:
  - admin: alcance global
  - caja: alcance propio
  - cocina: fecha forzada a hoy
