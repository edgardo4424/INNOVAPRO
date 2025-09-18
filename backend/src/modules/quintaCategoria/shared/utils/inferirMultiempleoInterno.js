const SequelizeContratoLaboralRepository = require('../../../contratos_laborales/infraestructure/repositories/sequelizeContratoLaboralRepository');

const contratoRepo = new SequelizeContratoLaboralRepository();

/**
 * Dado un set de contratos activos en el mes para el mismo DNI:
 * - Elige filial principal (regla: la de mayor sueldo si no hay declaración jurada)
 * - Calcula ingresos previos internos (enero..mes-1) de las otras filiales
 * - Determina si debemos NO retener en la filial actual
 */
function _mesesDevengadosAnioHasta(anio, mes, fIni, fFin) {
  const year = Number(anio); // formateamos año
  const month = Number(mes); // formateamos mes
  if (month <= 1 ) return 0; // Si el mes es menor o igual a enero no hay meses que contar
  const inicio = new Date(fIni || `${year}-01-01`); // La fecha de inicio del contrato o ENERO
  const fin = new Date(fFin || `${year}-12-31`); // La fecha de fin del contrato o DICIEMBRE

  // Periodo a contar
  const desde = new Date(`${year}-01-01`); // Desde enero
  const hasta = new Date(`${year}-${String(month - 1).padStart(2, "0")}-28`); // Hasta el mes anterior al actual
  const inicioPeriodo = new Date(Math.max(inicio, desde));
  const finPeriodo = new Date(Math.min(fin, hasta));
  if (inicioPeriodo > finPeriodo) return 0;
  
  // contar meses calendario
  let meses = 0;
  const partida = new Date(inicioPeriodo.getFullYear(), inicioPeriodo.getMonth(), 1);
  const llegada = new Date(finPeriodo.getFullYear(), finPeriodo.getMonth(), 1);
  while (partida <= llegada) {
    meses++;
    partida.setMonth(partida.getMonth() + 1);
  }
  return meses;
}

module.exports = async function _inferirMultiempleoInterno({ dni, anio, mes, filialActualId }) {
  // obtenemos los contratos activos del trabajador al mes actual
  const contratos = await contratoRepo.obtenerContratosActivosPorDniEnMes(dni, anio, mes);
  
  if (!contratos || contratos.length <= 1) {
    return { 
      hayMulti: false, 
      principalId: null, 
      ActualEsSecundaria: false, 
      previosInternos: 0, 
      debug: { razon: "UNA_SOLA_FILIAL_O_MENOS"} };
  }

  // Agrupar por filial_id y quedarnos con el contrato "representante" de cada filial:
  // - Prioridad: mayor sueldo
  // - Decisión: fecha_inicio más antigua
  // - Segunda decisión: id más bajo

  // Primero mapeamos todos los contratos por filiales
  const porFilial = new Map();
  for (const contrato of contratos || []) {
    const filialId = Number(contrato.filial_id);
    if (!porFilial.has(filialId)) porFilial.set(filialId, []);
    porFilial.get(filialId).push(contrato);
  }

  // Si no hay al menos 2 filiales distintas activas NO hay multiempleo interno
  if (porFilial.size <= 1) {
    return {
      hayMulti: false,
      principalId: null,
      ActualEsSecundaria: false,
      previosInternos: 0,
      debug: { razon: "UNA_SOLA_FILIAL_ACTIVA", totalContratos: contratos?.length || 0 }
    };
  }

  // Representante por filial
  const representante = [...porFilial.values()].map(array =>
    array.sort((a,b) => {
      const sueldoRepresentante = Number(b.sueldo) - Number(a.sueldo);
      if(sueldoRepresentante !== 0) return sueldoRepresentante;
      const fechaMasAntigua = new Date(a.fecha_inicio) - new Date(b.fecha_inicio);
      if(fechaMasAntigua !== 0) return fechaMasAntigua;
      return Number(a.id) - Number(b.id);
    })[0]
  );

  // Elegimos principal por mayor sueldo; en empate aplica las mismas decisiones ya usadas
  const principal = [...representante].sort((a, b) => {
    const sueldoRepresentante = Number(b.sueldo) - Number(a.sueldo);
    if(sueldoRepresentante !== 0) return sueldoRepresentante;
    const fechaMasAntigua = new Date(a.fecha_inicio) - new Date(b.fecha_inicio);
    if (fechaMasAntigua !== 0) return fechaMasAntigua;
    return Number(a.id) - Number(b.id);
  })[0];
 
  const principalId = Number(principal.filial_id);

  // Devengados internos (enero.. mes-1) de las OTRAS filiales distintas a la actual
  let previosInternos = 0;
  for (const repre of representante) {
    if(Number(repre.filial_id) === Number(principalId)) continue;
    const meses = _mesesDevengadosAnioHasta(anio, mes, repre.fecha_inicio, repre.fecha_fin);
    previosInternos += Number(repre.sueldo) * Math.max(0, meses - 1);
  }
  
  const ActualEsSecundaria = Number(filialActualId) !== principalId;

  return {
    hayMulti: true,
    principalId,
    ActualEsSecundaria,
    previosInternos,
    debug: {
      regla: "MAYOR_SUELDO",
      representantes: representante.map(repre => ({
        filial_id: Number(repre.filial_id),
        sueldo: Number(repre.sueldo),
        fecha_inicio: repre.fecha_inicio,
        fecha_fin: repre.fecha_fin,
        contrato_id: Number(repre.id)
      })),
      filial_actual_id: Number(filialActualId),
      principal_id: principalId
    }
  };
}