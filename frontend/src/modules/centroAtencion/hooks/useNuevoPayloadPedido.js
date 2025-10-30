const nuevoPayloadPedido = (tipoSolicitud, pedido_id) => {

    if (tipoSolicitud === "Validación de Stock") {
        return {
            payload: {
                estado: "Stock Confirmado",
                tarea_id: null
            },
            pedido_id: pedido_id
        }
    } else if (tipoSolicitud === "Nuevo Despiece") {
        return {
            payload: {
                estado: "Stock Confirmado",
                tarea_id: null
            },
            pedido_id: pedido_id
        }
    }

}

export default nuevoPayloadPedido;