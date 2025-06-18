const db = require("../../../../models");
const Despiece = require("../../../despieces/domain/entities/despiece");
const { calcularMontosCotizacion } = require("../../infrastructure/services/calcularMontosCotizacionService");

const ID_ESTADO_COTIZACION_POR_APROBAR = 3;

const sequelizeDespieceRepository = require('../../../despieces/infrastructure/repositories/sequelizeDespieceRepository');
const despieceRepository = new sequelizeDespieceRepository(); 

module.exports = async (cotizacionData, cotizacionRepository) => {
  const transaction = await db.sequelize.transaction(); // Iniciar transacción

  try {
    const {
      uso_id,
      cotizacion,
      despiece,
    } = cotizacionData;

    if (despiece.length == 0)
      return {
        codigo: 400,
        respuesta: { mensaje: "No hay piezas en el despiece." },
      };

    // 1. Buscar cotizacion por id con estado Por Aprobar (3)

      const cotizacionEncontrada = await cotizacionRepository.obtenerPorId(cotizacion.id)

      console.log('cotizacionEncontrada', cotizacionEncontrada);

      if(cotizacionEncontrada.estados_cotizacion_id != ID_ESTADO_COTIZACION_POR_APROBAR){
         return {
          codigo: 400,
          respuesta: { mensaje: "Esta cotización no fue creada con la ayuda de OT" },
        };
      }

      // 1. Calcular montos
    const resultados = calcularMontosCotizacion({
      despiece,
      tipoCotizacion: cotizacion.tipo_cotizacion,
      cotizacion,
      uso_id
    });

    console.log('resultados', resultados);

    // 2. Actualizar Despiece

    let dataParaDespiece = {
      ...resultados.dataParaGuardarDespiece,
      tiene_pernos: cotizacion.tiene_pernos
    }
     // Valida los campos del despiece
    const errorCampos = Despiece.validarCamposObligatorios( dataParaDespiece,"editar");

    if (errorCampos)
      return { codigo: 400, respuesta: { mensaje: errorCampos } };

    const despieceActualizado = await despieceRepository.actualizarDespiece(cotizacionEncontrada.despiece_id, dataParaDespiece)

    console.log('despieceActualizado', despieceActualizado);
asd
    await transaction.commit(); // ✔ Confirmar todo
    return {
      codigo: 201,
      respuesta: { mensaje: "Cotización creada exitosamente" },
    };
  } catch (error) {
    await transaction.rollback(); // ❌ Deshacer todo si algo falla
    console.error("Error en creación de cotización:", error);
    return {
      codigo: 500,
      respuesta: { mensaje: "Error al crear la cotización" },
    };
  }
};
