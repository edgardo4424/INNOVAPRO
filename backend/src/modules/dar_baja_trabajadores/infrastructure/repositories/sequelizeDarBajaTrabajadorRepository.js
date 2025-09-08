const { BajasTrabajadores } = require("../models/BajasTrabajadoresModel");
const db = require("../../../../database/models");
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
            attributes: ["id", "nombre"],
         },
         {
            model: db.contratos_laborales,
            as: "contrato",
         }
      ]
   });

   const resultado = [];

   for (const baja of bajas) {
      const contratos = await db.contratos_laborales.findAll({
         where: {
            trabajador_id: baja.trabajador_id,
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
}

module.exports = SequelizeDarBajaTrabajadorRepository;
