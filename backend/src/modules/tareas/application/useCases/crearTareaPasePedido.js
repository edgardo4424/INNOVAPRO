const SequelizePasePedidoRepository = require("../../../pases_pedidos/infraestructure/repositories/sequelizePasePedidoRepository");
const Tarea = require("../../domain/entities/tarea");
const pasePedidoRepository = new SequelizePasePedidoRepository();
module.exports = async (tareaData, tareaRepository, transaction = null) => {
  const errorCampos = Tarea.validarCamposObligatorios(tareaData, "crear");
  if (errorCampos) return { codigo: 400, respuesta: { mensaje: errorCampos } };
  const pase_pedido = await pasePedidoRepository.obtenerPasePedido(
    tareaData.pase_pedido_id,
    transaction
  );
  console.log("Paso ka obtendcion de una pse de pedido", pase_pedido);

  if (!pase_pedido)
    return {
      codigo: 404,
      respuesta: { mensaje: "Pase de pedido  no encontrado." },
    };
  if (pase_pedido.tarea_id) {
    throw new Error("El pase de pedido ya tiene una tarea asignada");
  }
  const nuevaTareaData = new Tarea(tareaData);

  const tarea_creada = await tareaRepository.crear(nuevaTareaData, transaction);
  const tarea_id = tarea_creada.id;

  await pasePedidoRepository.actualizarPasePedido(
    { tarea_id },
    pase_pedido.id,
    transaction
  );

  return {
    codigo: 201,
    respuesta: {
      mensaje: "Tarea creada y asignada al pase de pedido",
      tarea: tarea_creada,
    },  
  };
};
