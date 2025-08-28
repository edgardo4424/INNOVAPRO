module.exports = async function buildQuintaInput({
  body,
  obtenerIngresosUC, 
}) {
  // consultamos ingresos previos
  const ingresosPrevios = await obtenerIngresosUC.execute({
    trabajadorId: body.trabajadorId,
    anio: body.anio,
    mes: body.mes,
    remuneracionMensualActual: body.remuneracionMensualActual,
    fuentePrevios: body.fuentePrevios,
    certificadoQuinta: body.certificadoQuinta || null,
  });

  // consultamos retenciones previas (regla “vigente por mes”)
  const retPreviasDB = await obtenerIngresosUC._getRetencionesPrevias({
    trabajadorId: body.trabajadorId,
    anio: body.anio,
    mes: body.mes,
  });

  // suma de certificado solo si la fuente es CERTIFICADO
  const retencionesPrevias =
    Number(retPreviasDB || 0) +
    (body?.fuentePrevios === 'CERTIFICADO'
      ? Number(body?.certificadoQuinta?.retenciones_previas || 0)
      : 0);

  return {
    ingresosPrevios,
    retencionesPrevias,
    esProyeccion: ingresosPrevios.es_proyeccion,
    fuentePrevios: body.fuentePrevios,
  };
};