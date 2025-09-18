// Rellenamos los números menores de 10 con "0" a la izquierda.
const pad2 = (numero) => String(numero).padStart(2, "0");

// Formateamos objetos DATE a string con formato YYYY-MM-DD
const ymd = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

// Devolver la fecha de inicio y fin de un periodo (mes) dado
function periodoMes(anio, mes) {
  const ANIO = Number(anio);
  const MES = Number(mes);

  if (!Number.isInteger(ANIO) || !Number.isInteger(MES) || MES < 1 || MES > 12) {
    const err = new Error(`periodoMes inválido: anio=${anio}, mes=${mes}`);
    err.status = 400;
    return err;
  }

  const desdeDate = new Date(ANIO, MES - 1, 1);
  const hastaDate = new Date(ANIO, MES, 0);

  return { desde: ymd(desdeDate), hasta: ymd(hastaDate) };
}

/**
 * Redondea un número a dos decimales.
 * @param {number} n El número a redondear.
 * @returns {number} El número redondeado.
 */
function round2(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

/**
 * Retorna el divisor y etiqueta para el fraccionamiento según el mes.
 * @param {number} mes El mes de cálculo.
 * @returns {{divisor: number, etiqueta: string}} El divisor y etiqueta.
 */
function denominadorFraccionamiento(mes) {
  if (mes >= 1 && mes <= 3) return { divisor: 12, etiqueta: 'ENE-MAR' };
  if (mes === 4) return { divisor: 9, etiqueta: 'ABR' };
  if (mes >= 5 && mes <= 7) return { divisor: 8, etiqueta: 'MAY-JUL' };
  if (mes === 8) return { divisor: 5, etiqueta: 'AGO' };
  if (mes >= 9 && mes <= 11) return { divisor: 4, etiqueta: 'SEP-NOV' };
  return { divisor: 1, etiqueta: 'DIC' };
}

/**
 * Valida y normaliza los parámetros tributarios.
 * @param {object} parametros Objeto con los parámetros a validar.
 * @returns {object} Los parámetros validados.
 * @throws {Error} Si algún parámetro es inválido.
 */
function confirmarParametrosTributarios(parametros) {
  const uit = Number(parametros?.uit);
  const deduccion_fija = Number(parametros?.deduccionFijaUit);
  const valor_hora_extra = Number(parametros?.valorHoraExtra);
  const valor_asignacion_familiar = Number(parametros?.valorAsignacionFamiliar);
  
  if (!Number.isFinite(uit) || uit <= 0) throw new Error('Parámetro "uit" inválido.');
  if (!Number.isFinite(deduccion_fija) || deduccion_fija < 0) throw new Error('Parámetro "deduccionFijaUit" inválido.');
  if (!Number.isFinite(valor_hora_extra) || valor_hora_extra < 0) throw new Error('Parámetro "valorHoraExtra" inválido');
  if (!Number.isFinite(valor_asignacion_familiar) || valor_asignacion_familiar < 0) throw new Error('Parámetro "valorAsignacionFamiliar" inválido');

  return { uit, deduccionFijaUit: deduccion_fija, valorHoraExtra: valor_hora_extra, valorAsignacionFamiliar: valor_asignacion_familiar };
}

function absolutize(url, req) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const base = `${req.protocol}://${req.get('host')}`;
  return url.startsWith('/uploads') ? `${base}${url}` : url;
}

// ------------------------------------------------------------
// Helper: arma soportes con URL absolutas para la respuesta al frontend
function _absolutizeSoportes(soportes, req) {
  const multi = soportes?.multiEmpleoOk ? { ...soportes.multiEmpleoOk } : null;
  if (multi?.archivo_url) multi.archivo_url = absolutize(multi.archivo_url, req);

  const cert = soportes?.certificadoOk ? { ...soportes.certificadoOk } : null;
  if (cert?.archivo_url) cert.archivo_url = absolutize(cert.archivo_url, req);

  const sp = soportes?.sinPreviosOk ? { ...soportes.sinPreviosOk } : null;
  if (sp?.archivo_url) sp.archivo_url = absolutize(sp.archivo_url, req);

  return { certificado: cert, multiempleo: multi, sinPrevios: sp };
}

// Helper: base para cálculos vacía defensiva 
function _baseVacia() {
  return {
    remuneraciones: 0, gratificaciones: 0, bonos: 0,
    asignacion_familiar: 0, gratiJulioTrabajador: 0,
    gratiJulioProj: 0, gratiDiciembreTrabajador: 0,
    gratiDiciembreProj: 0, extraGravadoMes: 0,
    es_proyeccion: false, total_ingresos: 0
  };
}

const num = (v) => (v == null || isNaN(v) ? 0 : Number(v));

const noCache = (res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
};

const intOrNull = (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number.parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
};

module.exports = {
  pad2,
  ymd,
  round2,
  denominadorFraccionamiento,
  confirmarParametrosTributarios,
  periodoMes,
  absolutize,
  _absolutizeSoportes,
  _baseVacia,
  num,
  noCache,
  intOrNull,
};