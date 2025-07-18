import api from "@/shared/services/api";

const stockPiezasService = {

  obtenerStockPiezas: async () => {
    const res = await api.get("/stock");
    return res.data;
  },

};

export default stockPiezasService;