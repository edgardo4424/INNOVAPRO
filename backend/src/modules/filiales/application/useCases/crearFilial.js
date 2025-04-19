const Filial = require("../../domain/entities/filial"); // Importamos la clase Filial

module.exports = async (filialData, filialRepository, entidadService) => {
  const errorCampos = Filial.validarCamposObligatorios(filialData, "crear"); // Validamos los campos obligatorios de la entidad Filial
  if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } }; // Validamos campos obligatorios

  const duplicado = await entidadService.verificarDuplicadosRUC(filialRepository.getModel(), filialData) // Validamos los campos duplicados
  if ( duplicado ) return { codigo: 400, respuesta: { mensaje: duplicado } } // Verificamos si hay duplicados

  const nuevoFilialData = new Filial(filialData); // Creamos una nueva instancia de la clase Filial con los datos proporcionados
  const nuevoFilial = await filialRepository.crear(nuevoFilialData); // Creamos el nuevo filial en la base de datos

  return { codigo: 201, respuesta: { mensaje: "Filial creado exitosamente", empresa: nuevoFilial } }; // Retornamos el cliente creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
