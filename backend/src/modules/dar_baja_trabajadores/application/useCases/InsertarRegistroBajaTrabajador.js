module.exports = async (dataBody, transaction = null, darBajaTrabajadorRepository) => {
      await darBajaTrabajadorRepository.insertarRegistroBajaTrabajador(dataBody, transaction);

   return {
      codigo: 201,
      respuesta: { mensaje: "Trabajador dado de baja exitosamente" },
   };
};
