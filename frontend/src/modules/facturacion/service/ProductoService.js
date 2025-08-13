import api from "@/shared/services/api";

const productoService = {
    ObtenerPiezas: async () => {
        const res = await api.get(`/piezas`);
        return res.data;
        console.log(res.data);
    },
}


export default productoService