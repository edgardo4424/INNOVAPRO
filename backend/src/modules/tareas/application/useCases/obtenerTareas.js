module.exports = async (tareaRepository, id, rol) => {
    let id_mis_tareas = null;
    if (
        rol !== "CEO" &&
        rol !== "Gerente general" &&
        rol !== "Gerente de comercialización" &&
        rol !== "Gerente de administración" &&
        rol !== "Jefe de OT" &&
        rol !== "OT"
    ) {
        id_mis_tareas = id;
    }

    const tareas = await tareaRepository.obtenerTareas(id_mis_tareas);
    return { codigo: 200, respuesta: tareas };
};
