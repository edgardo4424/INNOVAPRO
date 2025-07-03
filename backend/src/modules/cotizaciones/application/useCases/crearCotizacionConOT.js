const db = require("../../../../models");
const Despiece = require("../../../despieces/domain/entities/despiece");
const {
  calcularMontosCotizacion,
} = require("../../infrastructure/services/calcularMontosCotizacionService");

const ID_ESTADO_COTIZACION_DESPIECE_GENERADO = 2;
const ID_ESTADO_COTIZACION_POR_APROBAR = 3;

const sequelizeDespieceRepository = require("../../../despieces/infrastructure/repositories/sequelizeDespieceRepository");
const {
  mapearDetallesDespiece,
} = require("../../infrastructure/services/mapearDetallesDespieceService");
const {
  generarCodigoDocumentoCotizacion,
} = require("../../infrastructure/services/generarCodigoDocumentoCotizacionService");
const calcularCostoTransporte = require("../../../cotizaciones_transporte/application/useCases/calcularCostoTransporte");
const despieceRepository = new sequelizeDespieceRepository();

const AtributoValor = require("../../../atributos_valor/domain/entities/atributos_valor");
const {
  actualizarDespiecesDetalle,
} = require("../../infrastructure/services/actualizarDespiecesDetalleService2");
const {
  mapearValoresAtributos,
} = require("../../infrastructure/services/mapearValoresAtributosService");

module.exports = async (cotizacionData, cotizacionRepository) => {
  const transaction = await db.sequelize.transaction(); // Iniciar transacción

  try {
   
    const { uso_id, cotizacion, despiece, zonas } = cotizacionData;

    if (despiece.length == 0)
      return {
        codigo: 400,
        respuesta: { mensaje: "No hay piezas en el despiece." },
      };

    // 1. Buscar cotizacion por id con estado Por Aprobar (3)

    const cotizacionEncontrada = await cotizacionRepository.obtenerPorId(
      cotizacion.id
    );

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

    const filialEncontrado = await db.empresas_proveedoras.findByPk(
      cotizacionEncontrada.filial_id
    );
    const usuarioEncontrado = await db.usuarios.findByPk(
      cotizacionEncontrada.usuario_id
    );

      // Insertar Atributos Valor

    const tareaEncontrada = await db.tareas.findOne({
      where: {
       cotizacionId:  cotizacionEncontrada.id
      }
    })

    const atributosValor = await mapearValoresAtributos({
      uso_id,
      despiece_id: cotizacionEncontrada.despiece_id,
      zonas, // Vienen los atributos por zona
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

    // Conseguir el cp del despiece 
    const despieceEncontrado = await db.despieces.findByPk(cotizacionEncontrada.despiece_id)

    const datosParaGenerarCodigoDocumento = {
      uso_id_para_registrar: uso_id,
      filial_razon_social: filialEncontrado.razon_social,
      usuario_rol: usuarioEncontrado.rol,
      usuario_nombre: usuarioEncontrado.nombre,
      anio_cotizacion: new Date().getFullYear(),
      estado_cotizacion: cotizacionEncontrada.estados_cotizacion_id,

      cotizacion: cotizacionEncontrada,
      cp: despieceEncontrado.cp
    };

    const codigoDocumento = await generarCodigoDocumentoCotizacion(
      datosParaGenerarCodigoDocumento
    );

    // Actualizar las piezas en despieces_detalle, porque puede suceder que el comercial añada nuevas piezas
    // o quite piezas

    await actualizarDespiecesDetalle({
      despiece_id: cotizacionEncontrada.despiece_id,
      despiece: despiece,
      transaction,
    });

  

    // Calcular montos
    const resultados = calcularMontosCotizacion({
      despiece,
      tipoCotizacion: cotizacionEncontrada.tipo_cotizacion,
      cotizacion,
      uso_id,
    });

    // Actualizar Despiece

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

    // Insertar precios de transporte

    if (cotizacion?.tiene_transporte) {
      const totalKg = despiece.reduce((acumulador, item) => {
        return acumulador + (item.peso_kg || 0); // suma solo si existe el campo cantidad
      }, 0);

      let datosParaCalcularCostoTransporte = {
        uso_id: uso_id,
        peso_total_tn: (totalKg / 1000).toFixed(2),
        distrito_transporte: cotizacion?.distrito_transporte,
      };

      switch (uso_id + "") {
        case "2":
          // Andamio de trabajo
          break;
        case "3":
          // Escaleras de acceso
          let numero_tramos = atributos_formulario[0].alturaTotal / 2;
          if (atributos_formulario[0].alturaTotal % 2 !== 0) {
            numero_tramos = numero_tramos + 0.5;
          }

          datosParaCalcularCostoTransporte.numero_tramos = numero_tramos;
          break;

        case "5":
          
          // Puntales
          const { transporte_puntales } = cotizacion;

          datosParaCalcularCostoTransporte = {
            ...datosParaCalcularCostoTransporte,
            transporte_puntales: transporte_puntales
          }
          break;

        case "7":
          // Plataforma de Descarga
          datosParaCalcularCostoTransporte.cantidad =
            atributos_formulario.length;

          break;

        default:
          break;
      }

      const datosParaGuardarCotizacionesTransporte = (
        await calcularCostoTransporte(datosParaCalcularCostoTransporte)
      ).respuesta;

      const mapeoDataGuardar = {
        cotizacion_id: cotizacionEncontrada.id,
        uso_id: uso_id,

        distrito_transporte:
          datosParaGuardarCotizacionesTransporte.distrito_transporte,
        tarifa_transporte_id:
          datosParaGuardarCotizacionesTransporte.tarifa_transporte_id
            ? datosParaGuardarCotizacionesTransporte.tarifa_transporte_id
            : null,
        tipo_transporte: cotizacion.tipo_transporte,
        unidad: datosParaGuardarCotizacionesTransporte.unidad,
        cantidad: datosParaGuardarCotizacionesTransporte.cantidad,

        costo_tarifas_transporte: cotizacion.costo_tarifas_transporte,
        costo_distrito_transporte: cotizacion.costo_distrito_transporte,
        costo_pernocte_transporte: cotizacion.costo_pernocte_transporte,

        costo_total: (
          Number(cotizacion.costo_tarifas_transporte) +
          Number(cotizacion.costo_distrito_transporte) +
          Number(cotizacion.costo_pernocte_transporte)
        ).toFixed(2),
      };

      await db.cotizaciones_transporte.create(mapeoDataGuardar, {
        transaction,
      });
    }

    // Insertar precios de instalacion

    let tipo_instalacion;

    if (cotizacion.tiene_instalacion) {
      switch (cotizacion.tipo_instalacion) {
        case "COMPLETA":
          tipo_instalacion = "Completa";

          const dataInstalacionCompleta = {
            cotizacion_id: cotizacionEncontrada.id,
            tipo_instalacion: tipo_instalacion,
            precio_instalacion_completa_soles:
              cotizacion.precio_instalacion_completa,
            precio_instalacion_parcial_soles: 0,
            /* nota: cotizacion.nota_instalacion */
          };

          await db.cotizaciones_instalacion.create(dataInstalacionCompleta, {
            transaction,
          });

          break;

        case "PARCIAL":
          tipo_instalacion = "Parcial";

          const dataInstalacionParcial = {
            cotizacion_id: cotizacionEncontrada.id,
            tipo_instalacion: tipo_instalacion,
            precio_instalacion_completa_soles:
              cotizacion.precio_instalacion_completa,
            precio_instalacion_parcial_soles:
              cotizacion.precio_instalacion_parcial,
            nota: cotizacion.nota_instalacion,
          };

          await db.cotizaciones_instalacion.create(dataInstalacionParcial, {
            transaction,
          });
          break;

        default:
          break;
      }
    }

    // Actualizar la cotizacion, que ya fue creada al crear la tarea

    const dataActualizarCotizacion = {
      codigo_documento: codigoDocumento,
      estados_cotizacion_id: ID_ESTADO_COTIZACION_POR_APROBAR,
      tiene_transporte: cotizacion.tiene_transporte,
      tiene_instalacion: cotizacion.tiene_instalacion,
    };

    const cotizacionActualizada =
      await cotizacionRepository.actualizarCotizacion(
        cotizacion.id,
        dataActualizarCotizacion,
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
