import api from "@/shared/services/api";

const planillaMensualService = {
   obtenerPlanillaMensual: async (dataPOST) => {
      const res = await api.post(
         "/planilla/planilla-mensual-calcular",
         dataPOST
      );
      return res.data;
   },
   obtenerHistoricoPlanillaMensual: async (dataPOST) => {
      const res = await api.post(
         "/planilla/mensual",
         dataPOST
      );
      return res.data;
   },
   obtenerFiliales: async () => {
      const res = await api.get("/filiales");
      return res.data;
   },
   
   generarCierreRegistroPlanillaMensual: async (data) =>
      api.post("/planilla/planilla-mensual-cierre", data),

   obtenerDatosMantenimiento:async(filial_id)=>
      api.get(`/data_mantenimiento/codigo-importe/${filial_id}_importe`),
   editDataMantenimiento: (id, data) => api.put(`/data_mantenimiento/${id}`, data),

   exportarPlame:(payload)=>api.post("/planilla/exportar-plame",payload, {
  responseType: 'blob', // 👈 Esto fuerza a axios a interpretar la respuesta como archivo binario
   }),
   obtenerReciboPorPlanilla:async(fecha_anio_mes,filial_id)=>api.get(`/planilla/obtener-recibos-planilla/${fecha_anio_mes}/${filial_id}`)
   ,
   crearReciboPorPlanilla:async(data)=>api.post("/recibo_x_honorarios/crear-recibo-planilla",data)
};

export default planillaMensualService;
