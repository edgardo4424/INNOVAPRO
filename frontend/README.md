# INNOVA PRO+ – Frontend

Este proyecto representa el frontend del sistema ERP **INNOVA PRO+**, desarrollado con React + Vite bajo una arquitectura modular y limpia (Clean Architecture), ideal para escalar a más de 20 módulos empresariales.

---

## 🚀 Inicio rápido

### 1. Clonar el repositorio y acceder al frontend
```bash
cd frontend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Crear archivo `.env`
```bash
cp .env.example .env
```
Asegúrate de configurar la variable:
```
VITE_API_URL=http://localhost:3001/api
```

### 4. Levantar el entorno de desarrollo
```bash
npm run dev
```

---

## 🏗️ Estructura del proyecto

```bash
src/
├── context/                # Contextos globales como AuthContext
├── modules/               # Módulos desacoplados (clientes, obras, tareas, etc.)
│   └── centroAtencion/    # Ejemplo: módulo completo con pages, hooks, components
├── routes/                # Definición de rutas protegidas y públicas
├── utils/                 # Validaciones y funciones reutilizables
├── App.jsx                # Configuración principal de rutas
├── config.jsx             # Roles, rutas protegidas, layout global
├── main.jsx               # Punto de entrada React + montaje DOM
```

Cada módulo dentro de `modules/` contiene su propia estructura desacoplada:

```bash
modules/miModulo/
├── components/
├── forms/
├── hooks/
├── pages/
├── services/
├── validaciones/
```

---

## 📦 Build para producción
```bash
npm run build
```
Esto generará la carpeta `dist/` lista para ser desplegada en cPanel, Vercel o cualquier servidor.

---

## 🧠 Buenas prácticas
- Cada módulo debe tener su lógica, vista y validaciones separadas.
- No repetir lógica en más de un lugar, usar hooks reutilizables.
- Usar `utils/validaciones.js` para validaciones comunes.
- Mantener los estilos en componentes modulares o scoped.

---

## ✨ Autor
**Andrés Edgardo Martínez S.** – Desarrollador de INNOVA PRO+

---

> Este frontend forma parte del ecosistema completo **INNOVA PRO+**, diseñado para mejorar la eficiencia operativa en empresas del sector construcción.