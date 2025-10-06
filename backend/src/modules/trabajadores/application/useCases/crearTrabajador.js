const Trabajador = require("../../domain/entities/trabajador");

module.exports = async (empleadoData, trabajadorRepository,transaction = null) => {
   
   
    const trabajador = new Trabajador(empleadoData);

   const errores = trabajador.validarCamposObligatorios(); // Validamos campos obligatorios

   console.log('errores', errores);

   if (errores.length > 0)
      return { codigo: 400, respuesta: { mensaje: errores } };

   const nuevoTrabajadorData = trabajador.get(); // Almacenamos los datos del contacto a crear

    // Validar que no exista un dni duplicado

   const trabajadorExistente = await trabajadorRepository.obtenerTrabajadorPorNroDocumento(nuevoTrabajadorData.numero_documento, transaction);
    
    if (trabajadorExistente) {
      return {
         codigo: 400,
         respuesta: { mensaje: "Ya existe un trabajador activo con ese número de documento." },
      };
   }
   
   const nuevoTrabajador = await trabajadorRepository.crear(
      nuevoTrabajadorData,
      transaction
   ); // Creamos el nuevo trabajador con todos sus datos en la base de datos

   return {
      codigo: 201,
      respuesta: {
         mensaje: "Contacto Trabajador exitosamente",
         trabajador: nuevoTrabajador,
      },
   }; // Retornamos el Trabajador creado
}; // Exporta la función para que pueda ser utilizada en otros módulos
