 function validaTarea(detalle) {
    const camposRequeridos = [
        { key: "tipoSolicitud", name: "Tipo de Solicitud" },
        { key: "nota", name: "Nota" },
        { key: "fechaLimite", name: "Fecha Limite" },
        { key: "prioridad", name: "Tipo de Prioridad" },
    ];
    const errores = {};
    let validos = true;
    for (const campo of camposRequeridos) {
        if (!detalle[campo.key] || detalle[campo.key] === "") {
            errores[campo.key] = `El campo ${campo.name} es requerido.`;
            validos = false;
        }
    }
    return { errores, validos };
}

export { validaTarea };