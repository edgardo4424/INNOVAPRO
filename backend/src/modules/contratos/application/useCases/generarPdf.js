const { datosParaPdfColgante } = require("../../infraestructure/services/Colgante/datosParaPdfColgante");

module.exports = async (contrato_id, contratoRepository, transaction = null) => {
    const contrato = await contratoRepository.obtenerPorId(contrato_id, transaction); // Llama al método del repositorio para obtener el contrato por ID

    console.log("contrato", contrato)
    if(!contrato){
        return {
            codigo: 404,
            respuesta: {error: "Contrato no encontrado"}
        }
    }

    let resultado = null;
    // Verificar por switch el uso de contrato
    switch(contrato.uso_id+""){
        case "1":
            // Anadamio de fachada
            break;
        case "2":
            // Andamio de trabajo
            break;
        case "3":
            // Escalera de acceso
            break;
        case "4":
            // Escuadras con plataforma
            break;
        case "5":
            // Puntales
            break;
        case "6":
            // Encofrado
            break;
        case "7":
            // Plataformas de descarga
            break;
        case "8":
            // Colgante
            resultado = await datosParaPdfColgante({ contrato_id }, transaction);
            break;
        case "9":
            // Elevador 
            break;
        case "10":
            // Despiece manual
            break;
        case "11":
            // Escuadras sin plataforma
            break;
        default:
            break;
    }

    return {
        codigo: 200,
        respuesta: resultado
    }
}
