const axios = require("axios");

module.exports = async () => {
  const asistenciaClient = axios.create({
    baseURL: "https://marcate.grupoinnova.pe/backend/api/data_publica/",
    headers: {
      Authorization:
        "ApiKey marcate_sk_51a43bbf0d3b2e34b42a24fb89fd29b0a4ca551adcb2a89f5e418253cbad5788",
    },
    timeout: 10000,
  });

  const respuesta = await asistenciaClient.post("asistencias-por-fecha", {
    fecha: "2025-10-01",
    lista_dni_trabajadores: ["4861869"],
  });

  // console.log("Respuesta del sistema de asistencias:", datosAsistencias);
  return {
    codigo: 200,
    respuesta: respuesta.data,
  };
};
