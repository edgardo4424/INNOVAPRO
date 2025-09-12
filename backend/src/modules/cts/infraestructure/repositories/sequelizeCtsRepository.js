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
const { where } = require("sequelize");
const SequelizeGratificacionRepository = require("../../../gratificaciones/infrastructure/repositories/sequelizeGratificacionRepository");
const { Cts } = require("../models/ctsModel");
const filtrarContratosSinInterrupcion = require("../../../../services/filtrarContratosSinInterrupcion");
const filtrarGratificacionesSinInterrupcion = require("../../../../services/filtrarGratificacionesSinInterrupcion");
const calcularTotalDiasEnRangoFecha = require("../utils/calcularTotalDiasEnRangoFecha");
const { CierreCTS } = require("../models/ctsCierreModel");

const objeto_inicial_cts = {
   contrato_id: null,
   trabajador_id: null,
   nombre: "",
   tipo_documento: "",
   numero_documento: "",
   regimen: "",
   fecha_ingreso: "",
   fecha_fin:"",
   inicio_periodo: "",
   fin_periodo: "",
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
   no_computable: 0,
   cts_depositar: 0,
   no_domiciliado: 0,
   numero_cuenta: "",
   banco: "",
   ids_agrupacion: null,
};

const dataMantenimientoRepository = new SequelizeDataRepository();
const bonosRepository = new SequelizeBonoRepository();
const asistenciasRepository = new SequelizeAsistenciaRepository();
const gratificacionRepository = new SequelizeGratificacionRepository();
class SequelizeCtsRopository {
   async calcularCts(periodo, anio, filial_id) {
      return "No implementado";
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
      //Hasta aquí se valido que el trabajador exista
      //Datos de mantenimiento
      const MONTO_ASIGNACION_FAMILIAR = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_asignacion_familiar"
            )
         ).valor
      );
      const MONTO_NO_COMPUTABLE = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_no_computable"
            )
         ).valor
      );

      //Inicializamos las variables para el rango de cts y variables para obtener la gatificacion
      let fechaInicioCTS, fechaFinCTS, periodoGratificacion, anioGratificacion;

      //Se obtiene el periodo de la gratificacion y rango de la cts
      switch (periodo) {
         case "MAYO":
            fechaInicioCTS = `${anio - 1}-11-01`;
            fechaFinCTS = `${anio}-04-30`;
            periodoGratificacion = "DICIEMBRE";
            anioGratificacion = anio - 1;
            break;
         case "NOVIEMBRE":
            fechaInicioCTS = `${anio}-05-01`;
            fechaFinCTS = `${anio}-10-31`;
            periodoGratificacion = "JULIO";
            anioGratificacion = anio;
            break;
      }
      let MONTO_GRATIFICACION = 0;

      const responseGratificacion =
         await gratificacionRepository.obtenerGratificacionPorTrabajador(
            periodoGratificacion,
            anioGratificacion,
            filial_id,
            trabajador.id
         );
      if (responseGratificacion.length > 0) {
         const gratificacionesLimpias = responseGratificacion.map((g) =>
            g.get({ plain: true })
         );
         const gratificaciones = filtrarGratificacionesSinInterrupcion(
            gratificacionesLimpias
         );
         for (const grati of gratificaciones) {
            MONTO_GRATIFICACION += Number(grati.total_pagar);
         }
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

      const contratoInicial =
         filtrarContratosSinInterrupcion(contratos_limpios);

      // TODO: CALCULA LOS CONTRATOS QUE ENTRAN EN RANGO DE CTS Y QUE NO TENGAN INTERUPCIONES MAYORES DE 1 DIA
      const contratos_en_rango = calcularContratosComputados(
         fechaInicioCTS,
         fechaFinCTS,
         contratos_limpios
      );

      if (trabajador.id == 7)
         console.log("Los contrtos en rango de valeria: ", contratos_en_rango);

      // TODO: Union de contratos que tienen el mismo regimen
      const contratos_unidos = unificarContratos(contratos_en_rango);

      //Conteo de cuantod ias y meses da cada contrato
      const contratos_dias_meses = calcularDiasMesesPorContrato(
         fechaInicioCTS,
         fechaFinCTS,
         contratos_unidos
      );

      const arreglo_cts = [];
      // Calcuar bonos y verificar si contara para los contratos comptados en el rango:
      const reponseBonos =
         await bonosRepository.obtenerBonosDelTrabajadorEnRango(
            trabajador.id,
            fechaInicioCTS,
            fechaFinCTS
         );
      const bonos = reponseBonos.map((b) => b.get({ plain: true }));
      const responseAsistencias =
         await asistenciasRepository.obtenerAsistenciasPorRangoFecha(
            trabajador.id,
            fechaInicioCTS,
            fechaFinCTS
         );
      const asistencias = responseAsistencias.map((a) =>
         a.get({ plain: true })
      );

      for (const c of contratos_dias_meses) {
         //Definimos rangos de calculo que lo usaran bonos, he, faltas
         let inicio_c =
            c.fecha_inicio > fechaInicioCTS ? c.fecha_inicio : fechaInicioCTS;
         let fin_c = c.fecha_fin < fechaFinCTS ? c.fecha_fin : fechaFinCTS;
         let r = { ...objeto_inicial_cts };
         r.fecha_fin=c.fecha_fin
         r.contrato_id = c.id;
         r.banco = c.banco || "no registrado";
         r.numero_cuenta = c.numero_cuenta || "no registrado";
         r.trabajador_id = c.trabajador_id;
         r.tipo_documento = trabajador.tipo_documento;
         r.numero_documento = trabajador.numero_documento;
         r.nombre = `${trabajador.nombres} ${trabajador.apellidos}`;
         r.regimen = c.regimen;
         r.fecha_ingreso = contratoInicial[0].fecha_inicio;
         r.inicio_periodo = fechaInicioCTS;
         r.fin_periodo = fechaFinCTS;
         r.sueldo_basico = c.sueldo;
         if (trabajador.asignacion_familiar) {
            r.sueldo_asig_fam = MONTO_ASIGNACION_FAMILIAR;
         }
         r.ultima_remuneracion = r.sueldo_basico + r.sueldo_asig_fam;

         const he_en_contrato = asistencias.filter((a) => {
            return a.fecha >= inicio_c && a.fecha <= fin_c;
         });
         const computarHextras = conteoHextrasMeses(he_en_contrato);
         if (computarHextras) {
            r.prom_h_extras = calcularHextrasEnCts(he_en_contrato, 10, 6) || 0;
         }

         const bonos_en_contrato = bonos.filter((b) => {
            return b.fecha >= inicio_c && b.fecha <= fin_c;
         });
         const computarBonos = conteoBonosMeses(bonos_en_contrato);
         if (computarBonos) {
            r.prom_bono = calcularBonosEnCts(bonos_en_contrato, 6) || 0;
         }

         r.remuneracion_comp =
            r.ultima_remuneracion + r.prom_h_extras + r.prom_bono;

         r.ultima_gratificacion = Number(MONTO_GRATIFICACION.toFixed(2));
         r.sexto_gratificacion = r.ultima_gratificacion / 6;

         r.sexto_gratificacion = parseFloat(r.sexto_gratificacion.toFixed(2));

         r.meses_comp = c.meses;
         r.dias_comp = c.dias;
         if (r.regimen == "GENERAL") {
            r.cts_meses =
               ((r.remuneracion_comp + r.sexto_gratificacion) / 12) *
               r.meses_comp;
            r.cts_dias =
               ((r.remuneracion_comp + r.sexto_gratificacion) / 12 / 30) *
               r.dias_comp;
         } else {
            r.cts_meses =
               ((r.remuneracion_comp + r.sexto_gratificacion) / 2 / 12) *
               r.meses_comp;
            r.cts_dias =
               ((r.remuneracion_comp + r.sexto_gratificacion) / 2 / 12 / 30) *
               r.dias_comp;
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
         r.faltas_importe = parseFloat(r.faltas_importe.toFixed(2));
         const dias_no_computados =
            await asistenciasRepository.obtenerDiasNoComputablesPorRangoFecha(
               trabajador.id,
               inicio_c,
               fin_c
            );
         if (dias_no_computados > 0) {
            r.no_computable = dias_no_computados * MONTO_NO_COMPUTABLE;
            r.no_computable = parseFloat(r.no_computable.toFixed(2));
         }
         r.cts_depositar =
            r.cts_meses + r.cts_dias - r.faltas_importe - r.no_computable;
         if (trabajador.domiciliado) {
            r.no_domiciliado = r.cts_depositar * 0.3;
         }

         r.cts_depositar = r.cts_depositar - r.no_domiciliado;
         r.cts_depositar = parseFloat(r.cts_depositar.toFixed(2));
         r.ids_agrupacion = c.ids_agrupacion;
         arreglo_cts.push(r);
      }
      return arreglo_cts;
   }

   async calcularCtsIndividualTrunca(periodo, anio, filial_id, trabajador_id, transaction = null) {
      console.log('entre a calcular');
      const responseTrabajador = await db.trabajadores.findOne({
         where: {
            id: trabajador_id,
            estado: 1,
         },
         transaction
      });
      if (!responseTrabajador) {
         throw new Error("Eñ trabajador no existe");
      }
      const trabajador = responseTrabajador.get({ plain: true });
      //Hasta aquí se valido que el trabajador exista
      //Datos de mantenimiento
      const MONTO_ASIGNACION_FAMILIAR = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_asignacion_familiar"
            )
         ).valor
      );
      const MONTO_NO_COMPUTABLE = Number(
         (
            await dataMantenimientoRepository.obtenerPorCodigo(
               "valor_no_computable"
            )
         ).valor
      );

      //Inicializamos las variables para el rango de cts y variables para obtener la gatificacion
      let fechaInicioCTS, fechaFinCTS, periodoGratificacion, anioGratificacion;

      //Se obtiene el periodo de la gratificacion y rango de la cts
      switch (periodo) {
         case "MAYO":
            fechaInicioCTS = `${anio - 1}-11-01`;
            fechaFinCTS = `${anio}-04-30`;
            periodoGratificacion = "DICIEMBRE";
            anioGratificacion = anio - 1;
            break;
         case "NOVIEMBRE":
            fechaInicioCTS = `${anio}-05-01`;
            fechaFinCTS = `${anio}-10-31`;
            periodoGratificacion = "JULIO";
            anioGratificacion = anio;
            break;
      }
      let MONTO_GRATIFICACION = 0;

      const responseGratificacion =
         await gratificacionRepository.obtenerGratificacionPorTrabajador(
            periodoGratificacion,
            anioGratificacion,
            filial_id,
            trabajador.id,
            transaction
         );
      if (responseGratificacion.length > 0) {
         const gratificacionesLimpias = responseGratificacion.map((g) =>
            g.get({ plain: true })
         );
         const gratificaciones = filtrarGratificacionesSinInterrupcion(
            gratificacionesLimpias
         );
         if (trabajador_id == 7) {
            console.log("Numero de gratificaciones: ", gratificaciones.length);
         }
         for (const grati of gratificaciones) {
            MONTO_GRATIFICACION += Number(grati.total_pagar);
         }
      }

      const responseContratos = await db.contratos_laborales.findAll({
         where: {
            filial_id: filial_id,
            trabajador_id: trabajador_id,
            tipo_contrato: "PLANILLA",
            estado:true
         },
         transaction
      });
      const contratos_limpios = responseContratos.map((c) =>
         c.get({ plain: true })
      );

      const hoy = new Date().toISOString().slice(0, 10); // "2025-08-26"

      //Obtenemos el contrato Inicial
      const contratoInicial =
         filtrarContratosSinInterrupcion(contratos_limpios);

      // TODO: CALCULA LOS CONTRATOS QUE ENTRAN EN RANGO DE CTS Y QUE NO TENGAN INTERUPCIONES MAYORES DE 1 DIA
      const contratos_en_rango = calcularContratosComputados(
         fechaInicioCTS,
         fechaFinCTS,
         contratos_limpios
      );

      // TODO: Unificamos los contratos que tienen el mismo regimen y son consecutivos
      const contratos_unidos = unificarContratos(contratos_en_rango);

      // TODO: Conteo de cuantos sias y meses da cada contrato
      // TODO: Aqui se debe de validar si el contrao es trunco
      const contratos_dias_meses = calcularDiasMesesPorContrato(
         fechaInicioCTS,
         fechaFinCTS,
         contratos_unidos,
         true
      );

      const arreglo_cts = [];
      // Calcuar bonos y verificar si contara para los contratos comptados en el rango:
      const reponseBonos =
         await bonosRepository.obtenerBonosDelTrabajadorEnRango(
            trabajador.id,
            fechaInicioCTS,
            fechaFinCTS
         );
      const bonos = reponseBonos.map((b) => b.get({ plain: true }));

      const responseAsistencias =
         await asistenciasRepository.obtenerAsistenciasPorRangoFecha(
            trabajador.id,
            fechaInicioCTS,
            fechaFinCTS
         );
      const asistencias = responseAsistencias.map((a) =>
         a.get({ plain: true })
      );

      for (const c of contratos_dias_meses) {
         //Definimos rangos de calculo que lo usaran bonos, he, faltas
         let inicio_c =
            c.fecha_inicio > fechaInicioCTS ? c.fecha_inicio : fechaInicioCTS;

         let fin_contrato_valido = c.fecha_terminacion_anticipada
            ? c.fecha_terminacion_anticipada
            : c.fecha_fin;

         let fin_c =
            fin_contrato_valido < fechaFinCTS
               ? fin_contrato_valido
               : fechaFinCTS;
         let r = { ...objeto_inicial_cts };
         r.fecha_fin=fin_contrato_valido; 
         r.contrato_id = c.id;
         r.banco = c.banco || "no registrado";
         r.numero_cuenta = c.numero_cuenta || "no registrado";

         r.trabajador_id = c.trabajador_id;
         r.tipo_documento = trabajador.tipo_documento;
         r.numero_documento = trabajador.numero_documento;
         r.nombre = `${trabajador.nombres} ${trabajador.apellidos}`;
         r.regimen = c.regimen;
         r.fecha_ingreso = contratoInicial[0].fecha_inicio;
         r.inicio_periodo = fechaInicioCTS;
         r.fin_periodo = fechaFinCTS;
         r.sueldo_basico = c.sueldo;

         if (trabajador.asignacion_familiar) {
            r.sueldo_asig_fam = MONTO_ASIGNACION_FAMILIAR;
         }
         r.ultima_remuneracion = r.sueldo_basico + r.sueldo_asig_fam;

         const he_en_contrato = asistencias.filter((a) => {
            return a.fecha >= inicio_c && a.fecha <= fin_c;
         });
         const computarHextras = conteoHextrasMeses(he_en_contrato);
         if (computarHextras) {
            r.prom_h_extras = calcularHextrasEnCts(he_en_contrato, 10, 6) || 0;
         }

         const bonos_en_contrato = bonos.filter((b) => {
            return b.fecha >= inicio_c && b.fecha <= fin_c;
         });
         const computarBonos = conteoBonosMeses(bonos_en_contrato);
         if (computarBonos) {
            r.prom_bono = calcularBonosEnCts(bonos_en_contrato, 6) || 0;
         }

         r.remuneracion_comp =
            r.ultima_remuneracion + r.prom_h_extras + r.prom_bono;

         r.ultima_gratificacion = Number(MONTO_GRATIFICACION.toFixed(2));
         r.sexto_gratificacion = r.ultima_gratificacion / 6;

         r.sexto_gratificacion = parseFloat(r.sexto_gratificacion.toFixed(2));

         r.meses_comp = c.meses;
         r.dias_comp = c.dias;
         if (r.regimen == "GENERAL") {
            r.cts_meses =
               ((r.remuneracion_comp + r.sexto_gratificacion) / 12) *
               r.meses_comp;
            r.cts_dias =
               ((r.remuneracion_comp + r.sexto_gratificacion) / 12 / 30) *
               r.dias_comp;
         } else {
            r.cts_meses =
               ((r.remuneracion_comp + r.sexto_gratificacion) / 2 / 12) *
               r.meses_comp;
            r.cts_dias =
               ((r.remuneracion_comp + r.sexto_gratificacion) / 2 / 12 / 30) *
               r.dias_comp;
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
         r.faltas_importe = parseFloat(r.faltas_importe.toFixed(2));
         const dias_no_computados =
            await asistenciasRepository.obtenerDiasNoComputablesPorRangoFecha(
               trabajador.id,
               inicio_c,
               fin_c
            );
         if (dias_no_computados > 0) {
            r.no_computable = dias_no_computados * MONTO_NO_COMPUTABLE;
            r.no_computable = parseFloat(r.no_computable.toFixed(2));
         }
         r.cts_depositar =
            r.cts_meses + r.cts_dias - r.faltas_importe - r.no_computable;
         if (trabajador.domiciliado) {
            r.no_domiciliado = r.cts_depositar * 0.3;
         }
         r.cts_depositar = r.cts_depositar - r.no_domiciliado;
         r.cts_depositar = parseFloat(r.cts_depositar.toFixed(2));
         r.ids_agrupacion = c.ids_agrupacion;
         arreglo_cts.push(r);
      }
      return arreglo_cts;
   }
   async verificarCierrePeriodoCts(periodo, anio, filial_id) {
      let periodoObtenido;
      switch (periodo) {
         case "MAYO":
            periodoObtenido = `${anio}-05`;
            break;
         case "NOVIEMBRE":
            periodoObtenido = `${anio}-11`;
            break;
         default:
            break;
      }
      const cierreCts = db.cierres_cts.findOne({
         where: { periodo: periodoObtenido, filial_id },
      });
      return cierreCts;
   }
   async obtenerHistoricoCts(periodo, anio, filial_id) {
      let periodoObtenido;
      switch (periodo) {
         case "MAYO":
            periodoObtenido = `${anio}-05`;
            break;
         case "NOVIEMBRE":
            periodoObtenido = `${anio}-11`;
            break;
         default:
            break;
      }
      const registros_cts = db.cts.findAll({
         where: {
            periodo: periodoObtenido,
            filial_id: filial_id,
         },
         include: {
            model: db.trabajadores,
            as: "trabajadores",
         },
      });
      return registros_cts;
   }
   async generarRegistroCierrePeriodoCts(datos, transaction = null) {
      const options = {};
      if (transaction) {
         options.transaction = transaction;
      }
      const cierreCts = db.cierres_cts.create(datos, options);
      return cierreCts;
   }
   async generarCierreBloqueoPeriodoCts(locked_at, id, transaction = null) {
      const options = {
         where: {
            id: id,
         },
      };
      if (transaction) {
         options.transaction = transaction;
      }
      const cierreCts = db.cierres_cts.update({ locked_at }, options);
      return cierreCts;
   }
   async crearRegistroCts(datos, transaction = null) {
      const options = {};
      if (transaction) {
         options.transaction = transaction;
      }
      const cts = db.cts.create(datos, transaction);
      return cts;
   }
   async obtenerCtsPorTrabajador(
      periodo,
      anio,
      filial_id,
      trabajador_id,
      transaction = null
   ) {
      let periodoObtenido;
      switch (periodo) {
         case "MAYO":
            periodoObtenido = `${anio}-05`;
            break;
         case "NOVIEMBRE":
            periodoObtenido = `${anio}-11`;
            break;
         default:
            break;
      }

      let options = {
         where: { trabajador_id, periodo: periodoObtenido, filial_id },
      };
      if (transaction) {
         options.transaction = transaction;
      }
      const ctsPorTrabajador = await Cts.findOne(options);
      return ctsPorTrabajador;
   }

    async obtenerCierreCts(
       periodo,
       anio,
       filial_id,
       transaction = null
     ) {
       let periodoBuscar;
       switch (periodo) {
         case "MAYO":
            periodoBuscar = `${anio}-05`;
            break;
         case "NOVIEMBRE":
            periodoBuscar = `${anio}-11`;
            break;
         default:
            break;
      }

       const cierreCTS = await CierreCTS.findOne({
         where: { periodo: periodoBuscar, filial_id },
         transaction,
       });
       return cierreCTS;
     }

     async insertarVariasCts(data, transaction = null) {
         const options = {};
         if (transaction) {
           options.transaction = transaction;
         }
     
         const lista_cts = await Cts.bulkCreate(data, options);
         return lista_cts;
       }

}

module.exports = SequelizeCtsRopository;
