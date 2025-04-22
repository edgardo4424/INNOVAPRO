const { formatearDomicilioSUNAT } = require('../../infrastructure/utils/formateadorDomicilio');

module.exports = async function buscarRUC(ruc, sunatRepository) {
  if (!ruc || typeof ruc !== 'string' || ruc.trim().length !== 11 ) {
    return { codigo: 400, respuesta: { mensaje: "RUC inválido" } };
  }

  const datos = await sunatRepository.obtenerPorRUC(ruc.trim());
  if (!datos) {
    return { codigo: 404, respuesta: { mensaje: "RUC no encontrado en la base de datos SUNAT" } };
  }

  const domicilioFormateado = formatearDomicilioSUNAT(datos, datos.ubigeo_info);

  return {
    codigo: 200,
    respuesta: {
      razon_social: datos.nombre_razon_social,
      domicilio_fiscal: domicilioFormateado,
    }
  }
}