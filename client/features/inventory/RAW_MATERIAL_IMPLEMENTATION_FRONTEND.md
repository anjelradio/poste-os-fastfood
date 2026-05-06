# Guia de Implementacion Frontend - Materias Primas (Raw Materials)

## Objetivo

Documentar la implementacion frontend del modulo de materias primas en `client/features/inventory`, siguiendo arquitectura por capas:

- `domain`: entidad
- `data`: schemas, mappers, api, repository
- `presentation`: actions y componentes

Se implemento un flujo simple, sin paginacion y sin filtros de busqueda para el listado.

---

## Ubicacion del modulo

### Feature inventory

- `client/features/inventory/domain/`
- `client/features/inventory/data/`
- `client/features/inventory/presentation/`

### Paginas app

- `client/app/(views)/administracion/inventario/materias-primas/page.tsx`
- `client/app/(views)/administracion/inventario/materias-primas/agregar/page.tsx`
- `client/app/(views)/administracion/inventario/materias-primas/[id]/editar/page.tsx`

---

## Reglas de patron aplicadas

1. Frontend usa `camelCase`.
2. Backend usa `snake_case`.
3. Conversion exclusivamente en mappers.
4. API obtiene token internamente con `getAccessToken()` (mismo enfoque que products).
5. Form base = campos; wrappers add/edit = submit logic.

---

## Resumen de lo implementado

## 1) Domain

Entidad `RawMaterial` ampliada en:

- `client/features/inventory/domain/entities/raw-material.ts`

Campos principales:

- `id`
- `name`
- `stock`
- `minStock`
- `measureUnit`
- `category`

---

## 2) Schemas

Se agregaron/actualizaron schemas en `client/features/inventory/data/schemas/`:

- `raw-materials-list-response.schema.ts` (DTO backend)
- `raw-material-request.schema.ts` (validacion create/update)

Validaciones clave:

- `name` requerido
- `stock` y `minStock` no negativos
- `measureUnit` y `category` obligatorios

---

## 3) Mappers

Archivo:

- `client/features/inventory/data/mappers/raw-material.mapper.ts`

Funciones:

- `toRawMaterialEntity`
- `toRawMaterialEntityList`
- `toRawMaterialRequestDto`

Conversiones:

- `min_stock` -> `minStock`
- `measure_unit` -> `measureUnit`
- `minStock` -> `min_stock`
- `measureUnit` -> `measure_unit`

---

## 4) API y Repository

Archivos:

- `client/features/inventory/data/api/inventory-api.ts`
- `client/features/inventory/data/repositories/inventory.repository.ts`

Metodos disponibles:

- `getRawMaterials`
- `getRawMaterialById`
- `createRawMaterial`
- `updateRawMaterial`
- `deleteRawMaterial`
- `getMeasureUnits`

---

## 5) Actions

Archivos:

- `client/features/inventory/presentation/actions/raw-material-actions.ts`
- `client/features/inventory/presentation/actions/inventory-actions.ts`

Uso:

- CRUD de materias primas
- revalidacion de ruta de listado
- acciones auxiliares para consumo desde componentes cliente cuando aplica

---

## 6) Integracion de UI

### Listado

`.../materias-primas/page.tsx`:

- elimina cards mockeadas
- consume listado real
- itera y renderiza `RawMaterialListCard`

### Formulario

`RawMaterialForm.tsx`:

- carga categorias (`RAW_MATERIAL`) y unidades reales
- usa valores por defecto para editar

### Crear / Editar

- `AddRawMaterialForm.tsx`: submit real con schema + action
- `EditRawMaterialForm.tsx`: update real con schema + action

### Eliminar

- `DeleteRawMaterial.tsx`: modal + confirm llamando endpoint delete

---

## 7) Ajuste visual aplicado

Para consistencia en interfaz, stock y stock minimo se muestran con 2 decimales en:

- `RawMaterialListCard`
- `DeleteRawMaterial` (detalle del modal)

---

## 8) Verificacion recomendada

1. listar materias primas en UI
2. crear materia prima
3. editar por id
4. eliminar desde modal
5. confirmar que no hay mocks remanentes
6. revisar build/typecheck del frontend

---

## Nota para diagramas GUI y UML

Para documentar GUI y flujos:

- para diagramas de interfaz de captura/edicion, tomar como base el **formulario** (`RawMaterialForm` + wrappers add/edit)
- para consulta/listado, tomar como base la **pagina completa** de materias primas (`.../materias-primas/page.tsx`)

Para secuencia/comunicacion:

- UI -> Action -> Repository -> API -> Backend ViewSet -> Serializer/Model

Esto ayuda a mantener trazabilidad clara en documentacion academica.

---

## Criterio de finalizacion

Frontend de materias primas se considera completo cuando:

- capas `domain/data/presentation` estan consistentes
- mappers cubren snake_case/camelCase en ambos sentidos
- listado/create/edit/delete funcionan end-to-end
- UI no depende de mocks
