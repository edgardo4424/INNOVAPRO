const AtributosValor = require("../../domain/entities/atributos_valor"); // Importamos la clase AtributosValor

module.exports = async (atributosValorData, atributosValorRepository) => {
  const errorCampos = AtributosValor.validarCamposObligatorios(atributosValorData, "crear"); // Validamos los campos obligatorios de la AtributosValor
  if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } }; 

  const nuevaAtributosValorData = new AtributosValor(atributosValorData); // Creamos una nueva instancia de la clase AtributosValor con los datos proporcionados
  const nuevoAtributoValor = await atributosValorRepository.crear(nuevaAtributosValorData); // Creamos el nuevo AtributoValor con todos sus datos en la base de datos

  return {
    codigo: 201,
    respuesta: { mensaje: "Atributos con su valor creado exitosamente", atributos_valor: nuevoAtributoValor },
  }; 
}; // Exporta la función para que pueda ser utilizada en otros módulos
