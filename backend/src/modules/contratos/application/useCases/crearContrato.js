const Contrato = require("../../domain/entities/contrato");
const { generarCodigoDocumentoContrato } = require("../../infraestructure/services/generarCodigoDocumentoContrato");


const SequelizeCotizacionRepository = require("../../../cotizaciones/infrastructure/repositories/sequelizeCotizacionRepository");

const cotizacionRepository = new SequelizeCotizacionRepository();

const CONST_ESTADO_COTIZACION_APROBADO = 4; // Asumiendo que 4 es el ID del estado "Aprobado"

module.exports = async (payload,usuario_id, contratoRepository,transaction=null)=>{
  

    // Validar que una cotizacion existe
    const cotizacionExiste = await cotizacionRepository.obtenerPorId(payload.cotizacion_id,transaction);

    if (!cotizacionExiste) {
        return {
            codigo:404,
            respuesta: { mensaje: "La cotización asociada no existe" }
        }
    }

    if(cotizacionExiste.estados_cotizacion_id != CONST_ESTADO_COTIZACION_APROBADO){
        return {
            codigo:400,
            respuesta: { mensaje: "La cotización asociada no está en estado aprobado" }
        }
    }

    // Validar si la cotizacion_id esta asociado a un contrato
    const contratoExistente= await contratoRepository.buscarContratoPorCotizacionId(payload.cotizacion_id,transaction);

    if(contratoExistente){
        return{
            codigo:400,
            respuesta:{mensaje:"La cotización ya tiene un contrato asociado"}
        }
    }

    const codigo_documento_contrato = await generarCodigoDocumentoContrato({cotizacion_id:payload.cotizacion_id, usuario_id: usuario_id});

    console.log("Código de documento de contrato generado:", codigo_documento_contrato);
    
    const contratoData = {
        ...payload,
        ref_contrato: codigo_documento_contrato,

        contacto_id: cotizacionExiste.contacto_id,
        cliente_id: cotizacionExiste.cliente_id,
        obra_id: cotizacionExiste.obra_id,
        uso_id: cotizacionExiste.uso_id,
        filial_id: cotizacionExiste.filial_id,
        despiece_id: cotizacionExiste?.despiece_id || null,
        usuario_id: usuario_id
    }


    const contrato_creado=await contratoRepository.crearContrato(contratoData,transaction);
    return{
        codigo:200,
        respuesta:{
            mensaje:"Contrato creado exitosamente",
            contrato:contrato_creado
        }
    }
}

