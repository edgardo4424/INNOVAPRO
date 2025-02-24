Backend (API y lógica del servidor)
📍 Ubicado en backend/src/
📌 Encargado de manejar peticiones, autenticación, base de datos y lógica de negocio.

config/ → Configuraciones globales
📌 Conexión a la base de datos, configuración de Express, variables de entorno.
📄 db.js → Configuración de la base de datos (MySQL, PostgreSQL, MongoDB).
📄 server.js → Configuración general del servidor.

controllers/ → Lógica de negocio (CRUD y operaciones avanzadas).
📄 UserController.js → Manejo de usuarios (registro, login, etc.).
📄 OrderController.js → Manejo de pedidos.

models/ → Definición de la base de datos y ORM.
📄 User.js → Modelo de usuario.
📄 Product.js → Modelo de productos.

routes/ → Definición de endpoints.
📄 userRoutes.js → Rutas relacionadas con usuarios.
📄 orderRoutes.js → Rutas de pedidos.

services/ → Lógica reutilizable.
📄 authService.js → Funciones de autenticación (JWT, bcrypt).
📄 emailService.js → Funciones para envío de correos.

middleware/ → Middlewares de seguridad y logs.
📄 authMiddleware.js → Validación de token JWT.

tests/ → Pruebas unitarias e integración.

# 📌 Configuración de Sequelize y Base de Datos en INNOVA PRO+

## 🚀 1. Configuración de la Base de Datos
Este backend usa **Sequelize** como ORM y está configurado para conectar con PostgreSQL.  
Las credenciales están en un archivo **`.env`** (que **NO se debe subir a Git**).  

Ejemplo de `.env`:
```ini
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tu_base_de_datos
DB_HOST=localhost
DB_DIALECT=postgres

2. Estructura de Archivos

config/database.js → Contiene la conexión a la base de datos.
models/index.js → Carga automáticamente los modelos y establece relaciones.
migrations/ → Carpeta donde se guardan las migraciones.
seeders/ → Carpeta donde se guardan los datos de prueba (si los hay).

3. Comandos Útiles con Sequelize
🛠️ Verificar conexión
Para probar si Sequelize se conecta correctamente:

node -e "require('./models').sequelize.authenticate().then(() => console.log('🔥 Conexión exitosa')).catch(err => console.error('❌ Error:', err));"

Crear una nueva migración
Si necesitas agregar una nueva tabla:

npx sequelize migration:generate --name nombre_migracion

Esto generará un archivo en migrations/, donde puedes definir las columnas.

Ejecutar migraciones
Para aplicar todas las migraciones pendientes:

npx sequelize db:migrate

Revertir la última migración
Si hiciste algo mal y quieres deshacerlo:

npx sequelize db:migrate:undo

Borrar TODAS las tablas de la base de datos
Si necesitas limpiar todo:

node -e "require('./config/database').dropAllTables();"

Ver el estado de las migraciones
Para ver qué migraciones se han aplicado:

npx sequelize db:migrate:status

4. Notas Importantes
Nunca edites las migraciones ya aplicadas, crea una nueva en su lugar.
Si cambias el .env, reinicia la terminal o ejecuta:

export $(grep -v '^#' .env | xargs)  # Linux/Mac
set -a && source .env && set +a      # Windows con Git Bash

La base de datos debe estar encendida y accesible para que Sequelize funcione.

# 🏗️ Módulo: Registro de Tareas - Oficina Técnica

Este módulo permite a los usuarios del área comercial registrar tareas dirigidas a **Oficina Técnica**.  

## 📌 **Tablas de la Base de Datos**

### 1️⃣ **Tabla: `tareas` (Registro de Tareas)**
| Campo | Tipo | Descripción |
|--------|----------------|-------------|
| `id` | INT (PK) AUTO_INCREMENT | ID único de la tarea |
| `comercial_id` | INT (FK → usuarios) | Usuario que solicita la tarea |
| `empresa_proveedora_id` | INT (FK → empresas) | Empresa proveedora para la tarea |
| `cliente_id` | INT (FK → clientes) | Cliente relacionado con la tarea |
| `obra_id` | INT (FK → obras) | Obra donde se realiza la tarea |
| `ubicacion_obra` | VARCHAR(255) | Se obtiene automáticamente de la obra |
| `tipo_tarea` | ENUM('Apoyo Técnico', 'Apoyo Administrativo', 'Pase de Pedido', 'Servicios Adicionales', 'Tarea Interna') | Tipo de tarea |
| `nivel_urgencia` | ENUM('Baja', 'Media', 'Alta', 'Crítica') | Nivel de urgencia |
| `descripcion` | TEXT | Detalle de la tarea solicitada |
| `estado` | ENUM('Pendiente', 'En Proceso', 'Completada', 'Cancelada') | Estado de la tarea |
| `fecha_creacion` | TIMESTAMP DEFAULT CURRENT_TIMESTAMP | Fecha en que se registró la tarea |

---

### 2️⃣ **Tabla: `usuarios` (Comerciales)**
| Campo | Tipo | Descripción |
|--------|--------------|-------------|
| `id` | INT (PK) AUTO_INCREMENT | ID del usuario |
| `nombre` | VARCHAR(100) | Nombre del usuario |
| `rol` | ENUM('Gerencia', 'Ventas', 'Oficina Técnica', 'Almacén', 'Administración', 'Clientes') | Rol del usuario |
| `email` | VARCHAR(100) UNIQUE | Correo del usuario |
| `password` | VARCHAR(255) | Contraseña encriptada |

### 3️⃣ **Tabla: `empresas` (Empresas Proveedoras y Clientes)**
| Campo | Tipo | Descripción |
|--------|--------------|-------------|
| `id` | INT (PK) AUTO_INCREMENT | ID de la empresa |
| `nombre` | VARCHAR(255) | Nombre de la empresa |
| `tipo` | ENUM('Proveedor', 'Cliente') | Tipo de empresa |
| `contacto` | VARCHAR(100) | Nombre del contacto principal |
| `telefono` | VARCHAR(20) | Teléfono de contacto |
| `email` | VARCHAR(100) | Correo de contacto |

### 4️⃣ **Tabla: `obras` (Proyectos en ejecución)**
| Campo | Tipo | Descripción |
|--------|--------------|-------------|
| `id` | INT (PK) AUTO_INCREMENT | ID de la obra |
| `nombre` | VARCHAR(255) | Nombre de la obra |
| `cliente_id` | INT (FK → clientes) | Cliente que contrató la obra |
| `ubicacion` | VARCHAR(255) | Dirección o coordenadas de la obra |

---

## 🔗 **Relaciones Clave**
- **`tareas.comercial_id`** → Se vincula con **`usuarios.id`** (solo comerciales pueden registrar tareas).  
- **`tareas.empresa_proveedora_id`** → Se vincula con **`empresas.id`** (solo empresas registradas en Innova pueden ser proveedoras).  
- **`tareas.cliente_id`** → Se vincula con **`empresas.id`** (los clientes también se almacenan en `empresas`).  
- **`tareas.obra_id`** → Se vincula con **`obras.id`**, y la **`ubicacion_obra`** se obtiene automáticamente desde la tabla `obras`.  

---

  
