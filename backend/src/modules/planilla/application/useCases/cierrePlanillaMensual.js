const SequelizeAdelantoSueldoRepository = require("../../../adelanto_sueldo/infraestructure/repositories/sequlizeAdelantoSueldoRepository");

const adelantoSueldoRepository = new SequelizeAdelantoSueldoRepository();
module.exports = async (
   usuario_cierre_id,
   planillaRepository,
   array_trabajadores,
   filial_id,
   fecha = "",
   transaction = null
) => {

   const fecha_anio_mes = fecha.slice(0, -3);
   const planillaQuincenal=
      await planillaRepository.obtenerCierrePlanillaQuincenal(
         fecha_anio_mes,
         filial_id,
         transaction
      )
   if(!planillaQuincenal){
      return {
         codigo: 400,
         respuesta: { mensaje: "La planilla quincenal no se ha cerrado." },
      };
   }
   const planillaMensualCerrada =
      await planillaRepository.obtenerCierrePlanillaMensual(
         fecha_anio_mes,
         filial_id
      );
   if (planillaMensualCerrada && planillaMensualCerrada?.locked_at) {
      return {
         codigo: 400,
         respuesta: { mensaje: "La planilla Mensual ya fue cerrada" },
      };
   }
   let cierre_planilla_mensual;
   if (planillaMensualCerrada) {
      cierre_planilla_mensual = planillaMensualCerrada;
   } else {
      const payload = {
         filial_id,
         periodo: fecha_anio_mes,
         usuario_cierre_id,
      };
      cierre_planilla_mensual =
         await planillaRepository.generarRegistroCierrePeriodoPlanillaMensual(
            payload,
            transaction
         );
   }
   {
      /*
       *Adelantos de sueldo en planila
       *Falta vacaciones vendida en rxh
       *Adelantos de sueldo en rhx
       *
       */
   }
   const hoy = new Date();
   const transform_data = array_trabajadores.map((t) => {
      let data = { ...t };
      data.regimen=data.regimen||"";
      data.afp=data.afp||"";
      data.sueldo_bruto=data.sueldo_bruto||0;
      data.locked_at = hoy;
      data.usuario_cierre_id = usuario_cierre_id;
      data.filial_id = filial_id;
      data.cierre_planilla_mensual_id = cierre_planilla_mensual.id;
      data.periodo = fecha_anio_mes;
      data.fecha_calculo = new Date().toISOString().split("T")[0];
      return data;
   });

   let planillas_creadas = [];
   for (const t of transform_data) {
      if (t.trabajador_id == 8) {
         console.log("datos del trabajador x honorarios:", t);
      }
      const response = await planillaRepository.crearRegistroPlanilla(
         t,
         transaction
      );
      if (t?.adelantos_ids?.length > 0) {
         for (const id of t.adelantos_ids) {
            await adelantoSueldoRepository.aumnetarCuotaPagada(id, transaction);
         }
         const adelantosresposne =
            await adelantoSueldoRepository.obtenerAdelantosPorTrabajadorId(
               t.trabajador_id,
               transaction
            );
         const adelantos=adelantosresposne.map((a)=>a.get({plain:true}))
         console.log("Loa adelantos actualziado son: ", adelantos);
      }
      planillas_creadas.push(response);
   }
   const locked = new Date();

   const bloqueoPlanilla =
      await planillaRepository.generarCierreBloqueoPeriodoPlanillaMensual(
         locked,
         cierre_planilla_mensual.id,
         transaction
      );

   return {
      codigo: 202,
      respuesta: {
         mensaje: "Se genero correctamnete la planilla mensual",
         planilla: planillas_creadas,
      },
   };
};
