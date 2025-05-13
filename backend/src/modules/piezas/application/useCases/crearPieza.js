const Pieza = require("../../domain/entities/pieza"); // Importamos la clase Pieza

module.exports = async (piezaData, piezaRepository) => {
  const errorCampos = Pieza.validarCamposObligatorios(piezaData, "crear"); // Validamos los campos obligatorios de la pieza
  if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } }; 

  // Verificar si hay una pieza con el mismo item
  const piezaExistente = await piezaRepository.obtenerPiezaPorItem(piezaData.item);
  if (piezaExistente) {
    return { codigo: 400, respuesta: { mensaje: "El item ya fué registrado en otra pieza" } }
  }

  const nuevaPiezaData = new Pieza(piezaData); // Creamos una nueva instancia de la clase Pieza con los datos proporcionados
  const nuevoPieza = await piezaRepository.crear(nuevaPiezaData); // Creamos el nuevo pieza con todos sus datos en la base de datos

  return {
    codigo: 201,
    respuesta: { mensaje: "Pieza creado exitosamente", pieza: nuevoPieza },
  }; // Retornamos el pieza creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
