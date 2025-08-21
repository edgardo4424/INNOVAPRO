const db = require("../../../../database/models");
const SequelizeAsistenciaRepository = require("../../../asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const SequelizeBonoRepository = require("../../../bonos/infraestructure/repositories/sequelizeBonoRepository");
const SequelizeDataRepository = require("../../../data_mantenimiento/infrastructure/repositories/sequelizeDataMantenimientoRepository");
const calculaPromedioBonos = require("../services/calculoBonos");
const calcularPromedioHorasExtras = require("../services/calculoHorasEsxtras");

const dataMantenimientoRepository = new SequelizeDataRepository();
const bonosRepository = new SequelizeBonoRepository();
const asistenciasRepository = new SequelizeAsistenciaRepository();
class SequelizeCtsRopository {
   async calcularCts(periodo, anio, filial_id) {
      const MONTO_ASIGNACION_FAMILIAR = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_asignacion_familiar"
            )
         ).valor
      );
      const responseContratos = await db.contratos_laborales.findAll({
         include: [
            {
               model: db.trabajadores,
               as: "trabajador",
            },
         ],
         where: {
            filial_id: filial_id,
         },
      });
      const contratos = responseContratos.map((c) => c.get({ plain: true }));

      const objTrabajadores = new Map();

      for (const c of contratos) {
         // Obtenemos el Id del contrato
         const tid = c.trabajador_id;
         //Verificacmos si existe una entrata en objTrabajadores con Tid
         if (!objTrabajadores.has(tid)) {
            //Si no existe se crea una entrada con el id como clave
            //dentro de la entrada iran dos claves
            //- Trabjador con la data de trabajador
            //- contartos que es inicializado vacio
            objTrabajadores.set(tid, {
               trabajador: c.trabajador,
               contratos: [],
            });
         }
         //Aqui se agrega el contrato ala clave contratos luego haberlo inicializado
         objTrabajadores.get(tid).contratos.push(c);
      }

      let fechaInicioCTS, fechaFinCTS;

      switch (periodo) {
         case "MAYO":
            fechaInicioCTS = `${anio - 1}-11-01`;
            fechaFinCTS = `${anio}-04-30`;
            break;
         case "NOVIEMBRE":
            fechaInicioCTS = `${anio}-05-01`;
            fechaFinCTS = `${anio}-10-31`;
            break;
      }
      console.log(fechaInicioCTS, fechaFinCTS);

      const contrucionCtsPortrabajador = Array.from(
         objTrabajadores.values()
      ).map(async ({ trabajador, contratos }) => {
         const contratoActual = contratos.find((c) => {
            const hoy = new Date();
            const inicio = new Date(c.fecha_inicio);

            const fin = new Date(c.fecha_fin);

            return hoy >= inicio && hoy <= fin;
         });
         const sueldo_base = contratoActual.sueldo;
         let cts_depositar = sueldo_base;
         if (trabajador.asignacion_familiar) {
            cts_depositar += MONTO_ASIGNACION_FAMILIAR;
         }
         console.log("Sueldo del contrato actual", sueldo_base);
         console.log("CTS a deposutar: ", cts_depositar);
         const reponseBonos =
            await bonosRepository.obtenerBonosDelTrabajadorEnRango(
               trabajador.id,
               fechaInicioCTS,
               fechaFinCTS
            );
         const bonos = reponseBonos.map((b) => b.get({ plain: true }));
         console.log('Promedio de bonos:',calculaPromedioBonos(bonos));
         
         const responseAsistencias =
            await asistenciasRepository.obtenerAsistenciasPorRangoFecha(
               trabajador.id,
               fechaInicioCTS,
               fechaFinCTS
            );
         // console.log('asistencias sucias',responseAsistencias);
         
         const asistencias=responseAsistencias.map((a)=>a.get({plain:true}));
         console.log('Asitencias enmtradas: ',asistencias);
         calcularPromedioHorasExtras(asistencias,sueldo_base)
         
          console.log("Bonos del trabajador: ", bonos);
      });
      return "prueba";
   }
}

module.exports = SequelizeCtsRopository;
