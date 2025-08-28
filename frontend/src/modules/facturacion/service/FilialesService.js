import api from "@/shared/services/api";

const filialesService = {
    ObtenerPiezas: async () => {
        const res = await api.get(`/filiales`);
        return res.data;
        console.log(res.data);
    },
}


export default filialesService