const db = require("../../../../models");
const {
  formatearFechaIsoADMY,
} = require("../../infrastructure/helpers/formatearFecha");

const {
  agruparPorZonaYAtributos,
  agruparPuntalesPorZonaYAtributos,
} = require("../../infrastructure/services/mapearAtributosDelPdfService");

const {
  mapearAtributosValor,
} = require("../../infrastructure/services/mapearAtributosValorService");

module.exports = async (idCotizacion) => {
  // Buscar la cotizacion incluyendo: obra, cliente, contacto, despiece, filial, usuario, costos de cotizacion de transporte
  const cotizacionEncontrado = await db.cotizaciones.findByPk(idCotizacion, {
    include: [
      {
        model: db.obras,
        as: "obra",
      },
      {
        model: db.clientes,
        as: "cliente",
      },
      {
        model: db.contactos,
        as: "contacto",
      },
      {
        model: db.despieces,
        as: "despiece",
      },
      {
        model: db.empresas_proveedoras,
      },
      {
        model: db.usuarios,
        as: "usuario",
      },
      {
        model: db.cotizaciones_transporte,
      },
      {
        model: db.estados_cotizacion,
      },
      {
        model: db.usos,
      },
    ],
  });

  if (!cotizacionEncontrado)
    return { codigo: 404, respuesta: { mensaje: "Cotización no encontrada" } };

  // A partir del despiece_id de la cotización, se obtiene los valores de los atributos para generar la cotizacion
  const despieceEncontrado = await db.despieces.findByPk(
    cotizacionEncontrado.despiece_id,
    {
      include: [
        {
          model: db.atributos_valor,
          include: [
            {
              model: db.atributos,
              as: "atributo",
            },
          ],
        },
      ],
    }
  );

  if (!despieceEncontrado)
    return { codigo: 404, respuesta: { mensaje: "Despiece no encontrada" } };

  /* const uso_id = despieceEncontrado.atributos_valors?.[0].atributo.uso_id; */
  const uso_id = cotizacionEncontrado.uso_id;

  const usoEncontrado = await db.usos.findByPk(uso_id);

  const tipoServicio = cotizacionEncontrado.tipo_cotizacion;
  let tiempoAlquilerDias = null;

  if (tipoServicio == "Alquiler") {
    tiempoAlquilerDias = cotizacionEncontrado?.tiempo_alquiler_dias;
  }

  const tiene_pernos = despieceEncontrado.tiene_pernos;

  const instalacionEncontrada = await db.cotizaciones_instalacion.findOne({
    where: {
      cotizacion_id: cotizacionEncontrado.id,
    },
  });

  // Mapear los datos generales para todos los usos para generar el pdf

  let datosPdfCotizacion = {
    obra: {
      nombre: cotizacionEncontrado.obra.nombre,
      direccion: cotizacionEncontrado.obra.direccion,
    },
    cliente: {
      razon_social: cotizacionEncontrado.cliente.razon_social,
      ruc: cotizacionEncontrado.cliente.ruc,
      domicilio_fiscal: cotizacionEncontrado.cliente.domicilio_fiscal,
    },
    contacto: {
      nombre: cotizacionEncontrado.contacto.nombre,
      correo: cotizacionEncontrado.contacto.email,
    },
    filial: {
      razon_social: cotizacionEncontrado.empresas_proveedora.razon_social,
      ruc: cotizacionEncontrado.empresas_proveedora.ruc,
      direccion: cotizacionEncontrado.empresas_proveedora.direccion,
    },
    usuario: {
      nombre: cotizacionEncontrado.usuario.nombre,
      telefono: cotizacionEncontrado.usuario.telefono,
      correo: cotizacionEncontrado.usuario.email,
    },
    cotizacion: {
      fecha: formatearFechaIsoADMY(cotizacionEncontrado.updatedAt),
      moneda: despieceEncontrado.moneda,
      subtotal_con_descuento_sin_igv: despieceEncontrado.subtotal_con_descuento,
      tipo_servicio: tipoServicio,
      tiempo_alquiler_dias: tiempoAlquilerDias,
      codigo_documento: cotizacionEncontrado.codigo_documento,
      cp: despieceEncontrado.cp,
    },
    tarifa_transporte: {
      costo_tarifas_transporte:
        cotizacionEncontrado?.cotizaciones_transportes?.[0]
          ?.costo_tarifas_transporte,
      costo_pernocte_transporte:
        cotizacionEncontrado?.cotizaciones_transportes?.[0]
          ?.costo_pernocte_transporte,
      costo_distrito_transporte:
        cotizacionEncontrado?.cotizaciones_transportes?.[0]
          ?.costo_distrito_transporte,
      costo_total_transporte:
        cotizacionEncontrado?.cotizaciones_transportes?.[0]?.costo_total,
    },

    uso: {
      id: usoEncontrado.id,
      nombre: usoEncontrado.descripcion,
      //cantidad_uso: cantidadUso,
    },

    instalacion: {
      tiene_instalacion: cotizacionEncontrado?.tiene_instalacion,
      tipo_instalacion: instalacionEncontrada?.tipo_instalacion,
      precio_instalacion_completa_soles:
        instalacionEncontrada?.precio_instalacion_completa_soles,
      precio_instalacion_parcial_soles:
        instalacionEncontrada?.precio_instalacion_parcial_soles,
      nota: instalacionEncontrada?.nota,
    },
  };

  // Añadir algunos datos particulares para cada uso

  switch (uso_id + "") {
    case "1":
      // ANDAMIO DE FACHADA

      break;

    case "2":
      // ANDAMIO DE TRABAJO

      let pernoExpansionConArgolla;
      let pernoEnElDespiece;

      if (tiene_pernos) {
        pernoExpansionConArgolla = await db.piezas.findOne({
          where: {
            item: "CON.0100",
          },
        });

        pernoEnElDespiece = await db.despieces_detalle.findOne({
          where: {
            despiece_id: despieceEncontrado.id,
            pieza_id: pernoExpansionConArgolla.id,
          },
        });
      }

      // Obtener la lista de atributos

      const atributosDelUso = await db.atributos_valor.findAll({
        where: {
          despiece_id: despieceEncontrado.id,
        },
        include: [
          {
            model: db.atributos,
            as: "atributo",
          },
        ],
      });

      // Obtener atributos

      const resultado = mapearAtributosValor(atributosDelUso);

      const listaAtributos = agruparPorZonaYAtributos(resultado);

      const atributosDelPdf = listaAtributos.map((atributo) => ({
        zona: atributo.zona,
        atributos: atributo.atributos.map((at) => ({
          longitud_mm: at.longitud / 1000,
          ancho_mm: at.ancho / 1000,
          altura_m: at.altura,
          cantidad_uso: at.cantidad_uso,
        })),
        nota_zona: atributo.atributos[0].nota_zona,
      }));

      // Obtener las piezas adicionales

      const piezasDetalleAdicionalesAndamioTrabajo = await db.despieces_detalle.findAll({
        where: {
          despiece_id: despieceEncontrado.id,
          esAdicional: true
        },
        include: [{
          model: db.piezas,
          as: "pieza",
          attributes: ["id", "item", "descripcion"]
        }]
      })

      datosPdfCotizacion = {
        ...datosPdfCotizacion,
        zonas: atributosDelPdf,
        atributos_opcionales: {
          tiene_pernos: tiene_pernos,
          nombre_perno_expansion: tiene_pernos
            ? pernoExpansionConArgolla.descripcion
            : null,
          precio_perno_expansion: tiene_pernos
            ? Number(pernoEnElDespiece?.precio_venta_soles).toFixed(2)
            : null,
          cantidad_pernos_expansion: tiene_pernos
            ? pernoEnElDespiece?.cantidad
            : null,
        },
        piezasAdicionales: piezasDetalleAdicionalesAndamioTrabajo
      };
      break;

    case "3":
      // ESCALERA DE ACCESO

      // Obtener la lista de atributos

      const atributosDelUsoEscaleraAcceso = await db.atributos_valor.findAll({
        where: {
          despiece_id: despieceEncontrado.id,
        },
        include: [
          {
            model: db.atributos,
            as: "atributo",
          },
        ],
      });

      const resultadoEscaleraAcceso = mapearAtributosValor(
        atributosDelUsoEscaleraAcceso
      );

      const listaAtributosEscaleraAcceso = agruparPorZonaYAtributos(
        resultadoEscaleraAcceso
      );

      console.dir(listaAtributosPuntales, { depth: null, colors: true });

      const atributosEscaleraAccesoDelPdf = listaAtributosPuntales.map(
        (atributo) => ({
          zona: atributo.zona,
          atributos: atributo.atributos.map((at) => ({
            cantidad: at.cantidad,
            tipoPuntal: at.tipoPuntal,
            tripode: at.tripode,
            cantidad_uso: at.cantidad_uso,
          })),
          nota_zona: atributo.atributos[0].nota_zona,
        })
      );

      console.log(
        "atributosEscaleraAccesoDelPdf",
        atributosEscaleraAccesoDelPdf
      );

      /* const tipoAnclaje = despieceEncontrado.atributos_valors?.[4]?.valor;
      let itemPiezaVenta;

      if (tipoAnclaje == "FERMIN") {
        itemPiezaVenta = "CON.0200";
      } else {
        itemPiezaVenta = "CON.0100";
      }

      //const tiene_pernos = despieceEncontrado.tiene_pernos

      let pernoExpansionArgolla;
      let pernoDespiece;

      if (tiene_pernos) {
        pernoExpansionArgolla = await db.piezas.findOne({
          where: {
            item: itemPiezaVenta,
          },
        });

        pernoDespiece = await db.despieces_detalle.findOne({
          where: {
            despiece_id: despieceEncontrado.id,
            pieza_id: pernoExpansionArgolla.id,
          },
        });
      }

      const atributosPlanoEscaleraAcceso =
        despieceEncontrado.atributos_valors.map((av) => av.dataValues);

      const resultadoEscaleraAcceso = [];

      const agrupadoEscaleraAcceso = {};

      atributosPlanoEscaleraAcceso.forEach((av) => {
        const grupo = av.numero_formulario_uso;
        if (!agrupadoEscaleraAcceso[grupo]) agrupadoEscaleraAcceso[grupo] = {};
        const llave_json = av.atributo.dataValues.llave_json;
        agrupadoEscaleraAcceso[grupo][llave_json] = av.valor;
      });

      Object.keys(agrupadoEscaleraAcceso).forEach((grupo) => {
        resultadoEscaleraAcceso.push(agrupadoEscaleraAcceso[grupo]);
      });

      const listaAtributosEscaleraAcceso = resultadoEscaleraAcceso.map(
        (atributo) => {
          const tipoEscalera = atributo.tipoEscalera;
          let longitud_mm;

          if (tipoEscalera == "EUROPEA") {
            longitud_mm = 2072 / 1000;
          } else {
            longitud_mm = 3072 / 1000;
          }

          let ancho_mm = 1572 / 1000;

          return {
            longitud_mm: longitud_mm,
            ancho_mm: ancho_mm,
            altura_m: atributo.alturaTotal,
          };
        }
      ); */

      datosPdfCotizacion = {
        ...datosPdfCotizacion,
        atributos: listaAtributosEscaleraAcceso,
        /*  atributos_opcionales: {
          nombre_pernos_expansion: tiene_pernos
            ? pernoExpansionArgolla.descripcion
            : null,
          precio_pernos_expansion: tiene_pernos
            ? pernoExpansionArgolla.precio_venta_soles
            : null,
          cantidad_pernos_expansion: tiene_pernos
            ? pernoDespiece.cantidad
            : null,
        }, */
      };

      break;

    case "4":
      // ESCUADRAS
      break;

    case "5":
      // PUNTALES

      // Obtener la lista de atributos

      const atributosDelUsoPuntales = await db.atributos_valor.findAll({
        where: {
          despiece_id: despieceEncontrado.id,
        },
        include: [
          {
            model: db.atributos,
            as: "atributo",
          },
        ],
      });

      const resultadoPuntales = mapearAtributosValor(atributosDelUsoPuntales);

      console.log("resultadoPuntales", resultadoPuntales);

      const atributosPuntalesDelPdf =
        agruparPuntalesPorZonaYAtributos(resultadoPuntales);

      console.log("atributosPuntalesDelPdf", atributosPuntalesDelPdf);

      const atributosPuntalesConPreciosDelPdf = await Promise.all(
        atributosPuntalesDelPdf.map(async (zona) => {
          const atributosConPrecios = await Promise.all(
            zona.atributos.map(async (atributo) => {
              const tipoPuntal = atributo.tipoPuntal;
      
              let puntal;
              if (tipoPuntal === "3.00 m") puntal = "PU.0100";
              else if (tipoPuntal === "4.00 m") puntal = "PU.0400";
              else if (tipoPuntal === "5.00 m") puntal = "PU.0600";
      
              const piezaPuntal = await db.piezas.findOne({
                where: { item: puntal },
              });
      
              if (!piezaPuntal) {
                throw new Error(`No se encontró la pieza con item ${puntal}`);
              }
      
              const piezaPuntalDespiece = await db.despieces_detalle.findOne({
                where: {
                  despiece_id: despieceEncontrado.id,
                  pieza_id: piezaPuntal.id,
                },
              });
      
              if (!piezaPuntalDespiece) {
                throw new Error(
                  `No se encontró despiece para pieza_id ${piezaPuntal.id}`
                );
              }
      
              let precioUnitarioPuntal;
      
              if (cotizacionEncontrado.tipo_cotizacion === "Venta") {
                precioUnitarioPuntal = (
                  piezaPuntalDespiece.precio_venta_soles /
                  piezaPuntalDespiece.cantidad
                ).toFixed(2);
              } else if (cotizacionEncontrado.tipo_cotizacion === "Alquiler") {
                precioUnitarioPuntal = (
                  piezaPuntalDespiece.precio_alquiler_soles /
                  piezaPuntalDespiece.cantidad
                ).toFixed(2);
              }
      
              const subtotal = (
                precioUnitarioPuntal * atributo.cantidad
              ).toFixed(2);
      
              return {
                ...atributo,
                precio_unitario: precioUnitarioPuntal,
                subtotal,
              };
            })
          );
      
          // 👇 este return es lo que FALTABA
          return {
            zona: zona.zona,
            nota_zona: zona.nota_zona,
            atributos: atributosConPrecios,
          };
        })
      );
      
      // Averiguar que tipos de puntales se registraron en la cotizacion

      const tiposPuntalUnicos = [
        // Convertimos a un array los valores únicos usando Set
        ...new Set(
          // Recorremos cada zona con flatMap para aplanar los resultados
          atributosPuntalesDelPdf.flatMap((item) =>
            // De cada zona, accedemos al array "atributos" y sacamos el campo tipoPuntal
            item.atributos.map((attr) => attr.tipoPuntal)
          )
        ),
      ];

      const piezasVenta = await Promise.all(
        tiposPuntalUnicos.map(async (tipo, i) => {
          console.log(`👉 (${i}) tipo: ${tipo}`);

          const itemPiezaPinPresion = tipo === "5.00 m" ? "PU.0800" : "PU.0700";
          const itemArgolla = tipo === "5.00 m" ? "PU.1000" : "PU.0900";

          const piezaPinPresion = await db.piezas.findOne({
            where: { item: itemPiezaPinPresion },
          });
          const piezaArgolla = await db.piezas.findOne({
            where: { item: itemArgolla },
          });

          if (!piezaPinPresion || !piezaArgolla) {
            //console.warn(`⚠️ (${i}) No se encontraron piezas con item ${itemPiezaPinPresion} o ${itemArgolla}`);
            return {
              tipo,
              piezaVentaPinPresion: null,
              piezaVentaArgolla: null,
            };
          }

          const pinPresion = await db.despieces_detalle.findOne({
            where: {
              despiece_id: Number(despieceEncontrado.id),
              pieza_id: Number(piezaPinPresion.id),
            },
          });

          const argolla = await db.despieces_detalle.findOne({
            where: {
              despiece_id: Number(despieceEncontrado.id),
              pieza_id: Number(piezaArgolla.id),
            },
          });

          //console.log(`✅ (${i}) IDs buscados: pin=${piezaPinPresion.id}, argolla=${piezaArgolla.id}`);
          //console.log(`✅ (${i}) Encontrado: pin=${!!pinPresion}, argolla=${!!argolla}`);

          const ventaPin = pinPresion
            ? (pinPresion.precio_venta_soles / pinPresion.cantidad).toFixed(2)
            : null;
          const ventaArg = argolla
            ? (argolla.precio_venta_soles / argolla.cantidad).toFixed(2)
            : null;

          return {
            tipo,
            piezaVentaPinPresion: ventaPin,
            piezaVentaArgolla: ventaArg,
          };
        })
      );

      // Obtener las piezas adicionales

      const piezasDetalleAdicionalesPuntales = await db.despieces_detalle.findAll({
        where: {
          despiece_id: despieceEncontrado.id,
          esAdicional: true
        },
        include: [{
          model: db.piezas,
          as: "pieza",
          attributes: ["id", "item", "descripcion"]
        }]
      })

      datosPdfCotizacion = {
        ...datosPdfCotizacion,
        zonas: atributosPuntalesConPreciosDelPdf,
        atributos_opcionales: piezasVenta,
        piezasAdicionales: piezasDetalleAdicionalesPuntales
      };
      break;

    case "6":
      // ENCOFRADO
      break;

    case "7":
      // PLATAFORMAS DE DESCARGA
      break;

    case "8":
      // COLGANTE
      break;

    case "9":
      // ELEVADOR
      break;

    default:
      break;
  }

  return { codigo: 200, respuesta: datosPdfCotizacion };
};
