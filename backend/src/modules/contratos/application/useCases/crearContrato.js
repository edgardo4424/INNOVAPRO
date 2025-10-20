const Contrato = require("../../domain/entities/contrato");
const { generarCodigoDocumentoContrato } = require("../../infraestructure/services/generarCodigoDocumentoContrato");
 
module.exports = async (contratoRepository,payload,transaction=null)=>{
    const contrato=new Contrato(payload);
    const errores=contrato.validar();
    if(errores.length>0){
        return{
            codigo:400,
            respuesta:errores
        }
    }

    const codigo_documento_contrato = await generarCodigoDocumentoContrato({cotizacion_id:contrato.cotizacion_id, usuario_id:contrato.usuario_id});

    if(!codigo_documento_contrato){
        return{
            codigo:404,
            respuesta:{mensaje:"Cotización no encontrada para generar el código del contrato"}
        }
    }

    const contrato_creado=await contratoRepository.crearContrato(contrato,transaction);
    return{
        codigo:200,
        respuesta:{
            mensaje:"Contrato creado exitosamente",
            contrato:contrato_creado
        }
    }
}

