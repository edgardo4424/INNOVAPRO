const  calcularEdad=(fechaNacimiento)=> {
    const hoy = new Date();
    const [anio, mes, dia] = fechaNacimiento.split('-').map(Number);
    const nacimiento = new Date(anio, mes - 1, dia);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    // Ajuste si aún no ha cumplido años este año
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();

    if (mesActual < (mes - 1) || (mesActual === (mes - 1) && diaActual < dia)) {
        edad--;
    }

    return edad;
}

module.exports=calcularEdad