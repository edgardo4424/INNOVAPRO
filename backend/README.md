Backend (API y lógica del servidor)
📍 Ubicado en backend/src/
📌 Encargado de manejar peticiones, autenticación, base de datos y lógica de negocio.

config/ → Configuraciones globales
📌 Conexión a la base de datos, configuración de Express, variables de entorno.
📄 db.js → Configuración de la base de datos (MySQL).

controllers/ → Lógica de negocio (CRUD y operaciones avanzadas).
📄 clientesControllers.js → Manejo de clienetes (etc.).

models/ → Definición de la base de datos y ORM.
📄 clientes.js → Modelo de clientes.

routes/ → Definición de endpoints.
📄 index.js → Rutas generales.

middleware/ → Middlewares de seguridad y logs.
📄 authMiddleware.js → Validación de token JWT.

tests/ → Pruebas unitarias e integración.
