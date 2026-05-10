# Guia de Implementacion Backend - Proveedores (Staplers)

## Objetivo

Implementar el modulo de proveedores en `apps/purchases` siguiendo el mismo patron del proyecto (apps/products e inventory/raw_material):

- CRUD con `ModelViewSet`
- `serializer_class` para escritura (create/update)
- `list_serializer_class` para lectura (list/retrieve)
- soft delete en `destroy`
- acceso solo para administrador

Supuestos:

- el modelo `Supplier` ya existe
- migraciones ya aplicadas

---

## Ubicacion del modulo

Trabajar en:

- `server/apps/purchases/models/`
- `server/apps/purchases/serializers/`
- `server/apps/purchases/views/`
- `server/apps/purchases/urls.py`

Referencias:

- `server/apps/products/views/products_views.py`
- `server/apps/products/serializers/products_serializer.py`
- `server/apps/inventory/views/general_views.py`

---

## Contrato de datos (backend)

Revisar modelo final en:

- `server/apps/purchases/models/supplier.py`

Campos esperados para API:

- `id`
- `business_name`
- `contact_name`
- `phone`
- `email`

Mantener comportamiento de `BaseModel` (`state`, `deleted_date`, etc.).

---

## Pasos de implementacion

## 1) Serializers

Crear (si no existe):

- `server/apps/purchases/serializers/supplier_serializers.py`

Implementar:

- `SupplierSerializer` (escritura)
- `SupplierListSerializer` (lectura)

Exportar en:

- `server/apps/purchases/serializers/__init__.py`

---

## 2) ViewSet

Crear (si no existe):

- `server/apps/purchases/views/supplier_views.py`

Implementar `SupplierViewSet` con:

- `ErrorResponseMixin`
- `ModelViewSet`
- `permission_classes = [IsAdmin]`
- `serializer_class = SupplierSerializer`
- `list_serializer_class = SupplierListSerializer`

Metodos base:

1. `get_serializer_class(self)`
   - `list/retrieve` -> `list_serializer_class`
   - resto -> `serializer_class`

2. `get_queryset(self)`
   - `state=True`
   - ordenar por `business_name` si se desea

3. `destroy(self, request, pk=None)`
   - soft delete:
     - `instance.state = False`
     - `instance.deleted_date = timezone.localdate()`
     - `instance.save()`

Exportar en:

- `server/apps/purchases/views/__init__.py`

---

## 3) URLs

En:

- `server/apps/purchases/urls.py`

Configurar router:

- `DefaultRouter()`
- registrar `SupplierViewSet` bajo `suppliers`

Endpoints esperados:

- `GET    /purchases/suppliers/`
- `POST   /purchases/suppliers/`
- `GET    /purchases/suppliers/{id}/`
- `PUT    /purchases/suppliers/{id}/`
- `DELETE /purchases/suppliers/{id}/` (soft delete)

---

## 4) Permisos

Todo el CRUD de proveedores debe quedar solo para admin:

- `IsAdmin`

---

## 5) Validaciones y errores

Validar en serializers:

- campos obligatorios
- longitudes maximas
- formato de email

Usar respuestas de error estandar con `ErrorResponseMixin`.

---

## 6) Verificacion

Ejecutar:

- `python manage.py check`

Probar manualmente:

- crear proveedor
- listar proveedores
- detalle por id
- actualizar proveedor
- eliminar proveedor (soft delete)

---

## 7) Nota para diagramas UML (muy importante)

Para documentacion academica (diagrama de comunicacion, secuencia, analisis de clases), en backend suele modelarse un elemento de control (`Control`/`CTRL`) a partir de funciones explicitas del view.

Como `ModelViewSet` resuelve internamente `create`, `update`, `retrieve`, etc., esas funciones no aparecen de forma evidente si no se sobreescriben. Esto puede dificultar justificar el diagrama frente al docente.

Recomendacion:

- mantener `ModelViewSet` (por simplicidad y consistencia)
- **sobrescribir explicitamente** al menos:
  - `create`
  - `update`
  - `retrieve` (opcional)
  - `list` (opcional)
  - `destroy` (ya se sobrescribe por soft delete)

La sobrescritura puede ser basica (misma logica estandar), pero deja visible el flujo para los diagramas y trazabilidad.

---

## Criterio de finalizacion

La parte backend queda completa cuando:

- serializers implementados y exportados
- viewset implementado y exportado
- urls configuradas
- permisos admin-only
- soft delete funcional
- metodos visibles (si se requiere para UML)
