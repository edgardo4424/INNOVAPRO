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
            id: obra.id,
            nombre: obra.nombre,
            direccion: obra.direccion,
        },
        cliente: {
            id: cliente.id,
            tipo: cliente.tipo,
            numero_documento: cliente.tipo == "Persona Natural" ? cliente.dni : cliente.ruc,
            nombre_cliente: cliente.razon_social, // asi sea Persona Natural o Jurídica
            domicilio_fiscal: cliente.domicilio_fiscal,
        },
        contacto: {
            id: contacto.id,
            nombre: contacto.nombre,
            correo: contacto.email,
        },
        filial: {
            id: empresas_proveedora.id,
            razon_social: empresas_proveedora.razon_social,
            ruc: empresas_proveedora.ruc,
            direccion: empresas_proveedora.direccion,
            domicilio_representante_legal: empresas_proveedora.direccion_representante,
            telefono: empresas_proveedora.telefono,
        },
        usuario: {

            id: usuario.id,
            nombres: usuario.trabajador.nombres+" "+usuario.trabajador.apellidos,
            telefono: usuario.trabajador.telefono,
            correo: usuario.trabajador.correo,
        },
        uso: {
            id: uso.id,
            nombre: uso.descripcion,
        },
        cotizacion: {
             id: informacionCotizacion.id,
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
            id: empresas_proveedora.id,
            tipo_documento_representante_legal: empresas_proveedora.tipo_documento,
            numero_documento_representante_legal: empresas_proveedora.dni_representante,
            nombre_representante_legal: empresas_proveedora.representante_legal,
            cargo_representante_legal: empresas_proveedora.cargo_representante,
           
            },
            cliente: {
            id: cliente.id,
            tipo_documento_representante_legal: cliente.tipo_documento,
            numero_documento_representante_legal: cliente.tipo == "Persona Natural" ? cliente.dni : cliente.dni_representante,
            nombre_representante_legal: cliente.tipo == "Persona Natural" ? cliente.razon_social : cliente.representante_legal,
            cargo_representante_legal: cliente.cargo_representante,
            
            }
        }
        }

    return { codigo: 200, respuesta: respuesta } 
} // Exporta la función para que pueda ser utilizada en otros módulos