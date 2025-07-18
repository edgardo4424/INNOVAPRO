const Tarea = require("../../domain/entities/tarea"); // Importamos la clase Tarea
const db = require("../../../../models");

const sequelizeObraRepository = require("../../../obras/infrastructure/repositories/sequelizeObraRepository"); // Importamos el repositorio de obras
const obraRepository = new sequelizeObraRepository(); // Instancia del repositorio de obras

const ID_ESTADO_COTIZACION_EN_PROCESO = 1; // Estado por aprobar por el comercial

module.exports = async (tareaData, tareaRepository) => {
  const errorCampos = Tarea.validarCamposObligatorios(tareaData, "crear"); // Validamos los campos obligatorios de la tarea
  if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } };

  // Buscar obra
  const obra = await obraRepository.obtenerPorId(tareaData.obraId);
  if (!obra)
    return { codigo: 404, respuesta: { mensaje: "Obra no encontrada." } };

  const tarea = {
    ...tareaData,
    ubicacion: obra.ubicacion,
    atributos_valor_zonas: tareaData.zonas,
  };

  const nuevaTareaData = new Tarea(tarea); // Creamos una nueva instancia de la clase Tarea con los datos proporcionados

  if (nuevaTareaData?.detalles?.apoyoTecnico && nuevaTareaData?.detalles?.apoyoTecnico.includes("Despiece")) {
    
    // Si la tarea viene incluido un despiece, se crea la cotizacion con estado "En proceso"
    const dataCotizacion = {
      despiece_id: null,
      contacto_id: tarea.contactoId,
      cliente_id: tarea.clienteId,
      obra_id: tarea.obraId,
      filial_id: tarea.empresaProveedoraId,
      usuario_id: tarea.usuarioId,
      estados_cotizacion_id: ID_ESTADO_COTIZACION_EN_PROCESO,
      uso_id: tarea.usoId,
      tipo_cotizacion: tarea.detalles?.tipo_cotizacion,
      tiempo_alquiler_dias: tarea.detalles?.dias_alquiler || null,
    };

    const cotizacionCreada = await db.cotizaciones.create(dataCotizacion);

    nuevaTareaData.cotizacionId = cotizacionCreada.id
    
  }

  const nuevoTarea = await tareaRepository.crear(nuevaTareaData); // Creamos el nuevo tarea con todos sus datos en la base de datos

  return {
    codigo: 201,
    respuesta: { mensaje: "Tarea creado exitosamente", tarea: nuevoTarea },
  }; 

};
