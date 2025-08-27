const db = require("../../../../database/models");
const SequelizeAsistenciaRepository = require("../../../asistencias/infraestructure/repositories/sequelizeAsistenciaRepository");
const SequelizeBonoRepository = require("../../../bonos/infraestructure/repositories/sequelizeBonoRepository");
const SequelizeDataRepository = require("../../../data_mantenimiento/infrastructure/repositories/sequelizeDataMantenimientoRepository");
const calculaPromedioBonos = require("../../../../services/calculoBonos");
const calcularPromedioHorasExtras = require("../../../../services/calculoHorasEsxtras");
const calcularDiasMesesPorContrato = require("../services/CalcularDiasMesesPorContrato");
const calcularContratosComputados = require("../services/calcularContratosComputados");
const unificarContratos = require("../services/unificarContratos");
const conteoBonosMeses = require("../utils/conteoBonosMeses");
const conteoHextrasMeses = require("../utils/conteoHextrasMeses");
const calcularHextrasEnCts = require("../utils/calcularHextrasEnCts");
const calcularBonosEnCts = require("../utils/calcularBonosEnCts");

const objeto_inicial_cts = {

   contrato_id: null,
   trabajador_id: null,
   nombre: "",
   tipo_documento:"",
   numero_documento:"",
   regimen: "",
   fecha_ingreso: "",
   sueldo_basico: 0,
   sueldo_asig_fam: 0,
   ultima_remuneracion: 0,
   prom_h_extras: 0,
   prom_bono: 0,
   remuneracion_comp: 0,
   ultima_gratificacion: 0,
   sexto_gratificacion: 0,
   meses_comp: 0,
   dias_comp: 0,
   cts_meses: 0,
   cts_dias: 0,
   faltas_dias: 0,
   faltas_importe: 0,
   cts_depositar: 0,
   ids_agrupacion: null,
};
// Cuenta solo lunes-viernes. Acepta mes 1-12. Usa UTC para evitar DST.
function contarDiasLaborablesDelMes(anio, mes /* 1-12 */) {
   const m0 = mes - 1;
   if (m0 < 0 || m0 > 11) throw new Error("mes debe ser 1..12");

   let contador = 0;
   const fecha = new Date(Date.UTC(anio, m0, 1));
   while (fecha.getUTCMonth() === m0) {
      const dia = fecha.getUTCDay(); // 0=dom, 6=sáb
      if (dia !== 0 && dia !== 6) contador++;
      fecha.setUTCDate(fecha.getUTCDate() + 1);
   }
   return contador;
}

const dataMantenimientoRepository = new SequelizeDataRepository();
const bonosRepository = new SequelizeBonoRepository();
const asistenciasRepository = new SequelizeAsistenciaRepository();
class SequelizeCtsRopository {
   async calcularCts(periodo, anio, filial_id) {
      console.log("dias laborales: ", contarDiasLaborablesDelMes(2025, 9));

      const MONTO_ASIGNACION_FAMILIAR = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_asignacion_familiar"
            )
         ).valor
      );
      const MONTO_HORA_EXTRA = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_hora_extra"
            )
         ).valor
      );
      console.log("Monto de hora extra: ", MONTO_HORA_EXTRA);

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

      const CTS_TRABAJADORES = [];
      const contrucionCtsPortrabajador = Array.from(
         objTrabajadores.values()
      ).map(async ({ trabajador, contratos }) => {
         let cts_i = { ...objeto_inicial_cts };

         const contratoActual = contratos.find((c) => {
            const hoy = new Date();
            const inicio = new Date(c.fecha_inicio);

            const fin = new Date(c.fecha_fin);

            return hoy >= inicio && hoy <= fin;
         });

         cts_i.sueldo_basico = Number(contratoActual.sueldo);

         if (trabajador.asignacion_familiar) {
            cts_i.sueldo_asig_fam += MONTO_ASIGNACION_FAMILIAR;
         }

         cts_i.ultima_remuneracion =
            cts_i.sueldo_basico + cts_i.sueldo_asig_fam;

         const responseAsistencias =
            await asistenciasRepository.obtenerAsistenciasPorRangoFecha(
               trabajador.id,
               fechaInicioCTS,
               fechaFinCTS
            );
         const asistencias = responseAsistencias.map((a) =>
            a.get({ plain: true })
         );
         cts_i.prom_h_extras = calcularPromedioHorasExtras(asistencias, 10, 6);

         const reponseBonos =
            await bonosRepository.obtenerBonosDelTrabajadorEnRango(
               trabajador.id,
               fechaInicioCTS,
               fechaFinCTS
            );
         const bonos = reponseBonos.map((b) => b.get({ plain: true }));
         cts_i.prom_bono = calculaPromedioBonos(bonos, 6);

         console.log("ultima remuneracion: ", cts_i.ultima_remuneracion);
         console.log("promedio de h_e: ", cts_i.prom_h_extras);
         console.log("Promedio de bonos: ", cts_i.prom_bono);

         cts_i.remuneracion_comp =
            cts_i.ultima_remuneracion + cts_i.prom_h_extras + cts_i.prom_bono;
         console.log("remuneracion comutada es", cts_i.remuneracion_comp);

         let ULTIMA_GRATIFICACION = cts_i.sueldo_basico;
         if (contratoActual.tipo_contrato === "MYPE") {
            ULTIMA_GRATIFICACION = Number(ULTIMA_GRATIFICACION) / 2;
         }
         console.log("ultima graificacion: ", ULTIMA_GRATIFICACION);

         const contratos_en_rango = calcularContratosComputados(
            fechaInicioCTS,
            fechaFinCTS,
            contratos
         );
         // console.log("Contratos aceptados: ", contratos_en_rango);
         console.log(
            "Dias y meses calculados: ",
            calcularDiasMesesPorContrato(
               fechaInicioCTS,
               fechaFinCTS,
               contratos_en_rango,
               true
            )
         );
         for (const c of contratos_en_rango) {
            const fecha_final_verificado = c.fecha_terminacion_anticipada
               ? c.fecha_terminacion_anticipada
               : c.fecha_fin;
            let inicio_c =
               c.fecha_inicio > fechaInicioCTS
                  ? c.fecha_inicio
                  : fechaInicioCTS;
            let fin_c =
               fecha_final_verificado < fechaFinCTS
                  ? fecha_final_verificado
                  : fechaFinCTS;
            console.log("Inicio verificaccio", inicio_c);
            console.log("fin verificaccio", fin_c);

            const faltas =
               await asistenciasRepository.obtenerCantidadFaltasPorRangoFecha(
                  trabajador.id,
                  inicio_c,
                  fin_c
               );
            console.log("El suelod es: ", c.sueldo);
            const calculo_desc_falta = (c.sueldo / 12 / 30) * faltas;
            console.log("faltas", faltas);
            console.log("Decuento por las faltas: ", calculo_desc_falta);
         }
      });
      return "prueba";
   }

   async calcularCtsIndividual(periodo, anio, filial_id, trabajador_id) {
      const responseTrabajador = await db.trabajadores.findOne({
         where: {
            id: trabajador_id,
            estado: 1,
         },
      });
      if (!responseTrabajador) {
         throw new Error("Eñ trabajador no existe");
      }
      const trabajador = responseTrabajador.get({ plain: true });
      // console.log(trabajador);
      // Datos de mantenimiento
      const MONTO_ASIGNACION_FAMILIAR = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_asignacion_familiar"
            )
         ).valor
      );

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
      const responseContratos = await db.contratos_laborales.findAll({
         where: {
            filial_id: filial_id,
            trabajador_id: trabajador_id,
            fecha_terminacion_anticipada: null,
         },
      });
      const contratos_limpios = responseContratos.map((c) =>
         c.get({ plain: true })
      );
      // console.log('Contratos limpios',contratos_limpios);

      const hoy = new Date().toISOString().slice(0, 10); // "2025-08-26"

      const contratoActual = contratos_limpios.find((c) => {
         return hoy >= c.fecha_inicio && hoy <= c.fecha_fin;
      });

      //Contratos que entran en rango y tambien
      const contratos_en_rango = calcularContratosComputados(
         fechaInicioCTS,
         fechaFinCTS,
         contratos_limpios
      );
      //Union de contratos que tienen el mismo rango
      const contratos_unidos = unificarContratos(contratos_en_rango);
      //Conteo de cuantod ias y meses da cada contrato
      const contratos_dias_meses = calcularDiasMesesPorContrato(
         fechaInicioCTS,
         fechaFinCTS,
         contratos_unidos
      );
      // console.log(
      //    "Contratos que entarn en el rango con conteo dias",
      //    contratos_dias_meses
      // );
      const arreglo_cts = [];
      // Calcuar bonos y verificar si contara para los contratos comptados en el rango:
      const reponseBonos =
         await bonosRepository.obtenerBonosDelTrabajadorEnRango(
            trabajador.id,
            fechaInicioCTS,
            fechaFinCTS
         );
      const bonos = reponseBonos.map((b) => b.get({ plain: true }));
      const computarBonos = conteoBonosMeses(bonos);

      const responseAsistencias =
         await asistenciasRepository.obtenerAsistenciasPorRangoFecha(
            trabajador.id,
            fechaInicioCTS,
            fechaFinCTS
         );
      const asistencias = responseAsistencias.map((a) =>
         a.get({ plain: true })
      );
      const computarHextras = conteoHextrasMeses(asistencias);

      for (const c of contratos_dias_meses) {
         //Definimos rangos de calculo que lo usaran bonos, he, faltas
         let inicio_c =
            c.fecha_inicio > fechaInicioCTS ? c.fecha_inicio : fechaInicioCTS;
         let fin_c = c.fecha_fin < fechaFinCTS ? c.fecha_fin : fechaFinCTS;

         let r = { ...objeto_inicial_cts };
         r.contrato_id = c.id;
         r.trabajador_id = c.trabajador_id;
         r.tipo_documento=trabajador.tipo_documento;
         r.numero_documento=trabajador.numero_documento;
         r.nombre = `${trabajador.nombres} ${trabajador.apellidos}`;
         r.regimen = c.regimen;
         r.fecha_ingreso = "Por calcular";
         r.sueldo_basico = Number(contratoActual.sueldo);
         if (trabajador.asignacion_familiar) {
            r.sueldo_asig_fam = MONTO_ASIGNACION_FAMILIAR;
         }
         r.ultima_remuneracion = r.sueldo_basico + r.sueldo_asig_fam;

         if (computarHextras) {
            const he_en_contrato = asistencias.filter((a) => {
               return a.fecha >= inicio_c && a.fecha <= fin_c;
            });
            console.log('Asistencias con HE',he_en_contrato);
            console.log('caclulo de horas extras en cts: ' ,calcularHextrasEnCts(he_en_contrato, 10, 6) || 0);
            
            r.prom_h_extras = calcularHextrasEnCts(he_en_contrato, 10, 6) || 0;
         }

         if (computarBonos) {
            const bonos_en_contrato = bonos.filter((b) => {
               return b.fecha >= inicio_c && b.fecha <= fin_c;
            });
            r.prom_bono = calcularBonosEnCts(bonos_en_contrato, 6) || 0;
         }

         r.remuneracion_comp =
            r.ultima_remuneracion + r.prom_h_extras + r.prom_bono;
         if (r.regimen == "GENERAL") {
            r.ultima_gratificacion = r.ultima_remuneracion;
            r.sexto_gratificacion = r.ultima_gratificacion / 6;
         } else {
            r.ultima_gratificacion = r.ultima_remuneracion / 2;
            r.sexto_gratificacion = r.ultima_gratificacion / 6;
         }
         r.sexto_gratificacion = parseFloat(r.sexto_gratificacion.toFixed(2));
         r.meses_comp = c.meses;
         r.dias_comp = c.dias;
         if (r.regimen == "GENERAL") {
            r.cts_meses =
               ((r.remuneracion_comp + r.sexto_gratificacion) / 12) *
               r.meses_comp;
            r.cts_dias =
               ((r.remuneracion_comp + r.sexto_gratificacion) / 12 / 30) *
               r.meses_comp;
         } else {
            r.cts_meses =
               ((r.remuneracion_comp + r.sexto_gratificacion) / 2 / 12) *
               r.meses_comp;
            r.cts_dias =
               ((r.remuneracion_comp + r.sexto_gratificacion) / 2 / 12 / 30) *
               r.meses_comp;
         }
         r.cts_meses = parseFloat(r.cts_meses.toFixed(2));
         r.cts_dias = parseFloat(r.cts_dias.toFixed(2));

         r.faltas_dias =
            await asistenciasRepository.obtenerCantidadFaltasPorRangoFecha(
               trabajador.id,
               inicio_c,
               fin_c
            );
         r.faltas_importe = (c.sueldo / 12 / 30) * r.faltas_dias;
         r.faltas_importe=parseFloat(r.faltas_importe.toFixed(2))
         r.cts_depositar = r.cts_meses + r.cts_dias - r.faltas_importe;
         r.cts_depositar=parseFloat(r.cts_depositar.toFixed(2))
         r.ids_agrupacion = c.ids_agrupacion;
         arreglo_cts.push(r);
      }
      return arreglo_cts;
   }
}

module.exports = SequelizeCtsRopository;
