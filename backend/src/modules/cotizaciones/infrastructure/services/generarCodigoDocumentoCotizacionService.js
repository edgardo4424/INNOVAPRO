const db = require("../../../../models");

const ID_ESTADO_COTIZACION_CREADO = 1;
/* const ID_ESTADO_COTIZACION_APROBADO = 2;
 */
const ROL_USUARIO_COMERCIAL = "Ventas";
const ROL_USUARIO_OT = "Oficina Técnica";

async function generarCodigoDocumentoCotizacion({
  uso_id_para_registrar,
  filial_razon_social,
  usuario_rol,
  usuario_nombre,
  anio_cotizacion,
  cotizacion
}) {
  // 🔹 Iniciales de la filial (ej. IR)
  const filialAbv = filial_razon_social
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2); // solo 2 letras

  // 🔹 Tipo Documento "COT" cotizacion , "CC" contrato

  let tipoDocumento = "";

  if (cotizacion.estados_cotizacion_id == ID_ESTADO_COTIZACION_CREADO) {
    tipoDocumento = "COT";
  }

 /*  if (cotizacion.estados_cotizacion_id == ID_ESTADO_COTIZACION_APROBADO) {
    tipoDocumento = "CC";
  } */

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

  const cotizacionesConMismoContactoClienteObraFilial_BD =
    await db.cotizaciones.findAll({
      where: {
        contacto_id: cotizacion.contacto_id,
        cliente_id: cotizacion.cliente_id,
        obra_id: cotizacion.obra_id,
        filial_id: cotizacion.filial_id,
        usuario_id: cotizacion.usuario_id,
        estados_cotizacion_id: cotizacion.estados_cotizacion_id,
      },
    });

  let version = "";
  let correlativo = "";

  // Aplanar resultados
  const cotizacionesConMismoContactoClienteObraFilial = cotizacionesConMismoContactoClienteObraFilial_BD.map((c) => c.get({ plain: true }));

  if (cotizacionesConMismoContactoClienteObraFilial.length == 0) {
    // Si Es primera cotizacion
    version = "1";
    correlativo = "0001";
  } else {
    
    // Hallar el correlativo si ya hubo cotizaciones anteriores con el mismo contacto, cliente,obra, filial

    const cantidadCotizaciones =  cotizacionesConMismoContactoClienteObraFilial.length;

    console.log('cotizacionesConMismoContactoClienteObraFilial',cotizacionesConMismoContactoClienteObraFilial);
    // Obteniendo el ultimo registro de una cotizacion del mismo contacto, cliente, obra, filial
    const ultimaCotizacion =  cotizacionesConMismoContactoClienteObraFilial[cantidadCotizaciones - 1];

    /**** Obtener el uso_id de la ultima cotizacion ****/

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
    const ultimo_uso_id = atributo.uso_id
    
    /**** Fin. Obtener el uso_id de la ultima cotizacion ****/
    
    // Formato codigo_documento: EI-COT-COM-JD-0001_3-2025
    const codigo_documento = ultimaCotizacion?.codigo_documento

    console.log('codigggo documento', codigo_documento);

    if(!codigo_documento){
      correlativo = "0001"
      version = "1"
      return `${filialAbv}-${tipoDocumento}-${codRolUsuario}-${usuarioAbv}-${correlativo}_${version}-${anio_cotizacion}`;
    }

    if(ultimo_uso_id == uso_id_para_registrar){

      // Si el ultimo uso de la cotizacion es igual al uso de la nueva cotizacion, el correlativo se mantiene y la version se suma 1
      
      let ultimoCorrelativo = codigo_documento.split("-")[4].split("_")[0]
      let ultimaVersion = codigo_documento.split("-")[4].split("_")[1]

      correlativo = ultimoCorrelativo
      version = Number(ultimaVersion)+1
    }else{
      
      // Si no es igual el uso, se suma 1 al ultimo correlativo obteniendo del codigo_documento
      
      const correlativoAnterior = codigo_documento.split("-")[4].split("_")[0]

      let number = parseInt(correlativoAnterior, 10) + 1; // Suma 1 al número
      let resultado = number.toString().padStart(correlativoAnterior.length, '0'); // Rellena con ceros

      correlativo = resultado
      version = "1";
     
    }
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
  const codigo = `${filialAbv}-${tipoDocumento}-${codRolUsuario}-${usuarioAbv}-${correlativo}_${version}-${anio_cotizacion}`;

  return codigo;
}

module.exports = { generarCodigoDocumentoCotizacion };
