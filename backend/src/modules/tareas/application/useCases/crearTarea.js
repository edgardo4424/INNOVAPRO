
const Tarea = require("../../domain/entities/tarea"); // Importamos la clase Tarea

const sequelizeObraRepository = require('../../../obras/infrastructure/repositories/sequelizeObraRepository'); // Importamos el repositorio de obras
const obraRepository = new sequelizeObraRepository(); // Instancia del repositorio de obras

module.exports = async (tareaData, tareaRepository) => {
  const errorCampos = Tarea.validarCamposObligatorios(tareaData, "crear"); // Validamos los campos obligatorios de la tarea
  if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } }; 

  // Buscar obra
  const obra = await obraRepository.obtenerPorId(tareaData.obraId)
  if(!obra) return { codigo: 404, respuesta: { mensaje: "Obra no encontrada." } }

  
  const tarea = {
    ...tareaData,
    ubicacion: obra.ubicacion,
    atributos_valor_zonas: tareaData.zonas
  }

  const nuevaTareaData = new Tarea(tarea); // Creamos una nueva instancia de la clase Tarea con los datos proporcionados

  console.log("Nueva Tarea Data:",nuevaTareaData)
  const nuevoTarea = await tareaRepository.crear(nuevaTareaData); // Creamos el nuevo tarea con todos sus datos en la base de datos

  return {
    codigo: 201,
    respuesta: { mensaje: "Tarea creado exitosamente", tarea: nuevoTarea },
  }; // Retornamos la tarea creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
