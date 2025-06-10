const CotizacionesTransporte = require("../../domain/entities/cotizaciones_transporte"); // Importamos la clase Obra
const db = require("../../../../models");
const { Op } = require("sequelize");

module.exports = async (
  cotizacionTransporteData,
  cotizacionesTransporteRepository
) => {

  const { uso_id, peso_total_tn, distrito_transporte } =  cotizacionTransporteData;

  // 1. Calcular costo tarifa transporte

  const uso = await db.usos.findByPk(uso_id);

  if (!uso) {
    return {
      codigo: 400,
      respuesta: {
        mensaje: "Uso no encontrado.",
      },
    };
  }

  if (!uso.grupo_tarifa) {
    return {
      codigo: 400,
      respuesta: {
        mensaje:
          "Precio de transporte no definido para el Uso, consultarlo con gerencia.",
      },
    };
  }

  // Inicializando los costos

  let costo_tarifas_transporte = 0;
  let costo_distrito_transporte = 0;
  let costo_pernocte_transporte = 0;

  let tarifa_transporte_encontrado;

  let unidad;
  let cantidadTotal;

  switch (uso.grupo_tarifa) {

    case "andamio_multidireccional":

      tarifa_transporte_encontrado = await db.tarifas_transporte.findOne({
        where: {
          grupo_tarifa: uso.grupo_tarifa,
          rango_desde: { [Op.lt]: peso_total_tn },
          rango_hasta: { [Op.gte]: peso_total_tn },
        },
      });

      costo_tarifas_transporte = Number(
        tarifa_transporte_encontrado?.precio_soles || 0
      );

      unidad = 'Tn';
      cantidadTotal = peso_total_tn;
      break;

    case "escaleras":
      const { numero_tramos } = cotizacionTransporteData;
      tarifa_transporte_encontrado = await db.tarifas_transporte.findOne({
        where: {
          grupo_tarifa: uso.grupo_tarifa,
          rango_desde: { [Op.lt]: numero_tramos },
          rango_hasta: { [Op.gte]: numero_tramos },
        },
      });

      costo_tarifas_transporte = Number(tarifa_transporte_encontrado?.precio_soles || 0);
       unidad = 'Tramo';
       cantidadTotal = numero_tramos;
      break;

    case "puntales":
      
      const { tipo_puntal } = cotizacionTransporteData;
      console.log('tipo_puntal', tipo_puntal);
      
      tarifa_transporte_encontrado = await db.tarifas_transporte.findOne({
        where: {
          grupo_tarifa: uso.grupo_tarifa,
          subtipo: tipo_puntal,
          rango_desde: { [Op.lt]: peso_total_tn },
          rango_hasta: { [Op.gte]: peso_total_tn },
        },
      });
      console.log("Tarifa encontrada:", tarifa_transporte_encontrado)
      costo_tarifas_transporte = Number(
        tarifa_transporte_encontrado?.precio_soles || 0
      );
       unidad = 'Tn';
      cantidadTotal = peso_total_tn;
      break;

    case "andamio_electrico":

      tarifa_transporte_encontrado = await db.tarifas_transporte.findOne({
        where: {
          grupo_tarifa: uso.grupo_tarifa,
          rango_desde: { [Op.lt]: cantidad },
          rango_hasta: { [Op.gte]: cantidad },
        },
      });

      costo_tarifas_transporte = Number(
       tarifa_transporte_encontrado?.precio_soles || 0
      );
      unidad = 'Andamio';
      cantidadTotal = cantidad;
      break;

    case "plataformas_de_descarga":
      tarifa_transporte_encontrado = await db.tarifas_transporte.findOne({
        where: {
          grupo_tarifa: uso.grupo_tarifa,
          rango_desde: { [Op.lt]: cantidad },
          rango_hasta: { [Op.gte]: cantidad },
        },
      });

      costo_tarifas_transporte = Number(
        tarifa_transporte_encontrado?.precio_soles || 0
      );
      unidad = 'Pd';
      cantidadTotal = cantidad;
      break;

    case "escuadras":
    
      const { tipo_escuadra } = cotizacionTransporteData;
      
      tarifa_transporte_encontrado = await db.tarifas_transporte.findOne({
        where: {
          grupo_tarifa: uso.grupo_tarifa,
          subtipo: tipo_escuadra,
          rango_desde: { [Op.lt]: cantidad },
          rango_hasta: { [Op.gte]: cantidad },
        },
      });

      costo_tarifas_transporte = Number(tarifa_transporte_encontrado?.precio_soles || 0);
      unidad = 'Und';
      cantidadTotal = cantidad;
      break;
    default:
      break;
  }



  // 2. Calcular costo segun el distrito

  const distrito_transporte_encontrado = await db.ubigeos.findOne({
    where: {
      distrito: distrito_transporte,
    },
  });

  // Si el distrito se encuentra dentro de la lista, se cobra un adicional. Si no está el costo_distrito_transporte sera 0
  console.log("TARIFA TRANSPORTE ENCONTRADO", tarifa_transporte_encontrado)
  if (distrito_transporte_encontrado && tarifa_transporte_encontrado) {
    switch (tarifa_transporte_encontrado.tipo_transporte) {
      case "Camioneta":
        costo_distrito_transporte = Number(
          distrito_transporte_encontrado.extra_camioneta_soles
        );
        break;
      case "Camión":
        costo_distrito_transporte = Number(
          distrito_transporte_encontrado.extra_camion_soles
        );
        break;
      default:
        break;
    }
  }

  // 3. Calcular costo pernocte transporte

  if(tarifa_transporte_encontrado){
    console.log(tarifa_transporte_encontrado);
  const costos_pernocte_transporte_encontrado =
    await db.costos_pernocte_transporte.findOne({
      where: {
        tipo_transporte: tarifa_transporte_encontrado.tipo_transporte,
      },
    });

  if (peso_total_tn <= costos_pernocte_transporte_encontrado.umbral_toneladas) {
    costo_pernocte_transporte = Number(
      costos_pernocte_transporte_encontrado.precio_soles
    );
  } else {
    return {
      codigo: 400,
      respuesta: {
        mensaje: "Consultar a gerencia.",
      },
    };
  }
  }

  // 4. Sumar los 3 costos

  const costo_total =
    costo_tarifas_transporte +
    costo_distrito_transporte +
    costo_pernocte_transporte; 

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Costo de transporte calculado",
      
      costosTransporte: {
        costo_tarifas_transporte,
        costo_distrito_transporte,
        costo_pernocte_transporte,
        costo_total,
      },

      tipo_transporte: tarifa_transporte_encontrado?.tipo_transporte || "",
      distrito_transporte: distrito_transporte,
      tarifa_transporte_id: tarifa_transporte_encontrado?.id || "",
      unidad: unidad || "",
      cantidad: cantidadTotal || 0
    },
  };
};
