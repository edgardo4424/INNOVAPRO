import apiFactilizaConsultas from "@/shared/services/factilizaConsultas";
import apiFactilizaFacturacion from "@/shared/services/factilizaFacturacion";

const getRequest = async (api, endpoint) => {
    const res = await api.get(endpoint);
    return res.data;
};

const factilizaService = {


    // !!! FACTURACION

    enviarFactura: async (factura) => {
        const res = await apiFactilizaFacturacion.post("/invoice/send", factura);
        return res.data;
    },

    // !!! Guia de Remision

    enviarGuia: async (guia) => {
        const res = await apiFactilizaFacturacion.post("/despatch/send", guia);
        return res.data;
    },

    // !!! CONSULTAS
    obtenerPersonaPorDni: (dni) => getRequest(apiFactilizaConsultas, `/dni/info/${dni}`),
    obtenerEmpresaPorRuc: (ruc) => getRequest(apiFactilizaConsultas, `/ruc/info/${ruc}`),
    obtenerEstablecimientosPorRuc: (ruc) => getRequest(apiFactilizaConsultas, `/ruc/anexo/${ruc}`),
    obtenerVehiculoPorPlaca: (placa) => getRequest(apiFactilizaConsultas, `/placa/info/${placa}`),
    obtenerLicenciaPorDni: (dni) => getRequest(apiFactilizaConsultas, `/licencia/info/${dni}`),
    obtenerExtranjeroPorCee: (cee) => getRequest(apiFactilizaConsultas, `/cee/info/${cee}`),
    obtenerTipoCambioDia: (fecha) => getRequest(apiFactilizaConsultas, `/tipocambio/info/dia?fecha=${fecha}`),
    obtenerTipoCambioMes: (mes, anio) =>
        getRequest(apiFactilizaConsultas, `/tipocambio/info/mes?anio=${anio}&mes=${mes}`),

    // ? METODO OPCIONAL
    metodoOpcional: async function (tipoDoc, documento) {
        switch (tipoDoc) {
            case "6":
                return this.obtenerEmpresaPorRuc(documento);
            case "1":
                return this.obtenerPersonaPorDni(documento);
            case "placa":
                return this.obtenerVehiculoPorPlaca(documento);
            case "4":
                return this.obtenerExtranjeroPorCee(documento);
            case "licencia":
                return this.obtenerLicenciaPorDni(documento);
            case "fecha":
                return this.obtenerTipoCambioDia(documento);
            case "mes":
                const [mes, anio] = documento.split(",");
                return this.obtenerTipoCambioMes(mes.trim(), anio.trim());
            default:
                return null;
        }
    },
};


export default factilizaService