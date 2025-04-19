const Obra = require("../../domain/entities/obra"); // Importamos la clase Obra

module.exports = async (obraData, obraRepository) => {
  const errorCampos = Obra.validarCamposObligatorios(obraData, "crear"); // Validamos los campos obligatorios de la obra
  if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } }; 

  const nuevaObraData = new Obra(obraData); // Creamos una nueva instancia de la clase Obra con los datos proporcionados
  const nuevoObra = await obraRepository.crear(nuevaObraData); // Creamos el nuevo obra con todos sus datos en la base de datos

  return {
    codigo: 201,
    respuesta: { mensaje: "Obra creado exitosamente", obra: nuevoObra },
  }; // Retornamos el obra creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
