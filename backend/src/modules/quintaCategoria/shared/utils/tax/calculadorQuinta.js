// fuente: https://orientacion.sunat.gob.pe/3071-02-calculo-del-impuesto
// ÚNICA constante local: TRAMOS.

const { TRAMOS, FUENTE_PREVIOS } = require('../../constants/tributario/quinta');

const SequelizeParametrosTributariosRepository = require('../../../infrastructure/repositories/SequelizeParametrosTributariosRepository');

const repoParametros = new SequelizeParametrosTributariosRepository();

async function getParametrosTributarios() {
  return await repoParametros.getParametrosTributarios();
}

function round2(n) { return Math.round((Number(n) + Number.EPSILON) * 100) / 100; }

// --------- Motor de cálculo ----------
// Esta función es el núcleo del cálculo del impuesto de quinta categoría
// Aplicamos la escala progresiva acumulativa de la renta neta
function impuestoProgresivoDesdeRentaNeta(rentaNetaAnual, uit) {
  // Si la renta neta anual (ya después de deducciones) es menor o igual a 0, no hay impuesto
  if (rentaNetaAnual <= 0) return {impuestoTotal: 0, tramos: [] };
  // Convertimos la renta neta anual a unidades UIT
  let restanteUIT = rentaNetaAnual / uit;
  // Inicializamos acumulador
  // impuesto = el total de impuesto calculado
  // previoTop = el límite superior del tramo anterior 
  let impuesto = 0, previoTop = 0;
  // preparamos el desgloce para mostrar en el front
  let desgloce = [];
  // Iteramos sobre los tramos progresivos de la renta de trabajo que tenemos definido en la constante TRAMOS
  for (const tramo of TRAMOS) {
    // Rango es cuántas UIT caen dentro del tramo actual
    // Ej. Si el tramo es de 0 a 5 UIT y ya llevamos 3 UIT, en este tramo entran 2 UIT
    const rango = Math.min(restanteUIT, tramo.hastaUIT - previoTop); 
    if (rango > 0) {
      const montoSoles = round2((rango * uit)); // guardamos el monto en soles para el desgloce
      const impuestoTramo = round2((montoSoles * tramo.tasa)); // y el impuesto también

      impuesto += (rango * uit) * tramo.tasa; // Calculamos el impuesto de este tramo
      restanteUIT -= rango; // Restamos esas UIT al restante
      previoTop = tramo.hastaUIT; // Actualizamos el Tope para el siguiente tramo

      desgloce.push({
        tramo: `${tramo.desdeUIT}-${tramo.hastaUIT} UIT`,
        tasa: tramo.tasa,
        monto_soles: montoSoles,
        impuesto: impuestoTramo
      })
    }
    if (restanteUIT <= 0) break; // Y si ya no queda nada, cerramos
  }
  return { impuestoTotal: round2(impuesto), tramos: desgloce }; // Devolvemos el impuesto redondeado a 2 decimales y el desgloce
}

function denominadorFraccionamiento(mes) {
  // Cuando calculamos el impuesto anual proyectado, no descontamos todo de golpe,
  // sino que se fracciona según el mes en que estemos, siguiendo las indicaciones de la SUNAT
  // Según el mes (1=enero, ... 12=diciembre), devolvemos:
  // divisor = cuántas partes se divide el impuesto anual faltante
  // etiqueta = un alias para saber el periodo
  if (mes >= 1 && mes <= 3) return { divisor: 12, etiqueta: 'ENE-MAR' };
  if (mes === 4) return { divisor: 9, etiqueta: 'ABR' };
  if (mes >= 5 && mes <= 7) return { divisor: 8, etiqueta: 'MAY-JUL' };
  if (mes === 8) return { divisor: 5, etiqueta: 'AGO' };
  if (mes >= 9 && mes <= 11) return { divisor: 4, etiqueta: 'SEP-NOV' };
  return { divisor: 1, etiqueta: 'DIC' };
}

function proyectarIngresosAnuales({
  // Estimamos el ingreso bruto anual del trabajador en base al mes actual y las proyecciones que exige la SUNAT
  mes, remuneracionMensualActual, ingresosPreviosAcumulados = 0, ingresos_previos_internos = 0,
  gratiJulioProyectada = 0, gratiDiciembreProyectada = 0, otrosIngresosProyectados, grati_multi, af_multi,
  remu_multi, fuentePrevios = 'AUTO', asignacion_familiar_proj_actual = 0,
}) {

  // Si el usuario declaró "SIN_PREVIOS", ignoramos cualquier acumulado
  const prev = (fuentePrevios === FUENTE_PREVIOS.SIN_PREVIOS) ? 0 : Number(ingresosPreviosAcumulados || 0);

  // Calculamos cuántos meses faltan incluyendo el actual
  const mesesRest = 12 - (mes - 1);

  // Proyectamos cuanto ganará el trabajador de aquí a fin de año con su sueldo mensual
  const proySueldos = Number(remuneracionMensualActual || 0) * mesesRest;

  /* let proySueldosInternos = 0;
  // Proyectamos cuanto ganará por otras filiales en caso vengan ingresos previos internos
  if (ingresos_previos_internos > 0) {
    proySueldosInternos = Number((ingresos_previos_internos/mes) || 0) * mesesRest;
  } */

  // Proyectamos gratificación según el mes
  let proyGrati = 0;
  if ( mes <= 6) {
    //Ene-Jun: faltan Julio y Diciembre
    proyGrati = Number(gratiJulioProyectada || 0) + Number(gratiDiciembreProyectada || 0);
  
  } else if ( mes >= 7 && mes <= 11) {
    // Jul-Nov: solo falta diciembre
    proyGrati = Number(gratiDiciembreProyectada || 0);
  }
    // En diciembre ya no hay gratificaciones proyectadas
  
    // --- MULTI EMPLEAO ---
  const grati_pagadas_multi = grati_multi?.pagadas_total_otras || 0;
  const grati_proy_julio_multi = grati_multi?.proyeccion_total_otras.julio || 0;
  const grati_proy_diciembre_multi = grati_multi?.proyeccion_total_otras.diciembre || 0;

  const asignacion_familiar_prev_multi = af_multi?.previos_total_otras || 0;
  const asignacion_familiar_proj_multi = af_multi?.proyeccion_total_otras || 0;

  const remunearcion_prev_multi = remu_multi?.previos_total_otras || 0;
  const remuneracion_proj_multi = remu_multi?.proyeccion_total_otras || 0;

  const total_multi_empleo =
    grati_pagadas_multi + grati_proy_julio_multi + grati_proy_diciembre_multi +
    asignacion_familiar_prev_multi + asignacion_familiar_proj_multi +
    remunearcion_prev_multi + remuneracion_proj_multi;
  
    const af_proj_actual = Number(asignacion_familiar_proj_actual || 0);

  const total = 
    prev + 
    proySueldos +
    round2(proyGrati) +
    total_multi_empleo +
    af_proj_actual +    
    Number(otrosIngresosProyectados || 0);

  console.log("Llegó al cálculo de proyección anual:",
    "mes: ", mes,
    "fuente previos: ", fuentePrevios,
    "previos usados: ", prev,
    "meses restantes: ", mesesRest,
    "sueldos proyectados: ", proySueldos,
    "gratificación proyectada: ", round2(proyGrati),
    "total de multi empleos: ", total_multi_empleo,
    "otros ingresos proyectados: ", otrosIngresosProyectados,
    "para un total de: ", total
  )
  return round2(total);
}

function confirmarParametrosTributarios(parametros) {
  const uit = Number(parametros?.uit);
  const deduccion_fija = Number(parametros?.deduccionFijaUit);
  const valor_hora_extra = Number(parametros?.valorHoraExtra);
  const valor_asignacion_familiar = Number(parametros?.valorAsignacionFamiliar)
  if (!Number.isFinite(uit) || uit <= 0) throw new Error('Parámetro "uit" inválido.');
  if (!Number.isFinite(deduccion_fija) || deduccion_fija <= 0) throw new Error('Parámetro "deduccionFijaUit" inválido.');
  if (!Number.isFinite(valor_hora_extra) || valor_hora_extra <= 0) throw new Error('Parámetro "valorHoraExtra" inválido');
  if (!Number.isFinite(valor_asignacion_familiar) || valor_asignacion_familiar <= 0) throw new Error('Parámetro "valorAsignacionFamiliar" inválido')
  return { uit: uit, deduccionFijaUit: deduccion_fija, valorHoraExtra: valor_hora_extra, valorAsignacionFamiliar: valor_asignacion_familiar };
}

function calcularRetencionBaseMes({ anio, mes, brutoAnualProyectado, retencionesAcumuladas = 0, deduccionAdicionalAnual = 0, parametros }) {
  console.log("Parametros recibidos para calcular la retención base del mes: ",
    "Año: ", anio,
    "Mes: ", mes,
    "Bruto anual proyectado: ", brutoAnualProyectado,
    "Retenciones acumuladas: ", retencionesAcumuladas,
    "Deduccion adicional anual: ", deduccionAdicionalAnual,
    "Parámetros: ", parametros,
  )
  const { uit, deduccionFijaUit } = confirmarParametrosTributarios(parametros);
  console.log("De los cuales sacamos la UIT de: ", uit, "Y la deduccion fija anual de: ", deduccionFijaUit)
  const minimoVital = (deduccionFijaUit * uit);
  console.log("Para poder sacar el mínimo vital de la sunat que es: ", minimoVital);
  // Bruto anual proyectado - Minimo Vital por ley - Deducciones adicionales = RENTA NETA ANUAL
  // Aprovechamos el Math.max por si de negativo, devolver 0
  const rentaNetaAnual = round2(Math.max(0, brutoAnualProyectado - minimoVital - (deduccionAdicionalAnual || 0)));
  console.log("Y con eso podemos sacar la renta anual de: ", rentaNetaAnual);
  // Calculamos el impuesto anual con la el motor de cálculo progresivo como pide la SUNAT
  const {impuestoTotal, tramos } = impuestoProgresivoDesdeRentaNeta(rentaNetaAnual, uit);
  console.log("Con la renta anual podemos calcular el impuesto progresivo y obtenemos el impuesto total del año: ", impuestoTotal,
    "Y los tramos utilizados en el cálculo: ", tramos
  )
  // Identificamos el fraccionamiento mensual con nuestra función que nos da
  // el divisor y la etiqueta segun el mes tal como indica la SUNAT
  const { divisor, etiqueta } = denominadorFraccionamiento(Number(mes));
  console.log("Y en base al mes podemos extraer el divisor: ", divisor, "Y la etiqueta: ", etiqueta);
  // Calculamos cuánto debe retenerse en el mes
  // Si es 12=diciembre, se retiene lo que falte del impuesto anual
  // Si son otros meses, el remanente dividido según el fraccionamiento
  // Siempre usamos Math.max para evitar valores negativos
  const baseMes = Number(mes) === 12 ? round2(Math.max(0, impuestoTotal - retencionesAcumuladas))
                             : round2(Math.max(0, (impuestoTotal - retencionesAcumuladas) / divisor));
  console.log("Luego, en base al mes, si es diciembre la retención base sería: ", round2(impuestoTotal - retencionesAcumuladas), 
    "Pero si no, al impuesto: ", impuestoTotal, "Le restamos las deducciones ya cobradas: ", retencionesAcumuladas, 
    "Y lo dividimos entre el divisor resultante del mes: ", divisor, "Para obtener la retención base del mes: ", baseMes
  )

  // Devolvemos un objeto listo para guardar/mostrar:
  // uit: valor UIT aplicado
  // rentaNetaAnual: renta neta
  // impuestoTotal: total de impuesto proyectado
  // divisor y tramoEtiqueta: reglas de fraccionamiento
  // retencionBaseMes: lo que corresponde retener este mes
  return { 
    uit, 
    rentaNetaAnual: round2(rentaNetaAnual), 
    impuestoTotal, 
    divisor, 
    tramoEtiqueta: etiqueta, 
    retencionBaseMes: round2(baseMes),
    tramos_usados: tramos
  };
}

function calcularRetencionAdicionalMes({ anio, rentaNetaAnual, montoExtraGravadoMes, parametros }) {
  // Si no hay monto extra gravado no hay que retener nada
  if (!montoExtraGravadoMes || Number(montoExtraGravadoMes) <= 0) return 0;

  const { uit } = confirmarParametrosTributarios(parametros);

  // Calculamos el impuesto anual con la el motor de cálculo progresivo como pide la SUNAT
  // sumándole los montos extras gravados en el mes
  const impuestoConExtra = impuestoProgresivoDesdeRentaNeta(rentaNetaAnual + montoExtraGravadoMes, uit);
  // y también sin los montos extra
  const impuestoSinExtra = impuestoProgresivoDesdeRentaNeta(rentaNetaAnual, uit);

  // La retención es la diferencia entre los impuestos con los montos extras
  // menos los impuestos sin los montos extra, es decir, el incremento
  // en el impuesto anual que se genera por este ingreso extraordinario
  // Redondeamos y nos aseguramos que no sea negativo
  return round2(Math.max(0, impuestoConExtra.impuestoTotal - impuestoSinExtra.impuestoTotal));
}

module.exports = {
  getParametrosTributarios,
  confirmarParametrosTributarios,
  proyectarIngresosAnuales,
  calcularRetencionBaseMes,
  calcularRetencionAdicionalMes,
  impuestoProgresivoDesdeRentaNeta,
  round2,
  denominadorFraccionamiento
};