// npm i moment moment-timezone
const moment = require('moment-timezone');
const TZ = 'America/Lima';
const INF = moment.tz('9999-12-31', 'YYYY-MM-DD', TZ);

const parse = (s) => s ? moment.tz(s, 'YYYY-MM-DD', true, TZ) : null;
const factorPorRegimen = (r) => (r === 'GENERAL' ? 1 : r === 'MYPE' ? 0.5 : 0);

function mergeRangosConRegimen(contratos = []) {

  const arr = contratos
    .map(c => ({
      fecha_inicio: c.fecha_inicio,
      fecha_fin: c.fecha_terminacion_anticipada || c.fecha_fin,
      fecha_terminacion_anticipada: c.fecha_terminacion_anticipada,
      ini: parse(c.fecha_inicio),
      fin: (c.fecha_terminacion_anticipada || c.fecha_fin) ? parse(c.fecha_terminacion_anticipada || c.fecha_fin) : null,
      regimen: c.regimen || 'GENERAL',
      sistema_salud: c.sistema_salud || 'ESSALUD',
      tipo_contrato: c.tipo_contrato || 'PLANILLA',
      sueldo_base: Number(c.sueldo ?? 0),
    }))
    .filter(r => r.ini && r.ini.isValid())
    .sort((a,b) => a.ini.valueOf() - b.ini.valueOf());

  const out = [];
  for (const r of arr) {
    const curFinEff = r.fin || INF;
    if (!out.length) { out.push(r); continue; }
    const last = out[out.length - 1];
    const lastFinEff = last.fin || INF;

    const mismosAtributos =
      last.regimen === r.regimen &&
      last.sistema_salud === r.sistema_salud &&
      last.tipo_contrato === r.tipo_contrato;

    const continuaInmediatamente = lastFinEff.clone().add(1, 'day').isSame(r.ini, 'day');

    if (mismosAtributos && (r.ini.isSameOrBefore(lastFinEff, 'day') || continuaInmediatamente)) {
      const maxFin = moment.max(lastFinEff, curFinEff);
      last.fin = maxFin.isSame(INF, 'day') ? null : maxFin;
      last.sueldo_base = r.sueldo_base; // Actualizamos al último sueldo
      last.fecha_fin = r.fecha_fin; // Actualizamos la fecha de fin
    } else {
      out.push(r);
    }
  }
  return out;
}

function calcularMesesComputablesSemestre(contratos, periodo, anio) {
  const year = Number(anio);
  if (!year || !['JULIO','DICIEMBRE'].includes(periodo)) {
    throw new Error('Parámetros inválidos.');
  }

  const semInicio = parse(periodo === 'JULIO' ? `${year}-01-01` : `${year}-07-01`);
  const semFin    = parse(periodo === 'JULIO' ? `${year}-06-30` : `${year}-12-31`);

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

      const cubreDesde = rIni.isSameOrBefore(mesIni, 'day');
      const cubreHasta = rFin.isSameOrAfter(mesFin, 'day');

      if (cubreDesde && cubreHasta) {
        mesCompletoPorRegimen.push(r);
      }
    }

    let regimenAsignado = null;
    if (mesCompletoPorRegimen.length > 0) {
      const elegido = mesCompletoPorRegimen[mesCompletoPorRegimen.length - 1];
     
      const key = `${elegido.regimen}|${elegido.sistema_salud}|${elegido.tipo_contrato}`;
      regimenAsignado = key;

      if (!contadores.has(key)) {
        contadores.set(key, {
          meses: 0,
          attrs: {
            fecha_inicio: elegido.fecha_inicio,
            fecha_fin: elegido.fecha_fin,
            fecha_terminacion_anticipada: elegido.fecha_terminacion_anticipada,
            regimen: elegido.regimen,
            sistema_salud: elegido.sistema_salud,
            tipo_contrato: elegido.tipo_contrato,
            sueldo_base: elegido.sueldo_base,
            factor: factorPorRegimen(elegido.regimen)
          }
        });
      }

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

  const porRegimen = Array.from(contadores.values()).map(x => ({
    fecha_inicio: x.attrs.fecha_inicio,
    fecha_fin: x.attrs.fecha_fin,
    fecha_terminacion_anticipada: x.attrs.fecha_terminacion_anticipada,
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

function obtenerUltimaSueldo(contratos = []) {
  return contratos.reduce((acc, c) => {
    const sueldo = Number(c.sueldo ?? 0);
    if (!acc) return sueldo;
    return sueldo > acc ? sueldo : acc;
  }, null);
}

module.exports = { calcularMesesComputablesSemestre, obtenerUltimaFechaFin, obtenerUltimaSueldo, factorPorRegimen };
