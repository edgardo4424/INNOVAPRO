import { USOS_INSTALABLES } from "../constants/usos";

export default function validarPasoConfirmacion(formData) {
  const errores = {};

  // 🔹 Validación PERNOS
  if (formData.tiene_pernos_disponibles && typeof formData.tiene_pernos !== "boolean") {
    errores.tiene_pernos = "Debes indicar si deseas incluir los pernos de expansión.";
  }

  if (formData.tiene_pernos) {
    const perno = formData.despiece?.find(p => p.esPerno);
    if (!perno || !perno.precio_u_venta_soles || isNaN(perno.precio_u_venta_soles)) {
      errores.precio_pernos = "Debes ingresar un precio válido para los pernos.";
    }
  }

  // 🔹 Validación TRANSPORTE
  if (formData.tiene_transporte === undefined || formData.tiene_transporte === "") {
    errores.tiene_transporte = "Debes indicar si deseas incluir transporte.";
  }

  if (formData.tiene_transporte) {
    if (!formData.tipo_transporte) {
      errores.tipo_transporte = "Selecciona el tipo de transporte.";
    }

    const precios = [
      formData.costo_tarifas_transporte,
      formData.costo_distrito_transporte,
      formData.costo_pernocte_transporte
    ];

    if (precios.some(p => p === "" || isNaN(p))) {
      errores.costo_transporte = "Todos los precios de transporte deben ser válidos.";
    }
  }

  // 🔹 Validación INSTALACIÓN (solo si el uso lo permite)
  if (USOS_INSTALABLES.includes(formData.uso_id)){
    if (!formData.tipo_instalacion || formData.tipo_instalacion === "") {
      errores.instalacion = "Debes indicar si deseas incluir instalación.";
    }

    if (formData.tipo_instalacion && formData.tipo_instalacion !== "NINGUNA") {
      if (formData.tipo_instalacion === "COMPLETA" && !formData.precio_instalacion_completa) {
        errores.instalacion = "Debes ingresar el precio de instalación completa.";
      }
      if (formData.tipo_instalacion === "PARCIAL") {
        if (!formData.precio_instalacion_completa || !formData.precio_instalacion_parcial) {
          errores.instalacion = "Debes ingresar precios válidos para instalación parcial y completa.";
        }
      }
    }
  }

  // 🔹 Validación DESCUENTO
  if (formData.descuento > 50) {
    errores.descuento = "El descuento no puede superar el 50%.";
  }

  return errores;
}