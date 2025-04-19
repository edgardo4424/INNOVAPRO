const Filial = require("../../domain/entities/filial"); // Importamos la clase Filial

module.exports = async (id, filialData, filialRepository, entidadService) => {
    const filial = await filialRepository.obtenerPorId(id); // Llama al método del repositorio para obtener el filial por ID
    if (!filial) return { codigo: 404, respuesta: { mensaje: "Filial no encontrado" } } // Si no se encuentra el filial, retorna un error 404

    const errorCampos = Filial.validarCamposObligatorios(filialData, "editar"); // Validamos los campos obligatorios de la entidad Filial
    if (errorCampos) { return { codigo: 400, respuesta: { mensaje: errorCampos } } } // Validamos campos obligatorios

    const duplicado = await entidadService.verificarDuplicadosRUC(filialRepository.getModel(), filialData, id) // Validamos los campos duplicados
    if ( duplicado ) return { codigo: 400, respuesta: { mensaje: duplicado } } // Verificamos si hay duplicados

    const filialActualizado = await filialRepository.actualizarFilial(id, filialData)

    return { codigo: 200, respuesta: { mensaje: "Filial actualizado correctamente", filial: filialActualizado } } // Retornamos el cliente creado
} // Exporta la función para que pueda ser utilizada en otros módulos