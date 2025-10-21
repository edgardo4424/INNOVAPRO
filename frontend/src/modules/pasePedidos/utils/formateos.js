const formateEstadoPedido = (estado) => {
    switch (estado) {
        case "Confirmado":
            return "bg-green-500 !text-white";
        case "Almacen":
            return "bg-yellow-500 !text-white";
        case "Despacho":
            return "bg-blue-500 !text-white";
        default:
            return "bg-gray-500 !text-white";
    }
};

export { formateEstadoPedido };