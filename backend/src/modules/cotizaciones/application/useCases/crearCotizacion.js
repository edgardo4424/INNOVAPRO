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
const {
  generarCodigoDocumentoCotizacion,
} = require("../../infrastructure/services/generarCodigoDocumentoCotizacionService");
const {
  enviarNotificacionTelegram,
} = require("../../../notificaciones/infrastructure/services/enviarNotificacionTelegram");

const ID_ESTADO_COTIZACION_POR_APROBAR = 3;

module.exports = async (cotizacionData, cotizacionRepository) => {


  const transaction = await db.sequelize.transaction(); // Iniciar transacción

  try {
    const {
      uso_id,
      zonas, // Vienen los atributos por zona
      cotizacion,
      despiece,
    } = cotizacionData;

    /* if (despiece.length == 0)
      return {
        codigo: 400,
        respuesta: { mensaje: "No hay piezas en el despiece." },
      }; */

    // 1. Calcular montos
    const resultados = calcularMontosCotizacion({
      despiece,
      tipoCotizacion: cotizacion.tipo_cotizacion,
      cotizacion,
      uso_id,
      zonas,
    });

    
    console.log('holi');
    // 2. Insertar Despiece

    let dataParaDespiece = {
      ...resultados.dataParaGuardarDespiece,
      cp: "0",
      tiene_pernos: cotizacion.tiene_pernos,
    };

    if (uso_id == "3") {
      // Si es escalera de acceso, se añade detalles_opcionales
      dataParaDespiece.detalles_opcionales = cotizacion.detalles_escaleras;
    }

    if(uso_id == "4"){
      // Si es escuadras con plataforma, se añade detalles_opcionales
      dataParaDespiece.detalles_opcionales = cotizacion.detalles_escuadras;
    }

    if(uso_id == "8"){
      // Si es colgante, se añade detalles_opcionales
      dataParaDespiece.detalles_opcionales = cotizacion.detalles_colgantes
    }

    // Valida los campos del despiece
    const errorCampos = Despiece.validarCamposObligatorios(
      dataParaDespiece,
      "crear"
    );

    if (errorCampos)
      return { codigo: 400, respuesta: { mensaje: errorCampos } };

    const nuevoDespiece = await db.despieces.create(dataParaDespiece, {
      transaction,
    });

   
    const despiece_id = nuevoDespiece.id;

    console.log('DESPEIEEEEEEEEECEEEEEE', despiece);

    // 3. Insertar Detalles del Despiece

    const detalles = mapearDetallesDespiece({ despiece, despiece_id });

    console.log('detalles', detalles);
    // Validación de todos los registros de despiece
    for (const data of detalles) {
      const errorCampos = DespieceDetalle.validarCamposObligatorios(
        data,
        "crear"
      );
      if (errorCampos) {
        console.log("Registro inválido", data, "->", errorCampos);
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

    // 5. Insertar Cotización
    let cotizacionFinal = {
      ...cotizacion,
      despiece_id,
      estados_cotizacion_id: ID_ESTADO_COTIZACION_POR_APROBAR, // Estado de "Por aprobar"
    };

    const filialEncontrado = await db.empresas_proveedoras.findByPk(
      cotizacionFinal.filial_id
    );
    const usuarioEncontrado = await db.usuarios.findByPk(
      cotizacionFinal.usuario_id
    );

    const datosParaGenerarCodigoDocumento = {
      uso_id_para_registrar: uso_id,
      filial_razon_social: filialEncontrado.razon_social,
      usuario_rol: usuarioEncontrado.rol,
      usuario_nombre: usuarioEncontrado.nombre,
      //anio_cotizacion: new Date().getFullYear(),
      estado_cotizacion: cotizacionFinal.estados_cotizacion_id,

      cotizacion: cotizacionFinal,
      cp: nuevoDespiece.cp,
    };

    const codigoDocumento = await generarCodigoDocumentoCotizacion(
      datosParaGenerarCodigoDocumento
    );

    cotizacionFinal = {
      ...cotizacionFinal,
      codigo_documento: codigoDocumento,
      uso_id: uso_id,
    };

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
          const { detalles_escaleras } = cotizacion;

          datosParaCalcularCostoTransporte = {
            ...datosParaCalcularCostoTransporte,
            numero_tramos:
              Number(detalles_escaleras?.tramos_2m || 0) +
              Number(detalles_escaleras?.tramos_1m || 0),
          };

          break;
        case "4":
          // Escuadras con plataforma
          break;
        case "5":
          // Puntales
          const { transporte_puntales } = cotizacion;

          datosParaCalcularCostoTransporte = {
            ...datosParaCalcularCostoTransporte,
            transporte_puntales: transporte_puntales,
          };

          break;

        case "7":
          // Plataforma de Descarga
          const { cantidad } = cotizacion;

          datosParaCalcularCostoTransporte = {
            ...datosParaCalcularCostoTransporte,
            cantidad: cantidad,
          };
          break;

          case "8":
          // Colgante

          break;

        default:
          break;
      }

      console.log('datosParaCalcularCostoTransporte', datosParaCalcularCostoTransporte);
      const datosParaGuardarCotizacionesTransporte = (
        await calcularCostoTransporte(datosParaCalcularCostoTransporte)
      ).respuesta;

      const mapeoDataGuardar = {
        cotizacion_id: cotizacionCreada.id,
        uso_id: uso_id,

        distrito_transporte:
          datosParaGuardarCotizacionesTransporte.distrito_transporte,
        tarifa_transporte_id:
          datosParaGuardarCotizacionesTransporte.tarifa_transporte_id
            ? datosParaGuardarCotizacionesTransporte.tarifa_transporte_id
            : null,
        tipo_transporte: cotizacion.tipo_transporte,
        unidad: datosParaGuardarCotizacionesTransporte.unidad || "Und",
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

    // 7. Insertar precios de instalacion

    let tipo_instalacion;

    if (cotizacion.tiene_instalacion) {
      switch (cotizacion.tipo_instalacion) {
        case "COMPLETA":
          tipo_instalacion = "Completa";

          const dataInstalacionCompleta = {
            cotizacion_id: cotizacionCreada.id,
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
            cotizacion_id: cotizacionCreada.id,
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
