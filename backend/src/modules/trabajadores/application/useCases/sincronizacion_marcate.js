const asistenciaClient = require("../../infraestructure/service/apiMarcate");

module.exports = async (payload) => {

  console.log("Paylaod recibido: ",payload);
  
  const{lista_dni,fecha}=payload;
  if (!lista_dni||!fecha) {
    return{
      codigo:400,
      respuesta:"Payload enviado incorrecto"
    }
  }
  const respuesta = await asistenciaClient.post("asistencias-por-fecha", {
    fecha: fecha,
    lista_dni_trabajadores: [lista_dni],
  });
  // console.log("Respuesta del sistema de asistencias:", respuesta.data);
  return {
    codigo: 200,
    respuesta: respuesta.data,
  };
};
