// fuente: https://orientacion.sunat.gob.pe/3071-02-calculo-del-impuesto

const { TRAMOS, FUENTE_PREVIOS } = require('../../constants/tributario/quinta');
const { round2, denominadorFraccionamiento, confirmarParametrosTributarios} = require('../helpers');

const SequelizeParametrosTributariosRepository = require('../../../infrastructure/repositories/SequelizeParametrosTributariosRepository');

const repoParametros = new SequelizeParametrosTributariosRepository();

async function getParametrosTributarios() {
  return await repoParametros.getParametrosTributarios();
}

// --------- Motor de cálculo: impuesto Anual Progresivo -------------
function impuestoProgresivoDesdeRentaNeta(rentaNetaAnual, uit) {
  if (rentaNetaAnual <= 0) return {impuestoTotal: 0, tramos: [] };

  let restanteUIT = rentaNetaAnual / uit;
  let impuesto = 0, previoTop = 0;
  let desgloce = [];
  
  for (const tramo of TRAMOS) {
    // Rango es cuántas UIT caen dentro del tramo actual
    // Ej. Si el tramo es de 0 a 5 UIT y ya llevamos 3 UIT, en este tramo entran 2 UIT
    const rango = Math.min(restanteUIT, tramo.hastaUIT - previoTop); 
    if (rango > 0) {
      const montoSoles = round2((rango * uit)); 
      const impuestoTramo = round2((montoSoles * tramo.tasa));

      impuesto += (rango * uit) * tramo.tasa; 
      restanteUIT -= rango; 
      previoTop = tramo.hastaUIT;

      desgloce.push({
        tramo: `${tramo.desdeUIT}-${tramo.hastaUIT} UIT`,
        tasa: tramo.tasa,
        monto_soles: montoSoles,
        impuesto: impuestoTramo
      })
    }
    if (restanteUIT <= 0) break; 
  }
  return { impuestoTotal: round2(impuesto), tramos: desgloce };
}

// ------------- Proyección de Ingresos Anuales --------------
function proyectarIngresosAnuales({
  mes, 
  remuneracionMensualActual, 
  ingresosPreviosAcumulados = 0,
  gratiJulioProyectada = 0, 
  gratiDiciembreProyectada = 0, 
  otrosIngresosProyectados = 0, 
  grati_multi, 
  af_multi,
  remu_multi, 
  fuentePrevios = 'AUTO', 
  asignacion_familiar_proj_actual = 0,
}) {

  // Si el usuario declaró "SIN_PREVIOS", ignoramos cualquier acumulado
  const prev = (fuentePrevios === FUENTE_PREVIOS.SIN_PREVIOS) ? 0 : Number(ingresosPreviosAcumulados);
  const mesesRestantes = 12 - (mes - 1);
  const proySueldos = Number(remuneracionMensualActual || 0) * mesesRestantes;

  // Proyectamos gratificación según el mes
  let proyGrati = 0;
  if ( mes <= 6) {
    proyGrati = Number(gratiJulioProyectada || 0) + Number(gratiDiciembreProyectada || 0);
  
  } else if ( mes >= 7 && mes <= 11) {
    proyGrati = Number(gratiDiciembreProyectada || 0);
  }
  
    // --- MULTI EMPLEAO ---
  const grati_pagadas_multi = grati_multi?.pagadas_total_otras || 0;
  const grati_proy_julio_multi = grati_multi?.proyeccion_total_otras.julio || 0;
  const grati_proy_diciembre_multi = grati_multi?.proyeccion_total_otras.diciembre || 0;

  const asignacion_familiar_prev_multi = af_multi?.previos_total_otras || 0;
  const asignacion_familiar_proj_multi = af_multi?.proyeccion_total_otras || 0;

  const remunearcion_prev_multi = remu_multi?.previos_total_otras || 0;
  const remuneracion_mes_actual_otras = remu_multi?.mes_actual_otras || 0;
  const remuneracion_proj_multi = remu_multi?.proyeccion_total_otras || 0;
  console.log("remunearcion_prev_multi: ", remunearcion_prev_multi);
  console.log("remuneracion_mes_actual_otras: ", remuneracion_mes_actual_otras);
  console.log("remuneracion_proj_multi: ", remuneracion_proj_multi);
  const total_multi_empleo =
    grati_pagadas_multi + grati_proy_julio_multi + grati_proy_diciembre_multi +
    asignacion_familiar_prev_multi + asignacion_familiar_proj_multi +
    remunearcion_prev_multi + remuneracion_mes_actual_otras + 
    remuneracion_proj_multi;
  
  const af_proj_actual = Number(asignacion_familiar_proj_actual || 0);

  const total = 
    prev + 
    proySueldos +
    round2(proyGrati) +
    total_multi_empleo +
    af_proj_actual +    
    Number(otrosIngresosProyectados || 0);
  console.log("TOTAAAAAL: ", total);
  return round2(total);
}

// ------------- Cálculo de Retención Base Mensual --------------
function calcularRetencionBaseMes({ anio, mes, brutoAnualProyectado, retencionesAcumuladas = 0, deduccionAdicionalAnual = 0, parametros }) {
  const { uit, deduccionFijaUit } = confirmarParametrosTributarios(parametros);

  const minimoVital = (deduccionFijaUit * uit);

  // Bruto anual proyectado - Minimo Vital por ley - Deducciones adicionales = RENTA NETA ANUAL
  // Aprovechamos el Math.max por si de negativo, devolver 0
  const rentaNetaAnual = round2(Math.max(0, brutoAnualProyectado - minimoVital - (deduccionAdicionalAnual || 0)));

  // Calculamos el impuesto anual con la el motor de cálculo progresivo como pide la SUNAT
  const {impuestoTotal, tramos } = impuestoProgresivoDesdeRentaNeta(rentaNetaAnual, uit);
  const { divisor, etiqueta } = denominadorFraccionamiento(Number(mes));

  const impuestoPendiente = impuestoTotal - retencionesAcumuladas;

  const retencionBaseMes = Number(mes) === 12
    ? round2(Math.max(0, impuestoPendiente))
    : round2(Math.max(0, impuestoPendiente / divisor ));

  return { 
    uit, 
    rentaNetaAnual: round2(rentaNetaAnual), 
    impuestoTotal, 
    divisor, 
    tramoEtiqueta: etiqueta, 
    retencionBaseMes,
    tramos_usados: tramos
  };
}

// --------- Cálculo de Retención Adicional Mensual ----------
function calcularRetencionAdicionalMes({ anio, rentaNetaAnual, montoExtraGravadoMes, parametros }) {
  if (!montoExtraGravadoMes || Number(montoExtraGravadoMes) <= 0) return 0;

  const { uit } = confirmarParametrosTributarios(parametros);

  const impuestoConExtra = impuestoProgresivoDesdeRentaNeta(rentaNetaAnual + montoExtraGravadoMes, uit);
  const impuestoSinExtra = impuestoProgresivoDesdeRentaNeta(rentaNetaAnual, uit);

  return round2(Math.max(0, impuestoConExtra.impuestoTotal - impuestoSinExtra.impuestoTotal));
}

module.exports = {
  getParametrosTributarios,
  proyectarIngresosAnuales,
  calcularRetencionBaseMes,
  calcularRetencionAdicionalMes,
  impuestoProgresivoDesdeRentaNeta,
};