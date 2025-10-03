import api from "@/shared/services/api";

const trabajadoresDadosDeBajaService = {
   getFiliales: () => api.get("/filiales"),
   getTrabajadoresConContratosVigentes: (dataPOST) => api.post("/trabajadores/contratos-vigentes", dataPOST),
   darDeBajaTrabajador: (dataPOST) => api.post("/dar_baja_trabajadores", dataPOST),
   getTrabajadoresDadosDeBaja: () => api.get("/dar_baja_trabajadores"),
   reporteLiquidacion: (id) => api.get(`/reports/liquidacion-pdf/${id}`, {
    responseType: "blob", // MUY IMPORTANTE
  }),
  getMotivosLiquidacion: () => api.get("/motivos_liquidacion"),

};

export default trabajadoresDadosDeBajaService;
