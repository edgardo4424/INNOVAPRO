const procesarItem = (serie, detalle, seriesFactura, seriesBoleta) => {
    // Buscar la descripción correspondiente a la serie
    const series = [...seriesFactura, ...seriesBoleta];
    const serieObj = series.find(s => s.value === serie);
    if (!serieObj) return detalle;

    const descSerie = serieObj.descrip; // ALQUILER, TRANSPORTE, SERVICIO, VENTA

    return detalle.map(item => {
        const nuevoItem = { ...item };

        if (serie === "FT01" || serie === "BT01") {
            // Caso ALQUILER principal
            if (nuevoItem.tipo_item == null) {
                nuevoItem.tipo_item = descSerie; // ALQUILER
            }
            // si tiene tipo_item diferente, se respeta
        } else {
            // Cualquier otra serie (FT02, FT03, FT04, etc.)
            // Sólo hacemos excepción si el item es ALQUILER
            if (nuevoItem.tipo_item !== "ALQUILER") {
                nuevoItem.tipo_item = descSerie;
            }
            // si es ALQUILER, lo dejamos igual
        }

        return nuevoItem;
    });
}

module.exports = { procesarItem };