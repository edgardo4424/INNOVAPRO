const db = require("../../../../models");
const Despiece = require("../../../despieces/domain/entities/despiece");
const {
  calcularMontosCotizacion,
} = require("../../infrastructure/services/calcularMontosCotizacionService");

const ID_ESTADO_COTIZACION_DESPIECE_GENERADO= 2;
const ID_ESTADO_COTIZACION_POR_APROBAR = 3;

const sequelizeDespieceRepository = require("../../../despieces/infrastructure/repositories/sequelizeDespieceRepository");
const {
  mapearDetallesDespiece,
} = require("../../infrastructure/services/mapearDetallesDespieceService");
const { generarCodigoDocumentoCotizacion } = require("../../infrastructure/services/generarCodigoDocumentoCotizacionService");
const despieceRepository = new sequelizeDespieceRepository();

module.exports = async (cotizacionData, cotizacionRepository) => {
  const transaction = await db.sequelize.transaction(); // Iniciar transacción

  try {
    const { uso_id, cotizacion, despiece } = cotizacionData;

    if (despiece.length == 0)
      return {
        codigo: 400,
        respuesta: { mensaje: "No hay piezas en el despiece." },
      };

    // 1. Buscar cotizacion por id con estado Por Aprobar (3)

    const cotizacionEncontrada = await cotizacionRepository.obtenerPorId(
      cotizacion.id
    );

    console.log("cotizacionEncontrada", cotizacionEncontrada);

    if (
      cotizacionEncontrada.estados_cotizacion_id !=
      ID_ESTADO_COTIZACION_DESPIECE_GENERADO
    ) {
      return {
        codigo: 400,
        respuesta: {
          mensaje: "Esta cotización no fue creada con la ayuda de OT",
        },
      };
    }

    
      const filialEncontrado = await db.empresas_proveedoras.findByPk(cotizacionEncontrada.filial_id)
      const usuarioEncontrado = await db.usuarios.findByPk(cotizacionEncontrada.usuario_id)

      const datosParaGenerarCodigoDocumento = {

      uso_id_para_registrar: uso_id,
      filial_razon_social: filialEncontrado.razon_social,
      usuario_rol: usuarioEncontrado.rol,
      usuario_nombre: usuarioEncontrado.nombre,
      anio_cotizacion: new Date().getFullYear(),
      estado_cotizacion: cotizacionEncontrada.estados_cotizacion_id,
      
      cotizacion: cotizacionEncontrada
    }

    const codigoDocumento = await generarCodigoDocumentoCotizacion(datosParaGenerarCodigoDocumento)

    console.log('codigoDocumento', codigoDocumento);

    const dataActualizarCotizacion = {
      codigo_documento: codigoDocumento,
      estados_cotizacion_id: ID_ESTADO_COTIZACION_POR_APROBAR
    }

     const cotizacionActualizada = await cotizacionRepository.actualizarCotizacion(cotizacion.id, dataActualizarCotizacion, transaction)

     console.log('cotizacionActualizada', cotizacionActualizada);

    // 1. Insertar las piezas nuevas que fueron añadidas por el comercial (piezas con uuid)

    const piezasNuevas = despiece.filter((pieza) => pieza?.esAdicional);

    const detalles = mapearDetallesDespiece({
      despiece: piezasNuevas,
      despiece_id: cotizacionEncontrada.despiece_id,
    });

    await db.despieces_detalle.bulkCreate(detalles);

    // 2. Calcular montos
    const resultados = calcularMontosCotizacion({
      despiece,
      tipoCotizacion: cotizacionEncontrada.tipo_cotizacion,
      cotizacion,
      uso_id,
    });

    console.log('resultados', resultados.dataParaGuardarDespiece);

    // 3. Actualizar Despiece

    let dataParaDespiece = {
      ...resultados.dataParaGuardarDespiece,
      tiene_pernos: cotizacion.tiene_pernos,
    };

    // Valida los campos del despiece
    const errorCampos = Despiece.validarCamposObligatorios(
      dataParaDespiece,
      "editar"
    );

    if (errorCampos)
      return { codigo: 400, respuesta: { mensaje: errorCampos } };

    await despieceRepository.actualizarDespiece(
      cotizacionEncontrada.despiece_id,
      dataParaDespiece,
      transaction
    );

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
