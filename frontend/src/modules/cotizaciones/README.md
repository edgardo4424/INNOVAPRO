# Módulo de Cotizaciones - INNOVA PRO+

Este módulo permite crear cotizaciones de forma dinámica mediante un flujo tipo **wizard** dividido por pasos, validado en cada etapa, conectado al backend, y con exportación a PDF profesional.

---

## ⚙️ Estructura General

```
cotizaciones/
├── assets/              # Imágenes y fondos para PDF
├── components/          # Componentes de los pasos del wizard
├── data/                # Datos estáticos (selects, opciones) usado principalmente para pruebas.
├── hooks/               # Custom hooks: estado, despiece, transporte, etc.
├── pages/               # Registro de cotización principal
├── pdf/                 # Generación del PDF de cotización
├── services/            # Conexiones a la API
├── styles/              # Estilos CSS del wizard
├── utils/               # Funciones auxiliares
└── validaciones/        # Validaciones por paso del wizard
```

---

## 🔄 Flujo del Wizard

### Paso 1: Contacto

* Selección de cliente, obra, contacto y filial.
* Validaciones: debe seleccionarse todo antes de continuar.

### Paso 2: Uso

* Elección del "uso" del sistema (Ej: Andamio de Trabajo, Puntales).
* Tipo de cotización: Alquiler o Venta.
* En caso se elija "Alquiler" se debe especificar los días de alquiler.

### Paso 3: Atributos

* Atributos cargados desde backend según uso elegido.
* Campos dinámicos por tipo (select, número, etc.).

### Paso 4: Confirmación

* Bloques de validación: pernos, transporte, instalación, descuento.
* Requiere responder todo antes de continuar.
* Se genera el despiece y se muestra resumen completo con totales.

### Paso 5: Final

* Revisión total antes de guardar.
* Envió al backend y redirección a pantalla de éxito.

---

## 📝 Validaciones

Ubicadas en `/validaciones/`:

* `validarCotizacion.js` → pasos 1 a 3.
* `validarPasoConfirmacion.js` → paso 4, asegura que se haya respondido todo.

Todas las validaciones retornan `{ ok: boolean, errores: { campo: mensaje } }`.

---

## ⚖️ Hooks personalizados

Ubicados en `/hooks/`:

* `useWizardCotizacion.jsx` → Estado global del wizard.
* `useGenerarDespiece.js` → Llama a la API para generar despiece.
* `useCalculoTransporte.js` → Lógica para calcular transporte por peso y zona.
* `useZonasCotizacion.js` → Manejo de zonas con equipos separados.

---

## 📄 Generación de PDF

* Usa `jspdf` + `jspdf-autotable`.
* Fondo profesional incluido desde `assets/PlantillaIMG.png`.
* Estructurado al 100% de acuerdo a las plantillas del Grupo Innova

---

## 🧱 Cálculo y Presentación del Despiece

### 🔁 Hook: `useDespieceManual.js`

Ubicado en `hooks/useDespieceManual.js`. Permite:

- Agregar piezas manualmente desde varios puntos del flujo.
- Calcular peso, totales y precios según tipo de cotización (Alquiler/Venta).
- Eliminar piezas del despiece de forma individual.
- Devolver siempre un `resumen` actualizado que se suma o resta dinámicamente.

🔧 Se usa en:
- Paso 2: Cotización por escuadras (modo "Items")
- Paso 4: Agregar piezas adicionales al despiece
- OT: futura funcionalidad de despieces manuales

La función `onResumenChange` notifica automáticamente al `formData` con:
```js
{
  nuevoDespiece: [...],
  resumen: { total_piezas, peso_total_kg, ... }
}

---

## 🚀 Features destacadas

* 100% validado paso a paso.
* Flujo fluido, sin fallos al avanzar.
* Atributos dinámicos según uso.
* Revisión final profesional.
* PDF con fondo corporativo.

---

## 📊 Roadmap

* [x] Validación inteligente en todos los pasos.
* [x] Manejo de zonas.
* [x] Precio editable por perno.
* [x] Cálculo automático de transporte.
* [x] Previsualización de totales.
* [x] Descuento aplicado al final.
* [ ] Exportación de varias cotizaciones a Excel.
* [ ] Historial de revisiones de cotizaciones.
* [ ] Firma digital.

---

## 🎓 Para nuevos desarrolladores

* Empezar desde `pages/RegistrarCotizacionWizard.jsx`.
* Usar `useWizardCotizacion` para acceder al estado global.
* Revisar `validaciones/` antes de agregar nuevos campos.
* Siempre separar lógica en hooks o utils.

---

> ✅ Este módulo está pensado para escalar y mantenerse limpio. Si agregas funcionalidades nuevas, sigue la arquitectura por capas, separa lógica y mantén el estilo profesional.