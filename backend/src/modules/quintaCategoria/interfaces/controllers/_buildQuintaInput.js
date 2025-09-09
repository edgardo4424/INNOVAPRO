module.exports = async function buildQuintaInput({ body, obtenerIngresosUC }) {
  const trabajadorId = body.__trabajadorId || body.trabajadorId;
  const filialIdPreferida = body.filialId || body.__filialId;
  const contratoId = body.__contratoId || body.contratoId;
  const dni = body.dni;
  const anio = Number(body.anio);
  const mes = Number(body.mes);
  const remuneracionMensualActual = Number(body.remuneracionMensualActual || 0);
  const asignacion_familiar = body.__tiene_asignacion_familiar || false;
  const asignacion_familiar_desde = body.__asignacion_familiar_desde || "";

  // consultamos ingresos previos
  const ingresosPrevios = await obtenerIngresosUC.execute({
    trabajadorId,
    dni,
    anio,
    mes,
    remuneracionMensualActual,
    fuentePrevios: body.fuentePrevios || "AUTO",
    certificadoQuinta: body.certificadoQuinta || null,
    filialIdPreferida,
    contratoId,
    asignacion_familiar,
    asignacion_familiar_desde
  });

  // consultamos retenciones previas (regla “vigente por mes”)
  const retPreviasDB = await obtenerIngresosUC._getRetencionesPrevias({
    trabajadorId,
    anio,
    mes,
  });

  console.log("RETENCIÓN TOTAL EN BASE DE DATOS SACADA DE BUILD: ", retPreviasDB)

  // suma de certificado solo si la fuente es CERTIFICADO
  const retencionesPrevias =
    Number(retPreviasDB || 0) +
    (body?.fuentePrevios === 'CERTIFICADO'
      ? Number(body?.certificadoQuinta?.retenciones_previas || 0)
      : 0);
    
  console.log("RETENCIÓN TOTAL SUMANDO LAS DEL CERTIFICADO: ", retencionesPrevias)

  return {
    ingresosPrevios,
    retencionesPrevias: Number(retencionesPrevias || 0),
    esProyeccion: !!ingresosPrevios.es_proyeccion,
    fuentePrevios: body.fuentePrevios || "AUTO",
  };
};