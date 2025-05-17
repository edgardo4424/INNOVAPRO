const db = require("../../../../models");
const { calcularMontosCotizacion } = require("../../infrastructure/services/calcularMontosCotizacionService");
const { mapearDetallesDespiece } = require("../../infrastructure/services/mapearDetallesDespieceService");

const Despiece = require("../../../despieces/domain/entities/despiece");
const DespieceDetalle = require("../../../despieces_detalles/domain/entities/despieces_detalles");
const AtributoValor = require("../../../atributos_valor/domain/entities/atributos_valor");
const Cotizacion = require("../../domain/entities/cotizacion");
const { mapearValoresAtributos } = require("../../infrastructure/services/mapearValoresAtributosService");


module.exports = async (cotizacionData, cotizacionRepository) => {
  const transaction = await db.sequelize.transaction(); // Iniciar transacción

  try {
    const { uso_id, atributos_formulario, cotizacion, despiece } = cotizacionData;

    if(despiece.length == 0) return { codigo: 400, respuesta: { mensaje: "No hay piezas en el despiece." } };

    // 1. Calcular montos
    const resultados = calcularMontosCotizacion({despiece, tipoCotizacion: cotizacion.tipo_cotizacion, cotizacion});
    
    // 2. Insertar Despiece

    // Valida los campos del despiece
    const errorCampos = Despiece.validarCamposObligatorios(resultados.dataParaGuardarDespiece, "crear"); 
    if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } };

    const nuevoDespiece = await db.despieces.create(resultados.dataParaGuardarDespiece, { transaction });

    const despiece_id = nuevoDespiece.id;

    // 3. Insertar Detalles del Despiece
    const detalles = mapearDetallesDespiece({despiece, despiece_id});

    // Validación de todos los registros de despiece
    for (const data of detalles) {
        const errorCampos = DespieceDetalle.validarCamposObligatorios(
        data,
        "crear"
        );
        if (errorCampos) {
        return {
            codigo: 400,
            respuesta: { mensaje: `Error en un registro: ${errorCampos}` },
        };
        }
    }

    await db.despieces_detalle.bulkCreate(detalles, { transaction });

    // 4. Insertar Atributos Valor
    const atributosValor = await mapearValoresAtributos({ uso_id, despiece_id, atributos_formulario });
    
    // Validación de todos los atributos valor
    for (const data of atributosValor) {
        const errorCampos = AtributoValor.validarCamposObligatorios(data, "crear");
        if (errorCampos) {
        return {
            codigo: 400,
            respuesta: { mensaje: `Error en un registro: ${errorCampos}` },
        };
        }
    }

    await db.atributos_valor.bulkCreate(atributosValor, { transaction });

    // 5. Insertar Cotización
    const cotizacionFinal = {
      ...cotizacion,
      despiece_id,
      estados_cotizacion_id: 1 // Estado de "Creado"
    };

    // Valida los campos de la Cotizacion
    const errorCamposCotizacion = Cotizacion.validarCamposObligatorios(resultados.dataParaGuardarDespiece, "crear"); 
    if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCamposCotizacion } };

    await cotizacionRepository.crear(cotizacionFinal, transaction);

    await transaction.commit(); // ✔ Confirmar todo
    return { codigo: 201, respuesta: { mensaje: "Cotización creada exitosamente" } };

  } catch (error) {
    await transaction.rollback(); // ❌ Deshacer todo si algo falla
    console.error("Error en creación de cotización:", error);
    return { codigo: 500, respuesta: { mensaje: "Error al crear la cotización" } };
  }
};