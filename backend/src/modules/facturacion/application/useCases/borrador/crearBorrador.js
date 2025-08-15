const Borrador = require("../../../domain/entities/borrador")

module.exports = async (body, borradorRepository) => {

    const { success, message, data } = Borrador.crear(body);

    if (!success) {
        return {
            codigo: 400,
            respuesta: {
                success: success,
                message: message,
                data: null,
            },
        };
    }

    const resultadoCreacion = await borradorRepository.crearBorrador(data);

    if (!resultadoCreacion.success) {
        return {
            codigo: 400,
            respuesta: {
                success: false,
                message: "El borrador no se creo correctamente.",
                data: null,
                status: 400
            }
        };
    }


    return {
        codigo: 201,
        respuesta: {
            success: true,
            message: "El borrador se creo correctamente.",
            data: null,
            status: 201
        }
    };
}

