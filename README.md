# 📦 Backend - ERP API con Clean Architecture

## 🛠️ Tecnologías utilizadas

- **Node.js**
- **Express**
- **MySQL**
- **Sequelize ORM**
- **Zod (validaciones)**
- **JWT (autenticación)**
- **dotenv (variables de entorno)**

---

## 🚀 Instalación y configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/luisgl97/prueba-clean-architecture.git
cd prueba-clean-architecture
```

### 2. Configurar variables de entorno
Renombrar el archivo **`.env.example`** a **`.env`** y completar los valores requeridos:

```env
DB_USER=root
DB_PASSWORD=root
DB_NAME=erp_db
DB_HOST=localhost
DB_DIALECT=mysql

JWT_SECRET="mi-clave-secreta"
```

### 3. Crear la base de datos
Asegúrate de **crear la base de datos manualmente** en tu motor MySQL con el nombre definido en `DB_NAME`, por ejemplo:
```sql
CREATE DATABASE erp_db;
```

---

### 4. Instalar dependencias del proyecto
```bash
npm install
```

### 5. Ejecutar migraciones de la base de datos
```bash
npx sequelize-cli db:migrate
```

### 6. Ejecutar seeders (datos iniciales)
```bash
npm run seed
```
Esto insertará los datos necesarios como roles, módulos, usuarios y clientes.

---

## ▶️ Ejecución del servidor

Para iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

El backend estará disponible en `http://localhost:3000`

---

## 🗂️ Estructura del proyecto

```
src/
├── controllers/         # Adaptadores de entrada (Express)
├── routes/              # Endpoints
├── use-cases/           # Casos de uso (lógica de aplicación)
├── repositories/        # Acceso a datos (Sequelize)
├── models/              # Modelos ORM Sequelize
├── middlewares/         # Autenticación, validaciones, errores
├── utils/               # Helpers (JWT, encriptación, etc.)
├── config/              # Configuración de BD y entorno
└── seeders/             # Datos iniciales (si se usaran manualmente)
```

---

## 🧱 Modelo de datos visual

![Modelo de datos](Modelo-Datos-Gestion-Empleados.png)

---

## 💬 Notas adicionales

- Si ocurre un error al ejecutar los seeders, asegúrate de que la base de datos esté limpia.
- Para desarrollo, el seeder borra datos anteriores y reinicia IDs.


