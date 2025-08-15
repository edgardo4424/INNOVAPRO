const moment = require('moment-timezone');
const TZ = 'America/Lima';
const INF = moment.tz('9999-12-31', 'YYYY-MM-DD', TZ);

// Utilidad para parsear fechas en la zona horaria de Lima
const parse = (s) => s ? moment.tz(s, 'YYYY-MM-DD', true, TZ) : null;

// Factor según régimen laboral: GENERAL = 1, MYPE = 0.5
const factorPorRegimen = (r) => (r === 'GENERAL' ? 1 : r === 'MYPE' ? 0.5 : 0);

/**
 * Combina contratos continuos con mismos atributos, detectando renovaciones inmediatas
 */
function mergeRangosConRegimen(contratos = []) {

  const arr = contratos
    .map(c => ({
      fecha_inicio: c.fecha_inicio,
      fecha_fin: c.fecha_terminacion_anticipada || c.fecha_fin, // Se prioriza fecha de terminación anticipada si existe
      ini: parse(c.fecha_inicio),
      fin: (c.fecha_terminacion_anticipada || c.fecha_fin) ? parse(c.fecha_terminacion_anticipada || c.fecha_fin) : null,
      regimen: c.regimen || 'GENERAL',
      sistema_salud: c.sistema_salud || 'ESSALUD',
      tipo_contrato: c.tipo_contrato || 'PLANILLA',
      sueldo_base: Number(c.sueldo ?? 0)
    }))
    .filter(r => r.ini && r.ini.isValid())
    .sort((a,b) => a.ini.valueOf() - b.ini.valueOf());  // Orden cronológico

  const out = [];
  for (const r of arr) {
    const curFinEff = r.fin || INF;
    if (!out.length) { out.push(r); continue; }
    const last = out[out.length - 1];
    const lastFinEff = last.fin || INF;

    const mismosAtributos =
      last.regimen === r.regimen &&
      last.sistema_salud === r.sistema_salud &&
      last.tipo_contrato === r.tipo_contrato &&
      last.sueldo_base === r.sueldo_base;

       // Renovación inmediata: el siguiente contrato empieza al día siguiente del anterior
    const continuaInmediatamente = lastFinEff.clone().add(1, 'day').isSame(r.ini, 'day');

    if (mismosAtributos && (r.ini.isSameOrBefore(lastFinEff, 'day') || continuaInmediatamente)) {
      // Unificamos el rango extendiendo la fecha de fin
      const maxFin = moment.max(lastFinEff, curFinEff);
      last.fin = maxFin.isSame(INF, 'day') ? null : maxFin;
    } else {
      out.push(r);
    }
  }
  return out;
}

/**
 * Calcula los meses computables para gratificación según ley peruana.
 * Solo cuentan meses completos (1 al último día), cubiertos en su totalidad por el contrato.
 */
function calcularMesesComputablesSemestre(contratos, periodo, anio) {

  console.log({
    contratos,
    periodo,
    anio
  });
  const year = Number(anio);
  if (!year || !['JULIO','DICIEMBRE'].includes(periodo)) {
    throw new Error('Parámetros inválidos.');
  }

  // Semestre según periodo (JULIO o DICIEMBRE)
  const semInicio = parse(periodo === 'JULIO' ? `${year}-01-01` : `${year}-07-01`);
  const semFin    = parse(periodo === 'JULIO' ? `${year}-06-30` : `${year}-12-31`);

  // Contratos unificados por continuidad y atributos
  const rangos = mergeRangosConRegimen(contratos);

  const detalleMensual = [];
  const contadores = new Map();
  let totalMeses = 0;

  let cursor = semInicio.clone().startOf('month');
  while (cursor.isSameOrBefore(semFin, 'month')) {
    const mesIni = cursor.clone().startOf('month');
    const mesFin = cursor.clone().endOf('month');

    const mesCompletoPorRegimen = [];

    for (const r of rangos) {
      const rIni = r.ini;
      const rFin = r.fin || INF;

      // El contrato cubre TODO el mes: desde el día 1 hasta el último día
      const cubreDesde = rIni.isSameOrBefore(mesIni, 'day');
      const cubreHasta = rFin.isSameOrAfter(mesFin, 'day');

      if (cubreDesde && cubreHasta) {
        mesCompletoPorRegimen.push(r);
      }
    }

    let regimenAsignado = null;
    if (mesCompletoPorRegimen.length > 0) {
      // Asigna al régimen del último contrato que cubre ese mes completo
      const elegido = mesCompletoPorRegimen[mesCompletoPorRegimen.length - 1];
      const key = `${elegido.regimen}|${elegido.sistema_salud}|${elegido.tipo_contrato}|${elegido.sueldo_base}`;
      regimenAsignado = key;

      // Inicializa acumulador si no existe
      if (!contadores.has(key)) {
        contadores.set(key, {
          meses: 0,
          attrs: {
            fecha_inicio: elegido.fecha_inicio,
            fecha_fin: elegido.fecha_fin,
            regimen: elegido.regimen,
            sistema_salud: elegido.sistema_salud,
            tipo_contrato: elegido.tipo_contrato,
            sueldo_base: elegido.sueldo_base,
            factor: factorPorRegimen(elegido.regimen)
          }
        });
      }

      // Suma mes computado
      contadores.get(key).meses += 1;
      totalMeses += 1;
    }

    detalleMensual.push({
      mes: mesIni.format('YYYY-MM'),
      computa: mesCompletoPorRegimen.length > 0,
      regimenAsignado
    });

    cursor.add(1, 'month');
  }

  // Prepara salida por régimen
  const porRegimen = Array.from(contadores.values()).map(x => ({
    fecha_inicio: x.attrs.fecha_inicio,
    fecha_fin: x.attrs.fecha_fin,
    regimen: x.attrs.regimen,
    meses: x.meses,
    factor: x.attrs.factor,
    sistema_salud: x.attrs.sistema_salud,
    tipo_contrato: x.attrs.tipo_contrato,
    sueldo_base: x.attrs.sueldo_base
  }));

  return { totalMeses, porRegimen, detalleMensual };
}

function obtenerUltimaFechaFin(contratos = []) {
  return contratos.reduce((acc, c) => {
    const fin = c.fecha_terminacion_anticipada || c.fecha_fin;
    if (!acc) return fin;
    return moment(fin).isAfter(acc) ? fin : acc;
  }, null);
}

module.exports = { calcularMesesComputablesSemestre, obtenerUltimaFechaFin };
