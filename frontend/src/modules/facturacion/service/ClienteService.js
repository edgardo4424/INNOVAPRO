import api from "@/shared/services/api";

const ClienteService = {
    ObtenerClientes: async () => {
        const res = await api.get(`/clientes`);
        return res.data;
        console.log(res.data);
    },
}


export default ClienteService