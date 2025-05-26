const db = require("../../../../models");

const ID_ESTADO_COTIZACION_CREADO = 1;
const ID_ESTADO_COTIZACION_APROBADO = 2;

const ROL_USUARIO_COMERCIAL = "Ventas";
const ROL_USUARIO_OT = "Oficina Técnica";

async function generarCodigoDocumentoCotizacion({
  filial_id,
  filial_razon_social,
  usuario_id,
  usuario_rol,
  usuario_nombre,
  anio_cotizacion,
  estado_cotizacion,
}) {
  // 🔹 Iniciales de la filial (ej. IR)
  const filialAbv = filial_razon_social
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2); // solo 2 letras

  // 🔹 Tipo Documento "COT" cotizacion , "CC" contrato

  let tipoDocumento = "";

  if (estado_cotizacion == ID_ESTADO_COTIZACION_CREADO) {
    tipoDocumento = "COT";
  }

  if (estado_cotizacion == ID_ESTADO_COTIZACION_APROBADO) {
    tipoDocumento = "CC";
  }

  // 🔹 Rol que registró "COM" comercial , "OFT" OT

  let codRolUsuario = "";

  if (usuario_rol == ROL_USUARIO_COMERCIAL) {
    codRolUsuario = "COM";
  }

  if (usuario_rol == ROL_USUARIO_OT) {
    codRolUsuario = "OFT";
  }

  /* const version = 1; */

  // 🔹 Iniciales del usuario (ej. AM)
  const usuarioAbv = usuario_nombre
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2); // solo 2 letras

  // 🔹 Hallar el correlativo . Ejm: 0001, 0002
  // El correlativo cambia si el uso Cambia (Sabiendo que la cotizacion es para el mismo cliente, filial, usuario)
  // Por ejm al inicio hice una cotizacion para andamio de trabajo, luego a puntales. El correlativo cambia de 0001 a 0002

  const new_contacto_id = 21;
  const new_cliente_id = 1;
  const new_obra_id = 6;
  const new_filial_id = 1;
  const new_usuario_id = 52;
  const estado_cotizacion_id = 1;
  const new_tipo_cotizacion = "Venta";
  const anio_coti = 2025;
  const uso_id = 2;

  const cotizacionConMismoContactoClienteObraFilial_BD =
    await db.cotizaciones.findAll({
      where: {
        contacto_id: new_contacto_id,
        cliente_id: new_cliente_id,
        obra_id: new_obra_id,
        filial_id: new_filial_id,
        usuario_id: new_usuario_id,
        estados_cotizacion_id: estado_cotizacion_id,
        tipo_cotizacion: new_tipo_cotizacion,
      },
    });

  let version = "";
  let correlativo = "";

  // Aplanar resultados
  const cotizacionConMismoContactoClienteObraFilial =
    cotizacionConMismoContactoClienteObraFilial_BD.map((c) =>
      c.get({ plain: true })
    );

  if (cotizacionConMismoContactoClienteObraFilial.length == 0) {
    // Si Es primera cotizacion
    version = "1";
    correlativo = "0001";
  } else {
    version = cotizacionConMismoContactoClienteObraFilial.length + 1;

    // Hallar el correlativo
    console.log(
      "cotizacionConMismoContactoClienteObraFilial",
      cotizacionConMismoContactoClienteObraFilial
    );

    const cantidadCotizaciones =
      cotizacionConMismoContactoClienteObraFilial.length;
    // Obteniendo el ultimo registro de una cotizacion del mismo contaco, cliente, obra, filial
    const ultimaCotizacion =
      cotizacionConMismoContactoClienteObraFilial[cantidadCotizaciones - 1];
    const despiece_id = ultimaCotizacion.despiece_id;

    const resultado = await db.atributos_valor.findAll({
      where: {
        despiece_id: despiece_id,
      },
      include: [
        {
          model: db.atributos,
          attributes: ["uso_id"],
          as: "atributo"
        },
      ],
    });

     const listaAtributosValor =
    resultado.map((c) =>
      c.get({ plain: true })
    );

    const { atributo }= listaAtributosValor[listaAtributosValor.length-1];
    const uso_id = atributo.uso_id
    console.log('uso_id', uso_id);
  }

  // 🔹 Contador de documentos por filial, usuario, tipo y anio
  /* const totalDocumentos = await db.cotizaciones.count({
    where: {
      filial_id: filial_id,
      usuario_id: usuario_id,
      estados_cotizacion_id: ID_ESTADO_COTIZACION_CREADO,
      createdAt: anio_cotizacion,
    },
  });

  console.log('TOTALLLLLLLL DOCUMENTOS', totalDocumentos);

  const correlativo = (totalDocumentos + 1).toString().padStart(4, "0"); // Ej: 0003 */

  // 🔹 Construcción del código
  const codigo = `${filialAbv}-${tipoDocumento}-${codRolUsuario}-${usuarioAbv}-${correlativo}_${version}-${anio_coti}`;

  return codigo;
}

module.exports = { generarCodigoDocumentoCotizacion };
