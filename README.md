# Porteños FASTFOOD

Proyecto fullstack compuesto por un backend en Django y un frontend en Next.js. Incluye uso de Redis para ciertos servicios.

---

## Requisitos

Antes de ejecutar el proyecto, es necesario contar con lo siguiente:

### Backend

* Python
* pip
* venv (entornos virtuales)
* Redis (se recomienda usar Docker)

### Frontend

* Node.js
* pnpm (recomendado para evitar conflictos con otros gestores de paquetes)

---

## Inicialización del proyecto

Una vez clonado el repositorio, seguir los pasos en el siguiente orden.

---

## Backend

1. Ir a la carpeta del servidor:

```bash
cd server
```

2. Crear el entorno virtual:

```bash
python -m venv venv
```

3. Activar el entorno virtual:

En Windows:

```bash
venv\Scripts\activate
```

En Linux o Mac:

```bash
source venv/bin/activate
```

4. Instalar las dependencias:

```bash
pip install -r requirements.txt
```

5. Configurar variables de entorno:

* Renombrar el archivo `.env.example` a `.env`
* Completar las variables necesarias (API keys, secrets, etc.)

Estas credenciales no se encuentran en el repositorio y deben ser proporcionadas de forma privada.

6. Ejecutar el servidor:

```bash
python manage.py runserver
```

Si todo está correcto, el backend debería estar funcionando.

---

## Frontend

1. Abrir una nueva terminal y dirigirse a la carpeta del cliente:

```bash
cd client
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Configurar variables de entorno:

* Renombrar `.env.local.example` a `.env.local`
* Completar las variables necesarias

Estas variables también deben ser proporcionadas de forma privada.

4. Ejecutar el frontend:

```bash
pnpm dev
```

---

## Redis

Se recomienda ejecutar Redis utilizando Docker:

```bash
docker run -d -p 6379:6379 redis
```

---

## Variables sensibles

No subir al repositorio archivos como:

* `.env`
* `.env.local`

Usar archivos `.example` como plantilla y compartir los valores reales por medios privados.

---

## Notas

* Asegurarse de que Redis esté corriendo antes de iniciar el backend.
* Utilizar entornos virtuales para el backend.
* Usar pnpm para mantener consistencia en el frontend.
