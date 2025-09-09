import { FUENTE_PREVIOS } from "./quinta.constants";

/**
 * Valida el formulario principal. Devuelve { ok, errors }.
 * @param {any} form
 */
export function validarFormularioQuinta(form) {
  const errs = {};

  if (!form.anio) errs.anio = "El año es obligatorio.";
  if (!form.mes) errs.mes = "El mes es obligatorio.";
  const mesNum = Number(form.mes);
  if (mesNum < 1 || mesNum > 12) errs.mes = "Mes inválido (1-12).";

  if (!form.trabajadorId) errs.trabajadorId = "Selecciona un trabajador.";

  /* if (form.remuneracionMensualActual === "" || Number(form.remuneracionMensualActual) <= 0) {
    errs.remuneracionMensualActual = "La remuneración mensual es obligatoria.";
  } */

  if (form.fuentePrevios === FUENTE_PREVIOS.CERTIFICADO) {
    const c = form.certificadoQuinta || {};
    if (c.renta_bruta_total === "" || isNaN(Number(c.renta_bruta_total))) {
      errs.cert_renta = "* (obligatorio)";
    }
    if (c.retenciones_previas === "" || isNaN(Number(c.retenciones_previas))) {
      errs.cert_ret = "* (obligatorio)";
    }
  }

  return { ok: Object.keys(errs).length === 0, errors: errs };
}