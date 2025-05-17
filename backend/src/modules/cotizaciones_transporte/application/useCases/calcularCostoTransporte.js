const CotizacionesTransporte = require("../../domain/entities/cotizaciones_transporte"); // Importamos la clase Obra
const db = require("../../../../models");
const { Op } = require("sequelize");

module.exports = async (
  cotizacionTransporteData,
  cotizacionesTransporteRepository
) => {
  const { uso_id, peso_total_tn, cantidad, distrito_transporte } =  cotizacionTransporteData;

  // 1. Calcular costo tarifa transporte

  // Datos que necesito:
  // uso_id: para identificar el grupo_tarifa
  // peso_total_tn:

  /*
        if(grupo_tarifa=="andamio_multidireccional"){
            Calcular el precio en base al peso en Tn

        }
        if(grupo_tarifa == "puntales"){
            Verificar a que subtipo pertenece: 3m , 4m o 5m

            Calcular el precio en base al peso Tn
        }
        if(grupo_tarifa == "escaleras"){
            Calcular el precio en base a la cantidad de tramos
        }

        if(grupo_tarifa == "andamio_electrico"){
            Calcular el precio en base a la cantidad de andamios
        }

        if(grupo_tarifa == "plataformas_de_descarga"){
            Calcular el precio en base a la cantidad de pd
        }

        if(escuadras == "plataformas_de_descarga"){
           Verificar a que subtipo pertenece: 3m o 1m

           Calcular el precio en base a la cantidad de Und
        }
    */

  const uso = await db.usos.findByPk(uso_id);

  console.log('uso', uso);

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

  /* if (uso.grupo_tarifa == "andamio_multidireccional") {
    //  Calcular el precio en base al peso en Tn 
    tarifa_transporte_encontrado = await db.tarifas_transporte.findOne({
      where: {
        rango_desde: { [Op.lt]: peso_total_tn },
        rango_hasta: { [Op.gte]: peso_total_tn },
      },
    });

    costo_tarifas_transporte = Number( tarifa_transporte_encontrado.precio_soles);
  } */

  switch (uso.grupo_tarifa) {
    case "andamio_multidireccional":
        tarifa_transporte_encontrado = await db.tarifas_transporte.findOne({
            where: {
                grupo_tarifa: uso.grupo_tarifa,
                rango_desde: { [Op.lt]: peso_total_tn },
                rango_hasta: { [Op.gte]: peso_total_tn },
            },
        });

        costo_tarifas_transporte = Number( tarifa_transporte_encontrado.precio_soles);
        break;
    
    
    case "escaleras":
        tarifa_transporte_encontrado = await db.tarifas_transporte.findOne({
            where: {
                grupo_tarifa: uso.grupo_tarifa,
                rango_desde: { [Op.lt]: cantidad },
                rango_hasta: { [Op.gte]: cantidad },
            },
        });

        console.log('tarifa_transporte_encontrado', tarifa_transporte_encontrado);

        costo_tarifas_transporte = Number( tarifa_transporte_encontrado.precio_soles);
        break;

    default:
        break;
  }

  // 2. Calcular costo segun el distrito

  const distrito_transporte_encontrado = await db.distritos_transporte.findOne({
    where: {
      nombre: distrito_transporte,
    },
  });

  /*  if (!distrito_transporte_encontrado) {
    return {
      codigo: 400,
      respuesta: {
        mensaje: "Precio de transporte no definido para el distrito, consultarlo con gerencia.",
      },
    };
  } */

  // Si el distrito se encuentra dentro de la lista, se cobra un adicional. Si no está el costo_distrito_transporte sera 0
  if (distrito_transporte_encontrado) {
    switch (tarifa_transporte_encontrado.tipo_transporte) {
      case "Camioneta":
        costo_distrito_transporte = Number(distrito_transporte_encontrado.extra_camioneta);
        break;
      case "Camión":
        costo_distrito_transporte = Number(distrito_transporte_encontrado.extra_camion);
        break;
      default:
        break;
    }
  }

  // 3. Calcular costo pernocte transporte

  const costos_pernocte_transporte_encontrado = await db.costos_pernocte_transporte.findOne({
    where: {
        tipo_transporte: tarifa_transporte_encontrado.tipo_transporte
    }
  })
  
  if(peso_total_tn <= costos_pernocte_transporte_encontrado.umbral_toneladas){
    costo_pernocte_transporte= Number(costos_pernocte_transporte_encontrado.precio_soles)
  }else{
    return {
      codigo: 400,
      respuesta: {
        mensaje: "Consultar a gerencia.",
      },
    };
  }

  // 4. Sumar los 3 costos

  const costo_total = costo_tarifas_transporte + costo_distrito_transporte + costo_pernocte_transporte

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Costo de transporte calculado",
      tipo_transporte: tarifa_transporte_encontrado.tipo_transporte,
      costosTransporte: {
        costo_tarifas_transporte,
        costo_distrito_transporte,
        costo_pernocte_transporte,
        costo_total
      },
    },
  }; 
}; 
