const db = require("../../../../database/models"); // Llamamos los modelos sequelize de la base de datos
const { Op } = db.Sequelize;

async function generarCodigoDocumentoCotizacion({
  uso_id_para_registrar,
  filial_razon_social,
  usuario_nombre,
  cotizacion,
  cp,
}) {

  console.log({
    uso_id_para_registrar,
    filial_razon_social,
    usuario_nombre,
    cotizacion,
    cp,
  })
  // 🔹 Iniciales de la filial (ej. IR)
  const filialAbv = filial_razon_social
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2); // solo 2 letras

  // 🔹 Tipo Documento "COT" cotizacion , "CC" contrato

  let tipoDocumento = "COT";

  // 🔹 Rol que registró "COM" comercial , "OFT" OT

  let codRolUsuario = "COM";

  // 🔹 Iniciales del usuario (ej. AM)
  const usuarioAbv = usuario_nombre
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2); // solo 2 letras

  // 🔹 Hallar el correlativo . Ejm: 0001, 0002
  // El correlativo cambia si el uso Cambia (Sabiendo que la cotizacion es para el mismo cliente, filial, usuario)
  // Por ejm al inicio hice una cotizacion para andamio de trabajo, luego a puntales. El correlativo cambia de 0001 a 0002

  // 🛠 Construimos el objeto 'where' para filtrar cotizaciones con los mismos datos
  const whereCotizacion = {
    contacto_id: cotizacion.contacto_id,
    cliente_id: cotizacion.cliente_id,
    obra_id: cotizacion.obra_id,
    filial_id: cotizacion.filial_id,
    usuario_id: cotizacion.usuario_id,
    uso_id: uso_id_para_registrar
  };

  // 🧠 Si la cotización actual tiene ID (es decir, ya existe en BD),
  //     agregamos una condición para excluirla del resultado:
  //     "trae todo MENOS esta misma cotización"
  if (cotizacion.id) {
    whereCotizacion.id = { [Op.ne]: cotizacion.id }; // id ≠ cotizacion.id
  }

  const cotizacionesConMismoContactoClienteObraFilial_BD =
    await db.cotizaciones.findAll({
      // 🎯 Aplicamos el filtro dinámico
      where: whereCotizacion,

      include: [
        {
          model: db.despieces, // 🔗 JOIN con tabla 'despieces'
          as: "despiece", // Usamos el alias definido en el modelo

          // 🧠 Filtramos por campo 'cp' según el valor que llega
          where: {
            cp:
              cp == "0"
                ? 0 // Si cp = "0" → buscamos solo los que tienen cp = 0
                : {
                    [Op.and]: [
                      { [Op.ne]: 0 }, // cp distinto de 0
                      { [Op.not]: null }, // cp no debe ser null
                    ],
                  },
          },

          attributes: [], // ❌ No traemos campos de despieces (solo queremos filtrar)
          required: true, // 🔒 INNER JOIN: solo cotizaciones que tienen un despiece válido
        },
      ],
    });

  let version = "";
  let correlativo = "";

  // Aplanar resultados
  const cotizacionesConMismoContactoClienteObraFilial =
    cotizacionesConMismoContactoClienteObraFilial_BD.map((c) =>
      c.get({ plain: true })
    );

    console.log('cotizacionesConMismoContactoClienteObraFilial', cotizacionesConMismoContactoClienteObraFilial);

  if (cotizacionesConMismoContactoClienteObraFilial.length == 0) {
    const cotizacionesBD = await db.cotizaciones.findAll({
      where: {
        filial_id: cotizacion.filial_id,
      },
    });

    // Aplanar resultados
    const cotizaciones = cotizacionesBD.map((c) => c.get({ plain: true }));

    console.log('cotizaciones', cotizaciones);


    //Obtener mayor correlativo

    const mayorCorrelativo = cotizaciones
  .map((c) => {
    if (!c.codigo_documento) return null;

    const correlativoParte = c.codigo_documento
      .split("-")[4]
      ?.split("_")[0];
    
    return parseInt(correlativoParte, 10);
  })
  .filter((num) => !isNaN(num))
  .reduce((max, actual) => Math.max(max, actual), 0);

    const siguienteCorrelativo = (mayorCorrelativo + 1)
      .toString()
      .padStart(4, "0");

    // Si Es primera cotizacion
    version = "1";
    correlativo = siguienteCorrelativo;

    /*     correlativo = "0001"; */
  } else {
    // Hallar el correlativo si ya hubo cotizaciones anteriores con el mismo contacto, cliente,obra, filial
    const cantidadCotizaciones =
      cotizacionesConMismoContactoClienteObraFilial.length;

    // Obteniendo el ultimo registro de una cotizacion del mismo contacto, cliente, obra, filial
    const ultimaCotizacion =
      cotizacionesConMismoContactoClienteObraFilial[cantidadCotizaciones - 1];

    /**** Obtener el uso_id de la ultima cotizacion ****/
    const ultimo_uso_id = ultimaCotizacion.uso_id;

    /**** Fin. Obtener el uso_id de la ultima cotizacion ****/

    // Formato codigo_documento: EI-COT-COM-JD-0001_3-2025
    const codigo_documento = ultimaCotizacion?.codigo_documento;

    if (!codigo_documento) {
      correlativo = "0001";
      version = "1";
      return `${filialAbv}-${tipoDocumento}-${codRolUsuario}-${usuarioAbv}-${correlativo}_${version}`;
    }

    // Extraer correlativo y versión actuales del código_documento
    const [correlativoActual, versionActual] = codigo_documento
      .split("-")[4]
      .split("_");
    const correlativoLength = correlativoActual.length;

    // Función para incrementar correlativo con padding
    const incrementarCorrelativo = () =>
      (parseInt(correlativoActual, 10) + 1)
        .toString()
        .padStart(correlativoLength, "0");

    if (ultimo_uso_id === uso_id_para_registrar) {
      /* const resultado = cotizacionesConMismoContactoClienteObraFilial.filter(
        (coti) => coti.tipo_cotizacion == cotizacion.tipo_cotizacion
      ); */

      if (cotizacionesConMismoContactoClienteObraFilial.length == 0) {
        correlativo = incrementarCorrelativo();
        version = "1";
      } else {
        const cotizacionUltima = cotizacionesConMismoContactoClienteObraFilial[cotizacionesConMismoContactoClienteObraFilial.length - 1];

        // Extraer correlativo y versión actuales del código_documento
        const [actualCorrelativo, actualVersion] =
          cotizacionUltima.codigo_documento.split("-")[4].split("_");

        // Caso 1: mismo uso → misma correlativo, incremento versión
        correlativo = actualCorrelativo;
        version = (parseInt(actualVersion, 10) + 1).toString();
      }
    } else {
      // Caso 2: uso distinto → nuevo correlativo, versión 1
      correlativo = incrementarCorrelativo();
      version = "1";
    }
  }

  // 🔹 Construcción del código
  const codigo = `${filialAbv}-${tipoDocumento}-${codRolUsuario}-${usuarioAbv}-${correlativo}_${version}`;


  return codigo;
}

module.exports = { generarCodigoDocumentoCotizacion };
