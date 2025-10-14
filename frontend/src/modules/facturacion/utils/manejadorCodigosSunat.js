const determinarEstadoFactura = (respuesta) => {
    const cdrCode = respuesta?.data?.sunatResponse?.cdrResponse?.code;
    const errorCode = respuesta?.data?.error?.code;
    const errorMessage = respuesta?.data?.error?.message?.toLowerCase() || "";
    const mensaje = respuesta?.message?.toLowerCase() || "";

    // * SUNAT aceptó
    if (respuesta.success === true && cdrCode === "0") {
        return "EMITIDA";
    }

    // todo Ticket presente → pendiente
    if (
        errorCode === "0133" ||
        errorCode === "1033" ||
        errorCode === "HTTP" ||
        errorCode === "0100" ||
        errorCode === "0109" ||
        errorCode === "0135" ||
        errorCode === "0136" ||
        errorCode === "91510" ||
        errorCode === "InternalServerError"
    ) {
        return "PENDIENTE";
    }

    //! SUNAT ya tiene el comprobante rechazado/anulado, o falló la validación del contenido
    const codeNumber = parseInt(errorCode);

    if (
        // Errores específicos de duplicidad o anulación
        errorCode === "1032" || // Previamente informado en comunicación de baja
        errorCode === "2325" || // Comprobante ya existe
        // Rango de errores de validación de contenido (ej. RUC, montos, formato, etc.)
        (codeNumber >= 2000 && codeNumber <= 4000)
    ) {
        return "RECHAZADA";
    }

    // SUNAT rechazó (por código CDR)
    if (respuesta.success === true && cdrCode && cdrCode !== "0") {
        return "RECHAZADA";
    }

    return "PENDIENTE";
};

export default determinarEstadoFactura;