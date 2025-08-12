// npm i moment moment-timezone
const moment = require('moment-timezone');
const TZ = 'America/Lima';
const INF = moment.tz('9999-12-31', 'YYYY-MM-DD', TZ);

const parse = (s) => s ? moment.tz(s, 'YYYY-MM-DD', true, TZ) : null;
const factorPorRegimen = (r) => (r === 'GENERAL' ? 1 : r === 'MYPE' ? 0.5 : 0);

function mergeRangosConRegimen(contratos = []) {
  // Normaliza: {ini, fin, regimen, sistema_salud?, tipo_contrato?, sueldo_base?}
  const arr = contratos
    .map(c => ({
      fecha_inicio: c.fecha_inicio, // NUEVO CAMPO
      fecha_fin: c.fecha_fin,
      ini: parse(c.fecha_inicio),
      fin: c.fecha_fin ? parse(c.fecha_fin) : null,
      regimen: c.regimen || 'GENERAL',
      sistema_salud: c.sistema_salud || 'ESSALUD',
      tipo_contrato: c.tipo_contrato || 'PLANILLA',
      sueldo_base: Number(c.sueldo ?? 0)
    }))
    .filter(r => r.ini && r.ini.isValid())
    .sort((a,b) => a.ini.valueOf() - b.ini.valueOf());

  // No fusionamos rangos con distinto régimen: los mantenemos separados
  // Solo extendemos un rango si se solapa y TIENE el MISMO régimen/atributos clave
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

    if (mismosAtributos && r.ini.isSameOrBefore(lastFinEff, 'day')) {
      // Extiende el fin
      const maxFin = moment.max(lastFinEff, curFinEff);
      last.fin = maxFin.isSame(INF, 'day') ? null : maxFin;
    } else {
      out.push(r);
    }
  }
  return out;
}

/**
 * Cuenta meses computables (>=15 días) por régimen dentro de un semestre.
 * Asigna cada mes computable al régimen que tenga MÁS días en ese mes.
 * Empates: se asigna al régimen del rango que inicia MÁS tarde dentro del mes (regla tie-breaker).
 *
 * @param {{fecha_inicio:string, fecha_fin?:string|null, regimen:string, sistema_salud?:string, tipo_contrato?:string, sueldo_base?:number}[]} contratos
 * @param {"JULIO"|"DICIEMBRE"} periodo
 * @param {number|string} anio
 * @returns {{
 *   totalMeses:number,
 *   porRegimen: Array<{regimen:string, meses:number, factor:number, sistema_salud:string, tipo_contrato:string, sueldo_base:number}>,
 *   detalleMensual: Array<{mes:string, diasPorRegimen:Record<string,number>, computa:boolean, regimenAsignado:string|null}>
 * }}
 */
function calcularMesesComputablesSemestre(contratos, periodo, anio) {
  
  const year = Number(anio);
  if (!year || !['JULIO','DICIEMBRE'].includes(periodo)) {
    throw new Error('Parámetros inválidos.');
  }

  const semInicio = parse(periodo === 'JULIO' ? `${year}-01-01` : `${year}-07-01`);
  const semFin    = parse(periodo === 'JULIO' ? `${year}-06-30` : `${year}-12-31`);

  // Rangos con régimen (NO merge entre distintos regímenes)
  const rangos = mergeRangosConRegimen(contratos);

  console.log('RANGOSSSSSSSSS', rangos);
  const detalleMensual = [];
  const contadores = new Map(); // key regimen + salud + periodo + sueldo_base -> {meses, attrs}
  let totalMeses = 0;

  let cursor = semInicio.clone().startOf('month');
  while (cursor.isSameOrBefore(semFin, 'day')) {
    const mesIni = moment.max(cursor.clone().startOf('month'), semInicio);
    const mesFin = moment.min(cursor.clone().endOf('month'), semFin);

    // Suma días por régimen en este mes
    const diasPorRegimen = {}; // { 'GENERAL|ESSALUD|PLANILLA|2000': {dias, attrs} }
    for (const r of rangos) {
      const rIni = r.ini;
      const rFin = r.fin || semFin;
      const iIni = moment.max(mesIni, rIni);
      const iFin = moment.min(mesFin, rFin);
      if (!iFin.isBefore(iIni, 'day')) {
        const dias = iFin.diff(iIni, 'days') + 1;
        const key = `${r.regimen}|${r.sistema_salud}|${r.tipo_contrato}|${r.sueldo_base}`;
        if (!diasPorRegimen[key]) {
          diasPorRegimen[key] = { dias: 0, attrs: r };
        }
        diasPorRegimen[key].dias += dias;
      }
    }

    const totalDiasMes = Object.values(diasPorRegimen).reduce((a, x) => a + x.dias, 0);
    let regimenAsignado = null;
    let computa = totalDiasMes >= 15;

    if (computa) {
      // Elige el régimen con MÁS días en el mes.
      // Si empata: el que tenga el rango que inicia más tarde dentro del mes (tie-breaker estable).
      let mejorKey = null;
      let mejorDias = -1;
      let mejorIniDentro = null;

      for (const [key, info] of Object.entries(diasPorRegimen)) {
        const { attrs } = info;
        // inicio real dentro del mes para desempate (más tarde = más “vigente” en ese mes)
        const iniDentro = moment.max(mesIni, attrs.ini);
        if (info.dias > mejorDias ||
           (info.dias === mejorDias && (!mejorIniDentro || iniDentro.isAfter(mejorIniDentro)))) {
          mejorDias = info.dias;
          mejorKey = key;
          mejorIniDentro = iniDentro;
        }
      }

      const elegido = diasPorRegimen[mejorKey].attrs;
      regimenAsignado = mejorKey;

      console.log('elegidooooooo', elegido);

      // Acumular conteo para ese “paquete” de atributos (regimen + salud + tipo + sueldo_base)
      if (!contadores.has(mejorKey)) {
        contadores.set(mejorKey, {
          meses: 0,
          attrs: {
            fecha_inicio: elegido.fecha_inicio, // NUEVO CAMPO
            fecha_fin: elegido.fecha_fin,
            regimen: elegido.regimen,
            sistema_salud: elegido.sistema_salud,
            tipo_contrato: elegido.tipo_contrato,
            sueldo_base: elegido.sueldo_base,
            factor: factorPorRegimen(elegido.regimen)
          }
        });
      }
      contadores.get(mejorKey).meses += 1;
      totalMeses += 1;
    }

    detalleMensual.push({
      mes: mesIni.format('YYYY-MM'),
      diasPorRegimen: Object.fromEntries(Object.entries(diasPorRegimen).map(([k,v]) => [k, v.dias])),
      computa,
      regimenAsignado
    });

    cursor.add(1, 'month');
  }

  // Construye arreglo por régimen
  const porRegimen = Array.from(contadores.values()).map(x => ({
    fecha_inicio: x.attrs.fecha_inicio, // NUEVO CAMPO
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

module.exports = { calcularMesesComputablesSemestre };
