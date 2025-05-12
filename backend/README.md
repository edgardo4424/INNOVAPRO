# INNOVA PRO+ – Backend

Este es el backend del ERP **INNOVA PRO+**, desarrollado en **Node.js + Express + Sequelize**, con una arquitectura profesional basada en **Clean Architecture** y principios **SOLID**, ideal para escalar y mantener más de 20 módulos empresariales.

---

## 🚀 Inicio rápido

### 1. Clona el proyecto y entra al backend
```bash
cd backend
```

### 2. Instala dependencias
```bash
npm install
```

### 3. Configura el entorno
Copia y adapta el archivo `.env`:
```
PORT=3001
DB_HOST=localhost
DB_NAME=innova_db
DB_USER=root
DB_PASSWORD=123456
```

### 4. Ejecuta el servidor
```bash
npm start
```

---

## 🧠 Arquitectura

```bash
backend/src/
├── modules/               # Cada módulo es independiente (clientes, obras, tareas...)
│   └── tareas/            # Ejemplo de módulo
│       ├── application/   # Casos de uso (negocio puro)
│       ├── domain/        # Entidades y contratos (interfaces)
│       ├── infrastructure/# Modelos Sequelize, repositorios, servicios externos
│       └── interfaces/    # Rutas y controladores
├── shared/                # Utilidades, middlewares, helpers comunes
├── config/                # Configuraciones globales (DB, env...)
└── index.js               # Punto de entrada del backend
```

---

## ✅ Características

- Estructura modular, escalable y desacoplada
- Lógica de negocio en `application/useCases`
- Validaciones centralizadas por entidad
- Repositorios desacoplados (puedes cambiar Sequelize sin tocar dominio)
- Soporte para pruebas automatizadas con **Jest**

---

## 🔬 Pruebas

Ejecuta todas las pruebas:
```bash
npm test
```

Ejecuta una prueba específica:
```bash
npm test -- src/modules/clientes/tests/crearCliente.test.js
```

---

## 🧪 Ejemplo: estructura de un módulo
```bash
modules/clientes/
├── application/
│   └── useCases/
├── domain/
│   ├── entities/
│   └── repositories/
├── infrastructure/
│   ├── models/
│   └── repositories/
├── interfaces/
│   ├── controllers/
│   └── routes/
└── tests/
```

---

## 💡 Recomendaciones de desarrollo

- Toda lógica debe ir en `useCases/`
- Nunca accedas a Sequelize fuera de `infrastructure/repositories`
- Valida los datos en la capa de entidad (`domain/entities`)
- Usa `shared/` para middlewares reutilizables, mensajes o utilidades

---

## 🏆 Autor refactorización
**Andrés Edgardo Martínez Salvatierra**  
Refactor y automatización completa del backend con arquitectura limpia, modular y testeable para INNOVA PRO+.