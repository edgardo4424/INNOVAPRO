const Contrato = require("../../domain/entities/contrato");
const { generarCodigoDocumentoContrato } = require("../../infraestructure/services/generarCodigoDocumentoContrato");


const SequelizeCotizacionRepository = require("../../../cotizaciones/infrastructure/repositories/sequelizeCotizacionRepository");
const cotizacionRepository = new SequelizeCotizacionRepository();

const CONST_ESTADO_COTIZACION_POR_APROBAR = 3; // Asumiendo que 3 es el ID del estado "Por Aprobar"

const generarPdfCotizacion = require('../../../cotizaciones/application/useCases/generarPdfCotizacion');

const db = require("../../../../database/models");


module.exports = async (payload,usuario_id, contratoRepository,transaction=null)=>{
  

    // Validar que una cotizacion existe
    const cotizacionExiste = await cotizacionRepository.obtenerPorId(payload.cotizacion_id,transaction);

    if (!cotizacionExiste) {
        return {
            codigo:404,
            respuesta: { mensaje: "La cotización asociada no existe" }
        }
    }

    if(cotizacionExiste.estados_cotizacion_id != CONST_ESTADO_COTIZACION_POR_APROBAR){
        return {
            codigo:400,
            respuesta: { mensaje: "La cotización debe estar en el estado POR APROBAR" }
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

    // una vez que se crea el contrato, el pdf de la cotizacion no tendra que ser editable
    // Por lo cual se guardara toda la data del pdf en la tabla cotizaciones para persistir la informacion de la cotizacion en el momento de crear el contrato

    // obteniendo la data del pdf de la cotizacion

    const dataPdfCotizacion= await generarPdfCotizacion(cotizacionExiste.id,transaction);

    console.log("Data del PDF de la cotización generado:", dataPdfCotizacion);

    // Guardar el snapshot de la cotizacion cuando se pase a contrato 
    const cotizacionActualizado = await db.cotizaciones.update(
        { pdf_cotizacion_data_snapshot: dataPdfCotizacion.respuesta, estados_cotizacion_id: 4 }, // Asumiendo que el siguiente estado es "Aprobado"
        { where: { id: payload.cotizacion_id }, transaction }
    );

    return{
        codigo:200,
        respuesta:{
            mensaje:"Contrato creado exitosamente",
            contrato:contrato_creado
        }
    }
}

