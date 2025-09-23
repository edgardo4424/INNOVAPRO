const SequelizeDataRepository = require("../../../data_mantenimiento/infrastructure/repositories/sequelizeDataMantenimientoRepository");

// Todo: obtiene todos los datos de manyenimeinto para calcular la planilla mensual
const dataMantenimientoRepository = new SequelizeDataRepository();
const datosMantPM = async () => {
   const PORCENTAJE_DESCUENTO_ONP = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_onp")).valor
   );
   const PORCENTAJE_DESCUENTO_AFP = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_afp")).valor
   );

   const PORCENTAJE_DESCUENTO_SEGURO = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_seguro")).valor
   );
   const MONTO_ASIGNACION_FAMILIAR = Number(
      (
         await dataMantenimientoRepository.obtenerPorCodigo(
            "valor_asignacion_familiar"
         )
      ).valor
   );
   
   const PORCENTAJE_DESCUENTO_COMISION_AFP_HABITAT = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_comision_afp_habitat"
        )
      ).valor
    );
    const PORCENTAJE_DESCUENTO_COMISION_AFP_INTEGRA = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_comision_afp_integra"
        )
      ).valor
    );

    const PORCENTAJE_DESCUENTO_COMISION_AFP_PRIMA = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_comision_afp_prima"
        )
      ).valor
    );

    const PORCENTAJE_DESCUENTO_COMISION_AFP_PROFUTURO = Number(
      (
        await dataMantenimientoRepository.obtenerPorCodigo(
          "valor_comision_afp_profuturo"
        )
      ).valor
    );
   return {
      PORCENTAJE_DESCUENTO_AFP,
      PORCENTAJE_DESCUENTO_ONP,
      PORCENTAJE_DESCUENTO_SEGURO,
      MONTO_ASIGNACION_FAMILIAR,
      PORCENTAJE_DESCUENTO_COMISION_AFP_HABITAT,
      PORCENTAJE_DESCUENTO_COMISION_AFP_INTEGRA,
      PORCENTAJE_DESCUENTO_COMISION_AFP_PRIMA,
      PORCENTAJE_DESCUENTO_COMISION_AFP_PROFUTURO
   };
};

module.exports = datosMantPM;
