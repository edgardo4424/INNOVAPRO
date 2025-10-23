const SequelizePasePedidoRepository = require("../../../pases_pedidos/infraestructure/repositories/sequelizePasePedidoRepository");
const Tarea = require("../../domain/entities/tarea");
const pasePedidoRepository = new SequelizePasePedidoRepository();
module.exports = async (tareaData, tareaRepository) => {
  const errorCampos = Tarea.validarCamposObligatorios(tareaData, "crear");
  if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } };
  const pase_pedido = await pasePedidoRepository.obtenerPasesPedido(
    tareaData.pase_pedido_id
  );
    if (!pase_pedido)
    return { codigo: 404, respuesta: { mensaje: "Pase de pedido  no encontrado." } };
    if(pase_pedido.tarea_id){
        return { codigo: 404, respuesta: { mensaje: "El pase de pedido ya tiene una tarea asignada" } };
    }
    const nuevaTareaData = new Tarea(tareaData);

    const nuevoTarea = await tareaRepository.crear(nuevaTareaData);
      return {
        codigo: 201,
        respuesta: { mensaje: "Tarea creado exitosamente", tarea: nuevoTarea },
    }; 

};
