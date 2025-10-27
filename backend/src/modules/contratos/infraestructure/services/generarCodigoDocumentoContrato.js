const db = require("../../../../database/models");

async function generarCodigoDocumentoContrato({cotizacion_id, usuario_id, transaction=null}) {
    
    // Buscar la cantidad de contratos existentes en la base de datos del trabajador
    
    const contratosDelTrabajador = await db.contratos.findAll({
        where: {
            usuario_id: usuario_id
        },
        transaction
    });

    // Obtener la informacion para generar el codigo del contrato
    const cotizacion = await db.cotizaciones.findOne({
        where: { id: cotizacion_id },
        include: [ {
            model: db.empresas_proveedoras,
        }, {
            model: db.usuarios,
            as: "usuario",
            include: [{
                model: db.trabajadores,
                as: "trabajador"
            }]
        }]
    }, { transaction });

    console.log("cotizacion", cotizacion);

    const filial_razon_social = cotizacion.empresas_proveedora.razon_social;
    const usuario_nombre = cotizacion.usuario.trabajador.nombres + " " + cotizacion.usuario.trabajador.apellidos;

    const numeroContratos = contratosDelTrabajador.length;

    // 🔹 Tipo Documento "COT" cotizacion , "CC" contrato
      let tipoDocumento = "CC";

      // 🔹 Rol que registró "COM" comercial , "OFT" OT
      let codRolUsuario = "COM";

    // 🔹 Iniciales de la filial (ej. IR)
      const filialAbv = filial_razon_social
        .split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("")
        .slice(0, 2); // solo 2 letras

     // 🔹 Iniciales del usuario (ej. AM)
      const usuarioAbv = usuario_nombre
        .split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("")
        .slice(0, 2); // solo 2 letras


   // Codigo documento cotizacion
   const codigo_documento_cotizacion = cotizacion.codigo_documento;

   const codigo_documento_cotizacion_sin_version = codigo_documento_cotizacion.split("_")[0];

   console.log('codigo_documento_cotizacion', codigo_documento_cotizacion);

   const cotizaciones_estado_aprobado = await db.cotizaciones.findAll({
    where: {
        // Traer todos los que contengan el mismo codigo_documento_sin_version
        //codigo_documento: codigo_documento_cotizacion_sin_version + "%",
        usuario_id: cotizacion.usuario_id,
        filial_id: cotizacion.filial_id,
        contacto_id: cotizacion.contacto_id,
        cliente_id: cotizacion.cliente_id,
        obra_id: cotizacion.obra_id,
        uso_id: cotizacion.uso_id,
        estados_cotizacion_id: 4,

    },
    transaction
    });

    const cotizacionesConEstadoAprobado = cotizaciones_estado_aprobado.map(cotizacion => cotizacion.get({ plain: true }));

    // ordenar cotizaciones por version descendente
    cotizacionesConEstadoAprobado.sort((a, b) => {
        const versionA = parseInt(a.codigo_documento.split("_")[1]) || 0;
        const versionB = parseInt(b.codigo_documento.split("_")[1]) || 0;
        return versionB - versionA;
    });

    let correlativo = String(numeroContratos + 1).padStart(4, "0");
    let version = 1;

    if(cotizacionesConEstadoAprobado.length>1){
        const penultimaCotizacionAprobada = cotizacionesConEstadoAprobado[1]; // Penultima cotizacion aprobada
        const ultimaVersion = parseInt(penultimaCotizacionAprobada.codigo_documento.split("_")[1]) || 0;
        version = ultimaVersion + 1;

        const ultimoContratoDevueltoParaNuevaVersion = await db.contratos.findOne({
            where: {
                cotizacion_id: penultimaCotizacionAprobada.id
            },
            transaction
        });

        if(ultimoContratoDevueltoParaNuevaVersion){
            correlativo = ultimoContratoDevueltoParaNuevaVersion.ref_contrato.split("-")[4].split("_")[0];
        }
    }
    // Construir el código del contrato
    const codigoDocumentoContrato = `${filialAbv}-${tipoDocumento}-${codRolUsuario}-${usuarioAbv}${usuario_id}-${correlativo}_${version}`;

    return codigoDocumentoContrato;
}

module.exports = { generarCodigoDocumentoContrato };