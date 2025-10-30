const coleccionEstadosPedidos = (rol) => {
    switch (rol) {
        case 'Jefa de Almacén':
            return [
                { id: 1, value: 'Stock Confirmado', label: 'Stock Confirmado' },
                { id: 7, value: "Incompleto", label: "Incompleto" },
            ]
        case 'CEO':
            return [
                { id: 1, value: "", label: "Todos" },
                { id: 2, value: "Por Confirmar", label: "Por Confirmar" },
                { id: 3, value: "Pre Confirmado", label: "Pre Confirmado" },
                { id: 4, value: "Confirmado", label: "Confirmado" },
                { id: 5, value: "Rechazado", label: "Rechazado" },
                { id: 6, value: "Stock Confirmado", label: "Stock Confirmado" },
                { id: 7, value: "Incompleto", label: "Incompleto" },
                { id: 8, value: "Finalizado", label: "Finalizado" }
            ]
        case 'Técnico Comercial':
            return [
                { id: 1, value: "", label: "Todos" },
                { id: 2, value: "Por Confirmar", label: "Por Confirmar" },
                { id: 3, value: "Pre Confirmado", label: "Pre Confirmado" },
                { id: 4, value: "Confirmado", label: "Confirmado" },
                { id: 5, value: "Rechazado", label: "Rechazado" },
                { id: 6, value: "Stock Confirmado", label: "Stock Confirmado" },
                { id: 7, value: "Incompleto", label: "Incompleto" },
                { id: 8, value: "Finalizado", label: "Finalizado" }
            ]
        case 'Auxiliar de oficina':
            return [
                { id: 1, value: 'Stock Confirmado', label: 'Stock Confirmado' },
                { id: 7, value: "Incompleto", label: "Incompleto" },
            ]
        default:
            return [
                { id: 1, value: 'Stock Confirmado', label: 'Stock Confirmado' },
                { id: 7, value: "Incompleto", label: "Incompleto" },
            ]
    }
};

export default coleccionEstadosPedidos;
