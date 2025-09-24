const db = require("../../../../database/models");
const { BajasTrabajadores } = require("../models/BajasTrabajadoresModel");

const moment = require("moment");

class SequelizeDarBajaTrabajadorRepository {
  async insertarRegistroBajaTrabajador(dataBody, transaction = null) {
    const registroBajaTrabajador = await BajasTrabajadores.create(dataBody, {
      transaction,
    });

    return registroBajaTrabajador;
  }

  async obtenerTrabajadoresDadosDeBaja() {
   const bajas = await BajasTrabajadores.findAll({
      include: [
         {
            model: db.trabajadores,
            as: "trabajador",
         },
         {
            model: db.usuarios,
            as: "registrado_por",
            attributes: ["id"],
         },
         {
            model: db.contratos_laborales,
            as: "contrato",
            where: {
              estado: true,
            },
         }
      ]
   });

   const resultado = [];

   for (const baja of bajas) {
      const contratos = await db.contratos_laborales.findAll({
         where: {
            trabajador_id: baja.trabajador_id,
            estado: true,
         },
         order: [["fecha_inicio", "ASC"]],
      });

      let fechaIngreso = null;
      const contratosOrdenados = contratos.sort((a, b) =>
         new Date(a.fecha_inicio) - new Date(b.fecha_inicio)
      );

      for (let i = 0; i < contratosOrdenados.length; i++) {
         const contrato = contratosOrdenados[i];

         if (contrato.id === baja.contrato_id) {
            // Llegamos al contrato de baja, no evaluar más
            break;
         }

         // Si el contrato actual tiene terminación anticipada, cortar continuidad
         if (contrato.fecha_terminacion_anticipada) {
            if (contratosOrdenados[i + 1]) {
               fechaIngreso = contratosOrdenados[i + 1].fecha_inicio;
            }
            break;
         }

         // Si no se ha definido aún, usamos el primer contrato
         if (!fechaIngreso) {
            fechaIngreso = contrato.fecha_inicio;
         }

         const siguienteContrato = contratosOrdenados[i + 1];
         const fechaFinReal = contrato.fecha_terminacion_anticipada || contrato.fecha_fin;

         if (siguienteContrato) {
            const inicioSiguiente = moment(siguienteContrato.fecha_inicio);
            const finAnterior = moment(fechaFinReal);
            const diffDias = inicioSiguiente.diff(finAnterior, "days");

            if (diffDias > 1) {
               // Hay corte de continuidad normal (sin necesidad de terminación anticipada)
               fechaIngreso = siguienteContrato.fecha_inicio;
            }
         }
      }

      resultado.push({
         ...baja.toJSON(),
         fecha_ingreso_real: fechaIngreso ?? baja.contrato?.fecha_inicio,
      });
   }

   return resultado;
}

async obtenerInformacionPdfLiquidacion(baja_trabajador_id, transaction = null){

    //! Obtener la informacion del trabajador que se dio de baja
    console.log("baja_trabajador_id", baja_trabajador_id);

    const trabajador_dado_de_baja = await db.bajas_trabajadores.findByPk(
      baja_trabajador_id,
      {
        include: [
          {
            model: db.trabajadores,
            as: "trabajador",
          },
          {
            model: db.contratos_laborales,
            as: "contrato",
          },
        ],
        transaction,
      }
    );

    if (!trabajador_dado_de_baja) {
      return {
        codigo: 404,
        respuesta: {
          mensaje: "Trabajador dado de baja no encontrado",
          liquidacion: null
        },
      };
    }

    //! Obtener la filial del trabajador con el ultimo contrato id
    const contrato_laboral = await db.contratos_laborales.findOne({
      where: { id: trabajador_dado_de_baja.contrato_id },
      include: [
        {
          model: db.empresas_proveedoras,
          as: "empresa_proveedora",
        },
      ],
      transaction,
    });

    if (!contrato_laboral) {
      return {
        codigo: 404,
        respuesta: {
          mensaje: "Contrato laboral no encontrado",
          liquidacion: null,
        },
      };
    }

    //! Obtener la gratificacion trunca del trabajador

    let gratificacionTrunca = null;

    if (trabajador_dado_de_baja.gratificacion_trunca_id) {
      gratificacionTrunca = await db.gratificaciones.findByPk(
        trabajador_dado_de_baja.gratificacion_trunca_id,
        {
          transaction,
        }
      );
    }

    //! Obtener la cts trunca del trabajador
    let ctsTrunca = null;

    if (trabajador_dado_de_baja.cts_trunca_id) {
       ctsTrunca = await db.cts.findByPk(
        trabajador_dado_de_baja.cts_trunca_id,
        {
          transaction,
        }
      );
    }

    //! Obtener la planilla del trabajador
    let planillaMensualTrunca = null;

    if (trabajador_dado_de_baja.planilla_mensual_trunca_id) {
      planillaMensualTrunca = await db.planilla_mensual.findByPk(
        trabajador_dado_de_baja.planilla_mensual_trunca_id,
        {
          transaction,
        }
      );
    }

    const { trabajador, ...resto } = trabajador_dado_de_baja.dataValues;

    const respuesta_detalle_liquidacion = {
      id: resto.id,
      contrato_id: resto.contrato_id,
      fecha_ingreso: resto.fecha_ingreso,
      fecha_baja: resto.fecha_baja,
      motivo: resto.motivo,
      observacion: resto.observacion,
      estado_liquidacion: resto.estado_liquidacion,
      tiempo_laborado: {
        anios: resto.tiempo_laborado_anios,
        meses: resto.tiempo_laborado_meses,
        dias: resto.tiempo_laborado_dias,
      },
      tiempo_computado: { // tiempo del ultimo contrato vigente
        anios: resto.tiempo_computado_anios,
        meses: resto.tiempo_computado_meses,
        dias: resto.tiempo_computado_dias,
      },
    };
    

    const respuesta = {

      trabajador: trabajador_dado_de_baja.trabajador.dataValues,
      contrato: trabajador_dado_de_baja.contrato.dataValues,
      filial: {
        id: contrato_laboral.empresa_proveedora.id,
        nombre: contrato_laboral.empresa_proveedora.razon_social,
        ruc: contrato_laboral.empresa_proveedora.ruc,
        direccion: contrato_laboral.empresa_proveedora.direccion,
      },

      detalle_liquidacion: respuesta_detalle_liquidacion,
      gratificacion: gratificacionTrunca.dataValues,
      cts: ctsTrunca.dataValues,
      planilla_mensual: planillaMensualTrunca.dataValues
    };

    return {
      codigo: 200,
      respuesta: {
        mensaje: "Liquidación del trabajador",
        liquidacion: respuesta,
      },
    };
}
}

module.exports = SequelizeDarBajaTrabajadorRepository;
