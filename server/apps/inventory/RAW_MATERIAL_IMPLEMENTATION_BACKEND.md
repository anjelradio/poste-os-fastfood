# Guia de Implementacion Backend - Materias Primas (Raw Materials)

## Objetivo

Documentar la implementacion backend del modulo de materias primas en `apps/inventory`, siguiendo el patron del proyecto:

- `ModelViewSet` para CRUD
- `serializer_class` para escritura
- `list_serializer_class` para lectura
- soft delete en `destroy`
- permisos solo admin

---

## Ubicacion del modulo

Archivos principales:

- `server/apps/inventory/models/raw_material.py`
- `server/apps/inventory/serializers/general_serializers.py`
- `server/apps/inventory/views/general_views.py`
- `server/apps/inventory/urls.py`

Referencias de patron:

- `server/apps/products/views/products_views.py`
- `server/apps/products/serializers/products_serializer.py`

---

## Datos de la entidad

Modelo `RawMaterial`:

- `id`
- `name`
- `stock`
- `min_stock`
- `measure_unit` (FK)
- `category` (FK)

Comportamiento base:

- hereda `BaseModel` (`state`, `deleted_date`, etc.)

---

## Resumen de lo implementado

## 1) Serializers

En `server/apps/inventory/serializers/general_serializers.py`:

- `RawMaterialSerializer` (write):
  - recibe `measure_unit` y `category` por PK
  - valida categoria activa de tipo `RAW_MATERIAL`
- `RawMaterialListSerializer` (read):
  - devuelve `measure_unit` anidado
  - devuelve `category` anidada

Tambien se exportan en:

- `server/apps/inventory/serializers/__init__.py`

---

## 2) ViewSet

En `server/apps/inventory/views/general_views.py`:

- `RawMaterialViewSet(ErrorResponseMixin, ModelViewSet)`
- `permission_classes = [IsAdmin]`
- `serializer_class = RawMaterialSerializer`
- `list_serializer_class = RawMaterialListSerializer`
- `get_serializer_class()`:
  - `list/retrieve` -> list serializer
  - resto -> write serializer
- `get_queryset()`:
  - `state=True`
  - `select_related("measure_unit", "category")`
- `destroy()`:
  - soft delete (`state=False`, `deleted_date=timezone.localdate()`)

---

## 3) URLs

En `server/apps/inventory/urls.py`:

- se mantuvo `measure-units/` para listado simple
- se agrego router para `raw-materials` con `RawMaterialViewSet`

Endpoints principales:

- `GET    /inventory/raw-materials/`
- `POST   /inventory/raw-materials/`
- `GET    /inventory/raw-materials/{id}/`
- `PUT    /inventory/raw-materials/{id}/`
- `DELETE /inventory/raw-materials/{id}/` (soft delete)

---

## Validaciones y permisos

- acceso CRUD restringido a admin
- validacion de relaciones activas en serializer
- validacion de categoria de tipo `RAW_MATERIAL`

---

## Verificacion recomendada

1. `python manage.py check`
2. crear materia prima
3. listar materias primas
4. detalle por id
5. actualizar materia prima
6. eliminar y confirmar soft delete

---

## Nota importante para diagramas UML (Control/CTRL)

Si se requiere documentacion academica (diagrama de comunicacion, secuencia, analisis de clases), puede haber un problema de trazabilidad:

- `ModelViewSet` ejecuta internamente metodos como `create`, `update`, `list`, `retrieve`
- si no se sobreescriben, no quedan funciones explicitas para referenciar en el diagrama

Recomendacion para diagramas:

- mantener `ModelViewSet` por simplicidad
- sobrescribir explicitamente (aunque sea con logica basica) los metodos clave:
  - `create`
  - `update`
  - `list` (opcional)
  - `retrieve` (opcional)
  - `destroy` (ya esta sobrescrito por soft delete)

Esto facilita mostrar el elemento de control (`CTRL`) en backend y responder trazabilidad en revision docente.

---

## Criterio de finalizacion

Backend de materias primas se considera completo cuando:

- serializers list/write estan definidos
- viewset CRUD esta configurado
- urls del router estan activas
- permisos admin-only confirmados
- soft delete funcional
- metodos sobrescritos si se requiere soporte explicito para UML
