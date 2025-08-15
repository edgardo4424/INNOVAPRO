const DataMantenimiento = require("../../domain/entities/DataMantenimiento"); 

module.exports = async (id, mantenimientoData, DataMantenimientoRepository) => {

    const dataMantenimiento = await DataMantenimientoRepository.obtenerPorId(id); 
    if (!dataMantenimiento) return { codigo: 404, respuesta: { mensaje: "Dato de mantenimiento no encontrado" } } 

    const errorCampos = DataMantenimiento.validarCamposObligatorios(mantenimientoData, "editar");
    if (errorCampos) { return { codigo: 400, respuesta: { mensaje: errorCampos } } } 

    const dataMantenimientoActualizado = await DataMantenimientoRepository.actualizarDataMantenimiento(id, mantenimientoData)

    return { codigo: 200, respuesta: { mensaje: "Data de mantenimiento actualizado correctamente", data_mantenimiento: dataMantenimientoActualizado } }
} 