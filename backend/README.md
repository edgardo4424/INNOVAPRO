# INNOVA PRO+ - Refactorización Backend

## 📊 Contexto
Este cambio corresponde a una **refactorización completa** del backend del sistema **INNOVA PRO+**, orientada a mejorar la escalabilidad, mantenibilidad y claridad del código. Se implementó:

- Arquitectura por **módulos independientes**
- **Clean Architecture** + arquitectura en capas
- Principios **SOLID**
- **Tests automatizados** con `Jest`

---

## 🌍 Estructura final

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
        entities/
          Cliente.js
        repositories/
          ClienteRepository.js
      infrastructure/
        models/
          clienteModel.js
        repositories/
          sequelizeClienteRepository.js
        services/
          entidadService.js
      interfaces/
        controllers/
          clienteController.js
        routes/
          clienteRoutes.js
      tests/
        crearCliente.test.js
        obtenerClientes.test.js
        actualizarCliente.test.js
        eliminarCliente.test.js
```

---

## 🚀 Características implementadas

- Separación clara entre capas: **aplicación**, **dominio**, **infraestructura** e **interfaces**
- Repositorios desacoplados de Sequelize
- Validador inteligente para creación y edición de entidades
- Cobertura completa de pruebas para:
  - Crear cliente
  - Obtener clientes
  - Actualizar cliente
  - Eliminar cliente

---

## 🔧 Pruebas automatizadas

Las pruebas se ejecutan con:

```bash
npm test
```

Todas las pruebas se encuentran en:
```bash
/src/modules/clientes/tests/
```

Puedes ejecutar una prueba específica así:
```bash
npm test -- src/modules/clientes/tests/actualizarCliente.test.js
```

---

## 👀 Cómo probar esta rama en tu entorno local

### 1. Clona el repo y posicionate en la rama
```bash
git clone git@github.com:edgardo4424/INNOVAPRO.git
cd INNOVAPRO
```

### 2. Cambia a la rama de refactor
```bash
git checkout refactor/backend
```

### 3. Instala dependencias
```bash
cd backend
npm install
```

### 4. Ejecuta las pruebas
```bash
npm test
```

---

## 💡 Recomendaciones
- Ejecuta `npm test` antes de hacer nuevos cambios
- Usa los `useCases` para toda lógica de negocio
- Evita escribir queries Sequelize fuera de `infrastructure/repositories`
- Si agregas nuevos campos, actualiza también el `validador`

---

## 🏆 Autor refactorización
**Andrés Edgardo Martínez Salvatierra**  
Refactor y automatización completa del módulo `clientes` con arquitectura escalable y testable.