const filtrarGratificacionesSinInterrupcion = require("../../../../services/filtrarGratificacionesSinInterrupcion");
const SequelizeGratificacionRepository = require("../../../gratificaciones/infrastructure/repositories/sequelizeGratificacionRepository");

const gratificacionRepository = new SequelizeGratificacionRepository();
const calcularGratificacionPlanilla = async (
   periodograti,
   filial_id,
   anioGratificacion,
   trabajador_id,
   transaction
) => {
   if (periodograti) {
      const responseGratificacion =
         await gratificacionRepository.obtenerGratificacionPorTrabajador(
            periodograti,
            anioGratificacion,
            filial_id,
            trabajador_id,
            transaction
         );
      if (responseGratificacion.length > 0) {
         let monto = 0;
         const gratificacionesLimpias = responseGratificacion.map((g) =>
            g.get({ plain: true })
         );
         const gratificaciones = filtrarGratificacionesSinInterrupcion(
            gratificacionesLimpias
         );
         for (const grati of gratificaciones) {
            monto += Number(grati.total_pagar);
         }
         return monto;
      }
      return 0;
   }
   return 0;
};

module.exports = calcularGratificacionPlanilla;
