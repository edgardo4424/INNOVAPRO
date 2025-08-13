import api from "@/shared/services/api";

const ubigeoService = {
    obtenerProvincias: async () => {
        const res = await api.get(`/ubigeo/provincias`);
        return res.data;
    },
    obtenerDistritos: async (provincia_id) => {
        const res = await api.get(`/ubigeo/distritos/${provincia_id}`);
        return res.data;
    },
    obtenerCiudades: async (distrito_id) => {
        const res = await api.get(`/ubigeo/ciudades/${distrito_id}`);
        return res.data;
    }
}