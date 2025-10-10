const obtenerFechaActual = (a) => {
    const ahora = new Date();
    // función para formatear fecha local con offset
    function formatearFecha(date) {
        const año = date.getFullYear();
        const mes = String(date.getMonth() + 1).padStart(2, "0");
        const dia = String(date.getDate()).padStart(2, "0");
        const horas = String(date.getHours()).padStart(2, "0");
        const minutos = String(date.getMinutes()).padStart(2, "0");
        const segundos = String(date.getSeconds()).padStart(2, "0");
        return `${año}-${mes}-${dia}T${horas}:${minutos}:${segundos}-05:00`;
    }

    // fecha de traslado sumando 30 minutos
    const traslado = new Date(ahora.getTime() + 30 * 60 * 1000);
    
    if (a == "traslado") {
        return formatearFecha(traslado);
    }
    return formatearFecha(ahora);
}

export { obtenerFechaActual }