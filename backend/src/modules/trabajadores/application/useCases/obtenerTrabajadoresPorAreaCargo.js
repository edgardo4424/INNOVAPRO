const obtenerCargosArea = require("../../infraestructure/utils/obtenerCargosArea");

module.exports = async ( fecha, rol, trabajadorRepository) => {
  if (!fecha) {
    throw new Error("No se ha proporcionado una fecha")
  }
    console.log(fecha);

  const cargos_areas = obtenerCargosArea(rol);
  if (!cargos_areas) {
    throw new Error("El usuario no tiene los permisos suficientes")
  }
  console.log(fecha);
  
  
  //Nos traeta todos los trabajadores por el area y fecha especificada
  const response =
    await trabajadorRepository.obtenerTrabajadoresPorAreaCargo(
      fecha,
      cargos_areas
    );  
  return {
    codigo: 201,
    respuesta: {
      mensaje: "Petición exitosa",
      datos: response,
    },
  }; // Retornamos los trabajadores
};
