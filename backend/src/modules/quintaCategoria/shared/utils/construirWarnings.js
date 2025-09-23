const { round2 } = require('../utils/helpers');
const { MES_NOMBRE } = require('../constants/tributario/quinta')

module.exports = function construirWarnings({ base, soportes, mesNum, retPreviasDB }) {
  // Lista para almacenar los mensajes de advertencias 
  const advertencias = [];
  const metaDatos = soportes?.meta || {};

  // Lógica para la Declaración "Sin Previos"
  if (metaDatos.sin_previos_found) {

    const mesInicioAplica = Number(metaDatos.sin_previos_aplica_desde) || 1;
   
    if (metaDatos.sin_previos_vigente_en_mes) {
      // el mes actual está dentro del rango de la aplicación declaración jurada
      const mesHasta = mesInicioAplica - 1;
      advertencias.push(`Declaración jurada "Sin ingresos previos" vigente. No se consideran ingresos o retenciones de periodos anteriores a ${MES_NOMBRE[mesHasta]}.`);
    } else {
      // hay declaración jurada, pero no aplica aún en el mes actual
      advertencias.push(`Declaración jurada "Sin ingresos previos" registrada. Aplica desde ${MES_NOMBRE[mesInicioAplica]}.`);
    }
  }

  // 2) Lógica para el Certificado de Retenciones
  if (metaDatos.certificado_found) {
    const mesInicioAplicaCert = Number(metaDatos.certificado_aplica_desde) || 1;

    if (metaDatos.certificado_ignorado_por_mes) {
      // El mes actual es anterior al mes de aplicación del certificado
      advertencias.push(`Certificado de quinta registrado, pero aún no se considera para este mes. Aplica a partir de ${MES_NOMBRE[mesInicioAplicaCert]}.`);
    } else if (metaDatos.fuente_externos === 'CERTIFICADO') {
      // El certificado es la fuente de ingresos externos
      const ingresosExternos = Number(metaDatos.ingresos_previos_externos || 0);
      const retencionesExternas = Number(metaDatos.retenciones_previas_externas || 0);

      advertencias.push(`Certificado de quinta considerado: se han incluido S/ ${round2(ingresosExternos)} en ingresos y S/ ${round2(retencionesExternas)} en retenciones externas.`);
    }
  }

  // 3) Proyección pura (sin internos ni externos)
  const totalIngresos = Number(base?.total_ingresos || 0);
  const ingresosExternos = Number(metaDatos.ingresos_previos_externos || 0);
  if (totalIngresos === 0 && ingresosExternos === 0) {
    advertencias.push('No se encontraron ingresos previos. El cálculo se basa únicamente en la proyección de su sueldo actual.');
  }

  // 4) Lógica para las Retenciones Acumuladas
  const retencionesTotales = Number(retPreviasDB || 0) + Number(metaDatos.retenciones_previas_externas || 0);
  if (retencionesTotales === 0) {
    advertencias.push('No se encontraron retenciones acumuladas de meses anteriores. Se usará un valor de S/ 0.');
  }

  // 5) Lógica para Multi-empleo (Añadida para mayor claridad)
  if (metaDatos.es_secundaria) {
      advertencias.push('Se identificó un escenario de multi-empleo. Esta filial es la secundaria, por lo que la retención de quinta categoría será de S/ 0.');
  } else if (metaDatos.origen_retencion === 'MULTIEMPLEO') {
      advertencias.push('Se identificó un escenario de multi-empleo y esta es la filial principal. El cálculo incluye ingresos de otras filiales.');
  }

  return advertencias;
}