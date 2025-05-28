const db = require("../../../../models");
const {
  calcularMontosCotizacion,
} = require("../../infrastructure/services/calcularMontosCotizacionService");
const {
  mapearDetallesDespiece,
} = require("../../infrastructure/services/mapearDetallesDespieceService");

const Despiece = require("../../../despieces/domain/entities/despiece");
const DespieceDetalle = require("../../../despieces_detalles/domain/entities/despieces_detalles");
const AtributoValor = require("../../../atributos_valor/domain/entities/atributos_valor");
const Cotizacion = require("../../domain/entities/cotizacion");
const {
  mapearValoresAtributos,
} = require("../../infrastructure/services/mapearValoresAtributosService");

const calcularCostoTransporte = require("../../../cotizaciones_transporte/application/useCases/calcularCostoTransporte");
const { generarCodigoDocumentoCotizacion } = require("../../infrastructure/services/generarCodigoDocumentoCotizacionService");

const ID_ESTADO_COTIZACION_CREADO = 1;

module.exports = async (cotizacionData, cotizacionRepository) => {
  const transaction = await db.sequelize.transaction(); // Iniciar transacción

  try {
    const {
      uso_id,
      atributos_formulario,
      cotizacion,
      despiece,
    } = cotizacionData;

    if (despiece.length == 0)
      return {
        codigo: 400,
        respuesta: { mensaje: "No hay piezas en el despiece." },
      };

    // 1. Calcular montos
    const resultados = calcularMontosCotizacion({
      despiece,
      tipoCotizacion: cotizacion.tipo_cotizacion,
      cotizacion,
    });

    // 2. Insertar Despiece

    let dataParaDespiece = {
      ...resultados.dataParaGuardarDespiece,
      cp: "CP0"
    }

    // Valida los campos del despiece
    const errorCampos = Despiece.validarCamposObligatorios( dataParaDespiece,"crear");

    if (errorCampos)
      return { codigo: 400, respuesta: { mensaje: errorCampos } };

    const nuevoDespiece = await db.despieces.create(dataParaDespiece,{ transaction });

    const despiece_id = nuevoDespiece.id;

    // 3. Insertar Detalles del Despiece
    const detalles = mapearDetallesDespiece({ despiece, despiece_id });

    // Validación de todos los registros de despiece
    for (const data of detalles) {
      const errorCampos = DespieceDetalle.validarCamposObligatorios(data, "crear");
      if (errorCampos) {
        return {
          codigo: 400,
          respuesta: { mensaje: `Error en un registro: ${errorCampos}` },
        };
      }
    }

    await db.despieces_detalle.bulkCreate(detalles, { transaction });

    // 4. Insertar Atributos Valor
    const atributosValor = await mapearValoresAtributos({
      uso_id,
      despiece_id,
      atributos_formulario,
    });

    // Validación de todos los atributos valor
    for (const data of atributosValor) {
      const errorCampos = AtributoValor.validarCamposObligatorios(
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

    await db.atributos_valor.bulkCreate(atributosValor, { transaction });

    // 5. Insertar Cotización
    let cotizacionFinal = {
      ...cotizacion,
      despiece_id,
      estados_cotizacion_id: ID_ESTADO_COTIZACION_CREADO, // Estado de "Creado"
    };

    console.log('cotizacionFinal.filial_id', cotizacionFinal.filial_id);
    const filialEncontrado = await db.empresas_proveedoras.findByPk(cotizacionFinal.filial_id)
    const usuarioEncontrado = await db.usuarios.findByPk(cotizacionFinal.usuario_id)

    const datosParaGenerarCodigoDocumento = {

      uso_id_para_registrar: uso_id,
      filial_razon_social: filialEncontrado.razon_social,
      usuario_rol: usuarioEncontrado.rol,
      usuario_nombre: usuarioEncontrado.nombre,
      anio_cotizacion: new Date().getFullYear(),
      estado_cotizacion: cotizacionFinal.estados_cotizacion_id,
      
      cotizacion: cotizacionFinal
    }

    console.log('datosParaGenerarCodigoDocumento', datosParaGenerarCodigoDocumento);
    const codigoDocumento = await generarCodigoDocumentoCotizacion(datosParaGenerarCodigoDocumento)
    console.log('codigoDocumento',codigoDocumento);

    cotizacionFinal = {
      ...cotizacionFinal,
      codigo_documento: codigoDocumento
    }
      
    // Obtener el codigo documento
  /* const codigoDocumento = await generarCodigoDocumentoCotizacion({
        filial_id: cotizacion.filial_id,
        filial_razon_social: filialEncontrado.razon_social,
        usuario_id: cotizacion.usuario_id,
        usuario_rol: usuarioEncontrado.rol,
        usuario_nombre: usuarioEncontrado.nombre,
        anio_cotizacion: new Date().getFullYear(),
        estado_cotizacion: 1, // Creado
      })

      console.log('codigoDocumento',codigoDocumento); */

    // Valida los campos de la Cotizacion
    const errorCamposCotizacion = Cotizacion.validarCamposObligatorios(
      cotizacionFinal,
      "crear"
    );
    if (errorCampos)
      return { codigo: 400, respuesta: { mensaje: errorCamposCotizacion } };

    const cotizacionCreada = await cotizacionRepository.crear(
      cotizacionFinal,
      transaction
    );

    // 6. Insertar precios de transporte

    if (cotizacion?.tiene_transporte) {
      
      const totalKg = despiece.reduce((acumulador, item) => {
        return acumulador + (item.peso_kg || 0); // suma solo si existe el campo cantidad
      }, 0);

      let datosParaCualcularCostoTransporte = {
        uso_id: uso_id,
        peso_total_tn: (totalKg/1000).toFixed(2),
        distrito_transporte: cotizacion?.distrito_transporte,
      };

      switch (uso_id+"") {
        case "2":
          // Andamio de trabajo
          break;
        case "3":
          // Escaleras de acceso
          break;
        
        case "5":
          // Puntales
          const subtipo = atributos_formulario[0].tipoPuntal.split("-")[0].trim()

          datosParaCualcularCostoTransporte = {
            ...datosParaCualcularCostoTransporte,
            tipo_puntal: subtipo
          }
        break;
      
        default:
          break;
      }



      const datosParaGuardarCotizacionesTransporte =  (await calcularCostoTransporte(datosParaCualcularCostoTransporte)).respuesta;

      const mapeoDataGuardar = {
        cotizacion_id: cotizacionCreada.id,
        uso_id: uso_id, 
        
        distrito_transporte:datosParaGuardarCotizacionesTransporte.distrito_transporte,
        tarifa_transporte_id: datosParaGuardarCotizacionesTransporte.tarifa_transporte_id,
        tipo_transporte: datosParaGuardarCotizacionesTransporte.tipo_transporte,
        unidad: datosParaGuardarCotizacionesTransporte.unidad,
        cantidad: datosParaGuardarCotizacionesTransporte.cantidad,

        costo_tarifas_transporte: datosParaGuardarCotizacionesTransporte.costosTransporte.costo_tarifas_transporte,
        costo_distrito_transporte: datosParaGuardarCotizacionesTransporte.costosTransporte.costo_distrito_transporte,
        costo_pernocte_transporte: datosParaGuardarCotizacionesTransporte.costosTransporte.costo_pernocte_transporte,
        costo_total: datosParaGuardarCotizacionesTransporte.costosTransporte.costo_total,

        
      }

      await db.cotizaciones_transporte.create(mapeoDataGuardar, { transaction })
    }

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
