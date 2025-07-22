import apiFactilizaConsultas from "@/shared/services/factilizaConsultas";
import apiFactilizaFacturacion from "@/shared/services/factilizaFacturacion";



const facturacionService = {


    // !!! FACTURACION

    facturacion: async (factura) => {
        const res = await apiFactilizaFacturacion.post("/invoice/send", factura);
        return res.data;
    },

    // !!! CONSULTAS
    obtenerPersonaPorDni: async (dni) => {
        const res = await apiFactilizaConsultas.get(`/dni/info/${dni}`);
        return res.data;
    },

    obtenerEmpresaPorRuc: async (ruc) => {
        const res = await apiFactilizaConsultas.get(`/ruc/info/${ruc}`);
        return res.data;
    },

    obtenerEstablecimientosPorRuc: async (ruc) => {
        const res = await apiFactilizaConsultas.get(`/ruc/anexo/${ruc}`);
        return res.data;
    },

    obtenerVehiculoPorPlaca: async (placa) => {
        const res = await apiFactilizaConsultas.get(`/placa/info/${placa}`);
        return res.data;
    },

    obtenerLicenciaPorDni: async (dni) => {
        const res = await apiFactilizaConsultas.get(`/licencia/info/${dni}`);
        return res.data;
    },

    obtenerExtranjeroPorCee: async (cee) => {
        const res = await apiFactilizaConsultas.get(`/cee/info/${cee}`);
        return res.data;
    },

    obtenerTipoCambioDia: async (fecha) => {
        const res = await apiFactilizaConsultas.get(`/tipocambio/info/dia?fecha=${fecha}`);
        return res.data;
    },

    obtenerTipoCambioMes: async (mes, anio) => {
        const res = await apiFactilizaConsultas.get(`/tipocambio/info/mes?anio=${anio}&mes=${mes}`);
        return res.data;
    },
};


export default facturacionService