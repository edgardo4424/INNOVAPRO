const ObtenerRetencionBaseMesPorDni = require('../useCases/obtenerRetencionBaseMesPorDni');

module.exports = function buildQuintaPublicAPI({ repo }) {
  const obtenerBaseMesUC = new ObtenerRetencionBaseMesPorDni({ repo });

  return {
    /**
     * getRetencionBaseMesPorDni(dni, anio, mes) => { found, retencion_base_mes, registro? }
     */
    async getRetencionBaseMesPorDni({ dni, anio, mes }) {
  
    const retencion_base_mes = await obtenerBaseMesUC.execute({ dni, anio, mes });
   
      return retencion_base_mes;
    },
  };
};