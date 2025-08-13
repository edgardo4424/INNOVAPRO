import { USOS_INSTALABLES } from "../constants/usos";

// Este archivo contiene la validación avanzada y condicional de campos relacionados con:
// Colgantes
// Pernos
// Transporte
// Instalación
// Descuento máximo

export default function validarPasoConfirmacion(formData) {
  const errores = {};

  const esColgante = formData.uso.id === 8;

  // Validación especial para Colgantes
  if (esColgante) {
    if (!formData.uso.detalles_colgantes.cantidad_colgantes || isNaN(formData.uso.detalles_colgantes.cantidad_colgantes )) {
      errores.tarifa_colgante = "Debes ingresar una tarifa válida para colgantes.";
    }

    const cantidad = parseInt(formData.uso.zonas?.[0]?.atributos_formulario?.[0]?.cantidad || "0");
    if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
      errores.cantidad_colgante = "La cantidad de colgantes debe ser mayor a 0.";
    }

    return errores; // Nos saltamos el resto de validaciones para colgantes
  }

  // Validación PERNOS
  if (formData.atributos_opcionales.pernos.tiene_pernos_disponibles && typeof formData.atributos_opcionales.pernos.tiene_pernos !== "boolean") {
    errores.tiene_pernos = "Debes indicar si deseas incluir los pernos de expansión.";
  }

  if (formData.atributos_opcionales.pernos.tiene_pernos) {
    const perno = formData.uso.despiece?.find(p => p.esPerno);
    if (!perno || !perno.precio_u_venta_soles || isNaN(perno.precio_u_venta_soles)) {
      errores.precio_pernos = "Debes ingresar un precio válido para los pernos.";
    }
  }

  // Validación TRANSPORTE
  if (formData.atributos_opcionales.transporte.tiene_transporte === undefined || formData.atributos_opcionales.transporte.tiene_transporte === "") {
    errores.tiene_transporte = "Debes indicar si deseas incluir transporte.";
  }

  if (formData.atributos_opcionales.transporte.tiene_transporte) {
    if (!formData.atributos_opcionales.transporte.tipo_transporte) {
      errores.tipo_transporte = "Selecciona el tipo de transporte.";
    }

    const precios = [
      formData.atributos_opcionales.transporte.costo_tarifas_transporte,
      formData.atributos_opcionales.transporte.costo_distrito_transporte,
      formData.atributos_opcionales.transporte.costo_pernocte_transporte
    ];

    if (precios.some(p => p === "" || isNaN(p))) {
      errores.costo_transporte = "Todos los precios de transporte deben ser válidos.";
    }
  }

  // Validación INSTALACIÓN (solo si el uso lo permite)
  if (USOS_INSTALABLES.includes(formData.uso.id)){
    if (!formData.atributos_opcionales.instalacion.tipo_instalacion || formData.atributos_opcionales.instalacion.tipo_instalacion === "") {
      errores.instalacion = "Debes indicar si deseas incluir instalación.";
    }

    if (formData.atributos_opcionales.instalacion.tipo_instalacion && formData.atributos_opcionales.instalacion.tipo_instalacion !== "NINGUNA") {
      if (formData.atributos_opcionales.tipo_instalacion === "COMPLETA" && !formData.atributos_opcionales.instalacion.precio_instalacion_completa) {
        errores.instalacion = "Debes ingresar el precio de instalación completa.";
      }
      if (formData.atributos_opcionales.instalacion.tipo_instalacion === "PARCIAL") {
        if (!formData.atributos_opcionales.instalacion.precio_instalacion_completa || !formData.atributos_opcionales.instalacion.precio_instalacion_parcial) {
          errores.instalacion = "Debes ingresar precios válidos para instalación parcial y completa.";
        }
      }
    }
  }

  // Validación DESCUENTO
  if (formData.cotizacion.descuento > 50) {
    errores.descuento = "El descuento no puede superar el 50%.";
  }

  return errores;
}