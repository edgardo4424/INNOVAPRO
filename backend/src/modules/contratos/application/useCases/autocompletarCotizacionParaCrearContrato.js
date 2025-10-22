const { formatearFechaIsoADMY } = require("../../../cotizaciones/infrastructure/helpers/formatearFecha");

module.exports = async (cotizacion_id, contratoRepository, transaction = null) => {
    const cotizacion = await contratoRepository.autocompletarCotizacionParaCrearContrato(cotizacion_id, transaction); // Llama al método del repositorio para obtener todos los contratos

    if(!cotizacion){
        return { codigo: 404, respuesta: { error: "Cotización no encontrada" } }
    }


    // Formatear la respuesta según sea necesario
    const {obra, cliente, contacto, empresas_proveedora, usuario, uso, despiece,...resto} = cotizacion;

    //Aplanar resultado de ...resto de sequelize
    const informacionCotizacion={...resto.dataValues};

    const respuesta = {
        id: cotizacion.id,
        obra: {
            nombre: obra.nombre,
            direccion: obra.direccion,
        },
        cliente: {
            tipo: cliente.tipo,
            numero_documento: cliente.tipo == "Persona Natural" ? cliente.dni : cliente.ruc,
            nombre_cliente: cliente.razon_social, // asi sea Persona Natural o Jurídica
            domicilio_fiscal: cliente.domicilio_fiscal,
        },
        contacto: {
            nombre: contacto.nombre,
            correo: contacto.email,
        },
        filial: {
            razon_social: empresas_proveedora.razon_social,
            ruc: empresas_proveedora.ruc,
            direccion: empresas_proveedora.direccion,

        },
        usuario: {
            nombres: usuario.trabajador.nombres+" "+usuario.trabajador.apellidos,
            telefono: usuario.trabajador.telefono,
            correo: usuario.trabajador.correo,
        },
        uso: {
            id: uso.id,
            nombre: uso.descripcion,
        },
        cotizacion: {
              fecha: formatearFechaIsoADMY(informacionCotizacion.updatedAt),
              moneda: despiece.moneda,
              subtotal_con_descuento_sin_igv: despiece.subtotal_con_descuento,
              igv_monto: despiece.igv_monto,
              total_final: despiece.total_final,
              tipo_servicio: informacionCotizacion.tipo_cotizacion,
              tiempo_alquiler_dias: informacionCotizacion.tiempo_alquiler_dias,
              codigo_documento: informacionCotizacion.codigo_documento,
              cp: despiece.cp,
            },

        firmantes: {
            filial: {

            tipo_documento_representante_legal: empresas_proveedora.tipo_documento,
            numero_documento_representante_legal: empresas_proveedora.dni_representante,
            nombre_representante_legal: empresas_proveedora.representante_legal,
            cargo_representante_legal: empresas_proveedora.cargo_representante,
            },
            cliente: {
            tipo_documento_representante_legal: cliente.tipo_documento,
            numero_documento_representante_legal: cliente.tipo == "Persona Natural" ? cliente.dni : cliente.dni_representante,
            nombre_representante_legal: cliente.tipo == "Persona Natural" ? cliente.razon_social : cliente.representante_legal,
            cargo_representante_legal: cliente.cargo_representante,
            }
        }
        }

    return { codigo: 200, respuesta: respuesta } 
} // Exporta la función para que pueda ser utilizada en otros módulos