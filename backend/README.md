# INNOVA PRO+ Backend - Refactorización y Testeo Automatizado

Este README documenta todo el trabajo realizado en la rama `refactor/backend` de INNOVA PRO+, incluyendo la refactorización total a Clean Architecture por módulos y la implementación de pruebas automáticas con Jest.

---

## 🚀 Refactorización completa del backend a Clean Architecture

### 🔧 Antes:
- Arquitectura semi-monolítica
- Modelos, rutas y controladores mezclados
- Escasa separación de responsabilidades

### ✅ Ahora:
Estructura escalable basada en **módulos por dominio**, con principios **SOLID** y **Clean Architecture**:

```
backend/src/
  modules/
    clientes/
      application/
        useCases/
          crearCliente.js
          obtenerClientes.js
          actualizarCliente.js
          eliminarCliente.js
      domain/
        entities/Cliente.js
        repositories/ClienteRepository.js
      infrastructure/
        models/clienteModel.js
        repositories/sequelizeClienteRepository.js
        services/entidadService.js
      interfaces/
        controllers/clienteController.js
        routes/clienteRoutes.js
      tests/
        crearCliente.test.js
        obtenerClientes.test.js
        actualizarCliente.test.js
        eliminarCliente.test.js
```

### 🌐 Configuración global
- `config/db.js` para conexión Sequelize
- `models/index.js` para cargar todos los modelos y asociaciones
- `shared/` para utils, constantes, middlewares comunes

---

## 📈 Implementación de Tests con Jest

Se escribieron tests unitarios para validar la lógica del módulo **Clientes**, cubriendo:

| Test | Descripción |
|------|-------------|
| `crearCliente.test.js` | Verifica creación exitosa y validaciones |
| `obtenerClientes.test.js` | Verifica retorno de array de clientes |
| `actualizarCliente.test.js` | Verifica edición correcta de un cliente existente |
| `eliminarCliente.test.js` | Verifica eliminación de un cliente por ID |

### 🎮 Validaciones incluidas:
- Campos obligatorios para creación
- Detección de duplicados (`ruc`, `email`, `dni`)
- Validación inteligente según `tipo` de cliente (jurídico/natural)

### ⚖️ Dependencias usadas:
```bash
npm install --save-dev jest supertest
```

---

## 🏐 Probar en tu entorno local

### 🔄 Clona y cambia a la rama de refactor:
```bash
git clone https://github.com/TU_ORG/innova-pro-backend.git
cd innova-pro-backend
git checkout refactor/backend
```

### ⚖️ Configura tus variables:
Crea un archivo `.env` con tu configuración local de MySQL:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_clave
DB_NAME=innovapro
```

### ⚙️ Ejecuta las migraciones y datos iniciales si fuera necesario
(Según tu configuración de Sequelize CLI o init script)

### 📚 Corre los tests:
```bash
npm install
npm test
```

### ✅ Esperado:
```
PASS ✅ crearCliente.test.js
PASS ✅ obtenerClientes.test.js
PASS ✅ actualizarCliente.test.js
PASS ✅ eliminarCliente.test.js
```

---

## 🔹 Recomendaciones para nuevos colaboradores

- Seguir la arquitectura modular por dominio
- Escribir pruebas al crear nuevos useCases
- No trabajar directamente en `main`, usar ramas por funcionalidad
- Validar con `npm test` antes de hacer push

---

## 🚀 Próximos pasos

- Refactorizar y testear los módulos de `usuarios`, `obras`, `cotizaciones`
- Integrar CI/CD con GitHub Actions para correr test en cada PR
- Implementar cobertura con `jest --coverage`

---

**INNOVA PRO+ v1.1.1 - Backend Refactor & Test Ready 🚀**

Mantenido por: [@andresinnova](https://github.com/edgardo4424/)