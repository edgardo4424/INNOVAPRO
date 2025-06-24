const db = require("../../../../models");

const ID_ESTADO_COTIZACION_POR_APROBAR = 1;
const ID_ESTADO_COTIZACION_DESPIECE_GENERADO = 2;

async function generarCodigoDocumentoCotizacion({
  uso_id_para_registrar,
  filial_razon_social,
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

  if (cotizacion.estados_cotizacion_id == ID_ESTADO_COTIZACION_POR_APROBAR || cotizacion.estados_cotizacion_id == ID_ESTADO_COTIZACION_DESPIECE_GENERADO ) {
    tipoDocumento = "COT";
  }

 /*  if (cotizacion.estados_cotizacion_id == ID_ESTADO_COTIZACION_APROBADO) {
    tipoDocumento = "CC";
  } */

  // 🔹 Rol que registró "COM" comercial , "OFT" OT

  let codRolUsuario = "";

  if (cotizacion.estados_cotizacion_id == ID_ESTADO_COTIZACION_POR_APROBAR) {
    codRolUsuario = "COM";
  }

  if (cotizacion.estados_cotizacion_id == ID_ESTADO_COTIZACION_DESPIECE_GENERADO) {
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
        /* tipo_cotizacion: cotizacion.tipo_cotizacion */
      },
    });

  let version = "";
  let correlativo = "";

  // Aplanar resultados
  const cotizacionesConMismoContactoClienteObraFilial = cotizacionesConMismoContactoClienteObraFilial_BD.map((c) => c.get({ plain: true }));

  if (cotizacionesConMismoContactoClienteObraFilial.length == 0) {

    const cotizacionesBD =  await db.cotizaciones.findAll({
      where: {
        filial_id: cotizacion.filial_id,
      },
    });

    // Aplanar resultados
    const cotizaciones = cotizacionesBD.map((c) => c.get({ plain: true }));

    //Obtener mayor correlativo

const mayorCorrelativo = cotizaciones
  .map(c => {
    const correlativoParte = c.codigo_documento.split("-")[4]?.split("_")[0];
    return parseInt(correlativoParte, 10);
  })
  .filter(num => !isNaN(num))
  .reduce((max, actual) => Math.max(max, actual), 0);

const siguienteCorrelativo = (mayorCorrelativo + 1).toString().padStart(4, '0');

    // Si Es primera cotizacion
    version = "1";
    correlativo = siguienteCorrelativo;
 
/*     correlativo = "0001"; */
  } else {
    
    // Hallar el correlativo si ya hubo cotizaciones anteriores con el mismo contacto, cliente,obra, filial
    const cantidadCotizaciones =  cotizacionesConMismoContactoClienteObraFilial.length;

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

    if(!codigo_documento){
      correlativo = "0001"
      version = "1"
      return `${filialAbv}-${tipoDocumento}-${codRolUsuario}-${usuarioAbv}-${correlativo}_${version}-${anio_cotizacion}`;
    }

    // Extraer correlativo y versión actuales del código_documento
  const [correlativoActual, versionActual] = codigo_documento.split("-")[4].split("_");
  const correlativoLength = correlativoActual.length;

    // Función para incrementar correlativo con padding
  const incrementarCorrelativo = () => (
      (parseInt(correlativoActual, 10) + 1).toString().padStart(correlativoLength, '0')
    );

  if (ultimo_uso_id === uso_id_para_registrar) {

    const resultado = cotizacionesConMismoContactoClienteObraFilial.filter(coti => coti.tipo_cotizacion == cotizacion.tipo_cotizacion)
 
    if(resultado.length == 0){
      correlativo = incrementarCorrelativo();
      version = "1";
    }else{
      const cotizacionUltima = resultado[resultado.length-1]

       // Extraer correlativo y versión actuales del código_documento
      const [actualCorrelativo, actualVersion] = cotizacionUltima.codigo_documento.split("-")[4].split("_");

    // Caso 1: mismo uso → misma correlativo, incremento versión
    correlativo = actualCorrelativo
    version = (parseInt(actualVersion, 10) + 1).toString();
    }
    

    
  } else {
    // Caso 2: uso distinto → nuevo correlativo, versión 1
    correlativo = incrementarCorrelativo();
    version = "1";
  }
   
  }

  // 🔹 Construcción del código
  const codigo = `${filialAbv}-${tipoDocumento}-${codRolUsuario}-${usuarioAbv}-${correlativo}_${version}-${anio_cotizacion}`;

  return codigo;
}

module.exports = { generarCodigoDocumentoCotizacion };
