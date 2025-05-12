const Cotizacion = require("../../domain/entities/cotizacion"); // Importamos la clase Cotizacion
const Despiece = require("../../../despieces/domain/entities/despiece");
const DespieceDetalle = require("../../../despieces_detalles/domain/entities/despieces_detalles");
const AtributoValor = require("../../../atributos_valor/domain/entities/atributos_valor");

const db = require("../../../../models"); // Llamamos los modelos sequalize de la base de datos
const { guardarLosValoresDeAtributosService } = require("../../infrastructure/services/mapearValoresAtributosService");

module.exports = async (cotizacionData, cotizacionRepository) => {

  // Captura las llaves que vienen del formulario
  const { uso_id, atributos_formulario, cotizacion, despiece } = cotizacionData;

  // Valida los campos del despiece
  const errorCampos = Despiece.validarCamposObligatorios(despiece, "crear"); 
  if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } };

  // El subtotal al inicio es 0, pero mas adelante al registrar en piezas_detalles se actualizara el subtotal en la tabla despiece
  const despieceInicial = {
    subtotal: 0,
  };

  // Creando el despiece para generar solo el id,
  /*const despieceGuardadoInicial = await despieceRepository.crear(despieceInicial);*/

  // Mapear el listado del despiece, añadiendole el id del despiece registrado
  const piezasDelDespieceConIdDelDespiece = despiece.map(pieza => ({
    ...pieza,
    despiece_id: 100,
    cantidad: pieza.total
  }))

  console.log('piezasDelDespieceConIdDelDespiece', piezasDelDespieceConIdDelDespiece);

  // Validación de todos los registros de despiece
  for (const data of piezasDelDespieceConIdDelDespiece) {
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

  // Guardar las piezas que pertenecen al despiece

  const despiecesAGuardar = despiece.map((pieza) => ({
    pieza_id: pieza.pieza_id,
    cantidad: parseFloat(pieza.total),
    peso_kg: parseFloat(pieza.peso_kg),
    precio_venta_dolares: parseFloat(pieza.precio_venta_dolares),
    precio_venta_soles: parseFloat(pieza.precio_venta_soles),
    precio_alquiler_soles: parseFloat(pieza.precio_alquiler_soles),
  }));

  console.log('despeicesAGuardar', despiecesAGuardar);

  // Desestructurar el tipo cotizacion y el igv porcentaje de cotizacion
  const { tipo_cotizacion, igv_porcentaje, porcentaje_descuento } = cotizacion;

  const igvPorcentaje = parseFloat(igv_porcentaje) 
  const porcentajeDescuento = parseFloat(porcentaje_descuento)

  let moneda;
  let subtotal;

  // Calcular el subtotal dependiendo si es:
  // Alquiler: El precio del alquiler se considera en soles (PEN)
  // Venta: El precio de venta se considera en dolares (USD)
  switch (tipo_cotizacion) {
    case "Alquiler":
      subtotal = despiecesAGuardar.reduce((acc, item) => acc + item.precio_alquiler_soles, 0);
      moneda = "PEN"
      break;
   case "Venta":
      subtotal = despiecesAGuardar.reduce((acc, item) => acc + item.precio_venta_dolares, 0);
      moneda = "USD"
      break;
    default:
      break;
  }

  // Calculando los subtotales
  let subtotal_con_descuento = parseFloat(((100-porcentajeDescuento)*subtotal*0.01).toFixed(2));
  let igv_monto = parseFloat((subtotal_con_descuento*igvPorcentaje*0.01).toFixed(2))

  // Calculando el total de la cotizacion
  let total = subtotal_con_descuento + igv_monto


  const dataParaGuardarDespiece = {
    moneda: moneda,
    subtotal: parseFloat(subtotal.toFixed(2)),
    porcentaje_descuento: porcentajeDescuento,
    subtotal_con_descuento: subtotal_con_descuento,
    igv_porcentaje: igvPorcentaje,
    igv_monto: igv_monto,
    total_final: total
  }

  console.log('dataParaGuardarDespiece', dataParaGuardarDespiece);

  // Guardar las piezas en la tabla despieces_detalle
  /*const despiecesDetallesNuevos = await despieceDetalleRepository.crearVariosDespiecesDetalles(despiecesAGuardar);*/

  // Calcular subtotal, porcentaje_descuento, subtotal_con_descuento, igv_porcentaje, igv_monto y total_final en la tabla despieces
  

  // Mapear los atributos_formulario que viene del frontend, para guardarlo en la base de datos
  const valoresDeAtributos = await guardarLosValoresDeAtributosService({uso_id, despiece_id: 100, atributos_formulario})

  // Validación de todos los atributos valor
  for (const data of valoresDeAtributos) {
    const errorCampos = AtributoValor.validarCamposObligatorios(data, "crear");
    if (errorCampos) {
      return {
        codigo: 400,
        respuesta: { mensaje: `Error en un registro: ${errorCampos}` },
      };
    }
  }
  console.log('valoresDeAtributos', valoresDeAtributos);
  /* await atributosValorRepository.crear(atributosParaGuardar); */

  const cotizacionConIdDespiece = {
    ...cotizacion,
    despiece_id: 100
  }

  console.log('cotizacionConIdDespiece', cotizacionConIdDespiece);

  /* const objCotizacion = new Cotizacion(cotizacionConIdDespiece);
  const nuevaCotizacion = await cotizacionRepository.crear(cotizacionData); // Creamos la nueva cotizacion con todos sus datos en la base de datos
  
 */
  return {
    codigo: 201,
    respuesta: { mensaje: "Cotizacion creado exitosamente", cotizacion: "" },
  }; // Retornamos la cotizacion creada
}; // Exporta la función para que pueda ser utilizada en otros módulos
