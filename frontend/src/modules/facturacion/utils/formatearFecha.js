const formatearFecha = (fecha) => {
    const fechaDate = new Date(fecha);
    const dia = fechaDate.getDate().toString().padStart(2, "0");
    const mes = (fechaDate.getMonth() + 1).toString().padStart(2, "0");
    const anio = fechaDate.getFullYear();
    return `${dia}/${mes}/${anio}`;
};

export { formatearFecha };