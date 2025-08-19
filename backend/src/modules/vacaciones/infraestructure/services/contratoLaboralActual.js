const db = require("../../../../database/models");
const SequelizeDataMantenimientoRepository = require("../../../data_mantenimiento/infrastructure/repositories/sequelizeDataMantenimientoRepository");
const dataMantenimientoRepository = new SequelizeDataMantenimientoRepository();

async function obtenerImporteDiasVendidos(
   contratos_laborales,
   asignacion_familiar,
   dias_vendidos
) {
   const hoy = new Date();

   const contratoActual = contratos_laborales.find((c) => {
      const inicio = new Date(c.fecha_inicio);
      const fin = new Date(c.fecha_fin);
      return hoy >= inicio && hoy <= fin;
   });

   if (!contratoActual) throw new Error("No se encontro contrato vigente");

   let sueldo_bruto = Number(contratoActual.sueldo);

   if (asignacion_familiar) {
      const MONTO_ASIGNACION_FAMILIAR = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_asignacion_familiar"
            )
         ).valor
      );
      sueldo_bruto += MONTO_ASIGNACION_FAMILIAR;
   }

   const vacaciones = (sueldo_bruto / 30) * Number(dias_vendidos);

   let sueldo = vacaciones;

   const MONTO_AFP = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_afp")).valor
   );

   const MONTO_PRIMA = Number(
      (await dataMantenimientoRepository.obtenerPorCodigo("valor_prima")).valor
   );

   const descuentos =
      vacaciones * (MONTO_AFP / 100) + vacaciones * (MONTO_PRIMA / 100);

   sueldo = sueldo - descuentos;

   return sueldo;
}

module.exports = {
   obtenerImporteDiasVendidos,
};
