# Guia de Implementacion Frontend - Proveedores (Staplers)

## Objetivo

Implementar el modulo de proveedores en `client/features/purchases` con la misma arquitectura usada en products e inventory:

- capa `domain` (entidad limpia)
- capa `data` (`api`, `repository`, `schemas`, `mappers`)
- capa `presentation` (`actions` + componentes)
- sin mocks en paginas/componentes

Pantallas objetivo:

- `client/app/(views)/administracion/compras-y-proveedores/proveedores/`

---

## Reglas de arquitectura (patron del proyecto)

1. Frontend usa `camelCase`.
2. Backend usa `snake_case`.
3. La conversion se hace solo en mappers.
4. La API obtiene token internamente con `getAccessToken()` (igual que products).
5. Formulario base = solo campos.
6. Wrappers de crear/editar = logica de submit.
7. Eliminar en frontend llama endpoint; soft delete vive en backend.

---

## Ubicaciones a trabajar

### Rutas app

- `client/app/(views)/administracion/compras-y-proveedores/proveedores/page.tsx`
- `client/app/(views)/administracion/compras-y-proveedores/proveedores/agregar/page.tsx`
- `client/app/(views)/administracion/compras-y-proveedores/proveedores/[id]/editar/page.tsx`

### Feature purchases

- `client/features/purchases/domain/`
- `client/features/purchases/data/`
- `client/features/purchases/presentation/`

### Componentes ya listos (UI)

- `.../components/suppliers/SupplierForm.tsx`
- `.../components/suppliers/AddSupplierForm.tsx`
- `.../components/suppliers/EditSupplierForm.tsx`
- `.../components/suppliers/SupplierListCard.tsx`
- `.../components/suppliers/DeleteSupplier.tsx`

---

## Orden recomendado de implementacion

1. Entidad en `domain`
2. Schemas en `data`
3. Mapper en `data`
4. API en `data`
5. Repository en `data`
6. Actions en `presentation`
7. Integrar listado
8. Integrar crear
9. Integrar editar
10. Integrar eliminar

---

## 1) Entidad (domain)

Crear:

- `client/features/purchases/domain/entities/supplier.ts`

Campos (`camelCase`):

- `id: number`
- `businessName: string`
- `contactName: string`
- `phone: string`
- `email: string`

Usar zod + tipo inferido, mismo estilo del proyecto.

---

## 2) Schemas (data)

Crear en `client/features/purchases/data/schemas/`:

1. `supplier-response.schema.ts`
   - DTO individual (`snake_case`):
     - `id`
     - `business_name`
     - `contact_name`
     - `phone`
     - `email`

2. `suppliers-list-response.schema.ts`
   - array de DTO de proveedor

3. `supplier-request.schema.ts`
   - validaciones zod para create/update (`camelCase` de entrada):
     - `businessName` requerido
     - `contactName` requerido
     - `phone` requerido
     - `email` requerido y valido

---

## 3) Mappers (snake_case <-> camelCase)

Crear:

- `client/features/purchases/data/mappers/supplier.mapper.ts`

Implementar:

- `toSupplierEntity(dto)`
- `toSupplierEntityList(dtos)`
- `toSupplierRequestDto(data)`

Mapeos clave:

- `business_name` <-> `businessName`
- `contact_name` <-> `contactName`

No mezclar conversion de nombres dentro de componentes.

---

## 4) API

Crear:

- `client/features/purchases/data/api/suppliers-api.ts`

Metodos:

- `getSuppliers()`
- `getSupplierById(id)`
- `createSupplier(data)`
- `updateSupplier(id, data)`
- `deleteSupplier(id)`

Usar utilidades del proyecto:

- `apiRequestJson`
- `apiRequestMaybeJson`
- `apiRequestStatus`
- `parseWithSchema`
- `getAccessToken()` dentro de la API

---

## 5) Repository

Crear:

- `client/features/purchases/data/repositories/suppliers.repository.ts`

Wrapper uno a uno de la API:

- `getSuppliers`
- `getSupplierById`
- `createSupplier`
- `updateSupplier`
- `deleteSupplier`

---

## 6) Actions (presentation)

Crear:

- `client/features/purchases/presentation/actions/supplier-actions.ts`

Actions:

- `getSupplierByIdAction(id)`
- `createSupplierAction(data)`
- `updateSupplierAction(id, data)`
- `deleteSupplierAction(id)`

En mutaciones exitosas, revalidar:

- `/administracion/compras-y-proveedores/proveedores`

---

## 7) Integracion del listado

Archivo:

- `client/app/(views)/administracion/compras-y-proveedores/proveedores/page.tsx`

Reemplazar mocks por fetch real:

- obtener proveedores desde repository/action
- iterar lista en el bloque de tabla (hoy alrededor de la linea 37)
- renderizar `SupplierListCard` con props

Sin filtros, sin paginacion.

---

## 8) Integracion de crear

Archivo:

- `client/features/purchases/presentation/components/suppliers/AddSupplierForm.tsx`

Implementar submit con `submitWithSchema`:

- schema: request schema de proveedor
- payload desde `FormData`
- action: `createSupplierAction`
- exito:
  - toast
  - redirect al listado
  - refresh

---

## 9) Integracion de editar

### 9.1 Pagina detalle por id

Archivo:

- `client/app/(views)/administracion/compras-y-proveedores/proveedores/[id]/editar/page.tsx`

Reemplazar proveedor mock por fetch real:

- leer id de params
- llamar `getSupplierByIdAction(id)`
- manejar error/no encontrado
- pasar datos a `SupplierForm`

### 9.2 Formulario editar

Archivo:

- `client/features/purchases/presentation/components/suppliers/EditSupplierForm.tsx`

Implementar submit:

- action: `updateSupplierAction(id, data)`
- toast + redirect + refresh

---

## 10) Integracion de eliminar

Archivo:

- `client/features/purchases/presentation/components/suppliers/DeleteSupplier.tsx`

En confirm:

- llamar `deleteSupplierAction(supplier.id)`
- toast de exito/error
- retornar `true/false` al modal

---

## 11) Campos del formulario

Mantener nombres de formulario en frontend:

- `businessName`
- `contactName`
- `phone`
- `email`

El mapper se encarga del paso a `snake_case`.

---

## 12) Checklist QA

1. Se lista data real de proveedores.
2. Crear proveedor funciona.
3. Editar carga por id y persiste cambios.
4. Eliminar ejecuta soft delete y desaparece del listado.
5. No quedan mocks.
6. No se filtra `snake_case` a la UI.
7. Build/typecheck sin errores relacionados al modulo.

---

## 13) Nota para diagramas GUI y documentacion UML

Para diagramas de interfaz (GUI), recomendacion:

- para flujo de formulario (crear/editar), tomar como base **el formulario** (`SupplierForm` + wrapper Add/Edit)
- para flujo de consulta/listado, tomar como base **la pagina completa de proveedores** (`.../proveedores/page.tsx`)

Para la documentacion global del proyecto (comunicacion, secuencia, analisis de clase), esto ayuda a delimitar claramente:

- actores
- eventos de UI
- componentes que participan
- llamadas a actions/repository/api

---

## Referencia rapida de archivos

### Backend

- `server/apps/purchases/serializers/supplier_serializers.py`
- `server/apps/purchases/serializers/__init__.py`
- `server/apps/purchases/views/supplier_views.py`
- `server/apps/purchases/views/__init__.py`
- `server/apps/purchases/urls.py`

### Frontend

- `client/features/purchases/domain/entities/supplier.ts`
- `client/features/purchases/data/schemas/*.ts`
- `client/features/purchases/data/mappers/supplier.mapper.ts`
- `client/features/purchases/data/api/suppliers-api.ts`
- `client/features/purchases/data/repositories/suppliers.repository.ts`
- `client/features/purchases/presentation/actions/supplier-actions.ts`
- `client/app/(views)/administracion/compras-y-proveedores/proveedores/page.tsx`
- `client/app/(views)/administracion/compras-y-proveedores/proveedores/[id]/editar/page.tsx`
- `client/features/purchases/presentation/components/suppliers/*.tsx`
