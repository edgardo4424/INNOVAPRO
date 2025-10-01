import apiFactilizaConsultas from "@/shared/services/factilizaConsultas";
import apiFactilizaConsultasDocumentos from "@/shared/services/factilizaConsultasDocumentos";
import apiFactilizaFacturacion from "@/shared/services/factilizaFacturacion";

const getRequest = async (api, endpoint) => {
    const res = await api.get(endpoint);
    return res.data;
};

// Intenta extraer el nombre de archivo si el backend lo envía en Content-Disposition
const getFilenameFromHeaders = (headers = {}) => {
    const cd = headers["content-disposition"] || headers["Content-Disposition"];
    if (!cd) return null;
    // filename*=UTF-8''...  o  filename="..."
    const m =
        /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(cd) ||
        /filename="?([^"']+)"?/i.exec(cd);
    return m ? decodeURIComponent(m[1]) : null;
};


const factilizaService = {


    // !!! FACTURACION

    enviarFactura: async (factura) => {
        const res = await apiFactilizaFacturacion.post("/invoice/send", factura);
        return res.data;
    },

    // !!! NOTA DE CREDITO o DEBITO
    enviarNota: async (nota) => {
        const res = await apiFactilizaFacturacion.post("/note/send", nota);
        return res.data;
    },


    // !!! Guia de Remision

    // ?? CONSULTA DE DOCUMENTOS FACTILIZA
    enviarGuia: async (guia) => {
        const res = await apiFactilizaFacturacion.post("/despatch/send", guia);
        return res.data;
    },


    // ?? ============ CONSULTAS DOCUMENTOS ============
    consultarDocumentoJson: async (documento) => {
        const res = await apiFactilizaConsultasDocumentos.post(
            `/documento-cabecera/documento-detallado`,
            documento
        );
        return res.data;
    },

    // XML: puede venir como texto (<?xml...) o como base64/zip. Devuelve tal cual.
    consultarXml: async (documento) => {
        // forzamos texto para evitar que Axios intente parsear JSON
        const res = await apiFactilizaConsultasDocumentos.post(
            `/invoice/xml`,
            documento,
            { responseType: "text", transformResponse: [(d) => d] }
        );
        return res.data; // string (XML) o string base64, según tu API
    },

    // CDR: puede venir como texto (<?cdr...) o como base64/zip. Devuelve tal cual.
    consultarCdr: async (documento) => {
        const res = await apiFactilizaConsultasDocumentos.post(
            `/invoice/cdr`,
            documento,
            {
                responseType: "arraybuffer", // 👈 clave
            }
        );
        return res;
    },


    // PDF: tu API devuelve binario -> pedimos blob y exponemos headers útiles
    consultarPdf: async (documento) => {
        const res = await apiFactilizaConsultasDocumentos.post(
            `/invoice/pdf`,
            documento,
            { responseType: "blob", validateStatus: () => true }
        );
        return {
            status: res.status,
            blob: res.data, // Blob del PDF
            headers: res.headers,
            filename:
                getFilenameFromHeaders(res.headers) ||
                // fallback por si quieres usarlo
                `${documento.empresa_ruc}-${documento.tipo_Doc}-${documento.serie}-${documento.correlativo}-PDF.pdf`,
            contentType: res.headers?.["content-type"] || "application/pdf",
        };
    },

    // !! ANULACION FACTURA - BOLETA
    anularDocumento: async (url, doc) => {
        const res = await apiFactilizaFacturacion.post(
            `/${url}/cancel`,
            doc
        );
        return res.data;
    },

    // ?? TIPO DE CAMBIO
    obtenerTipoCambio: (fecha) => getRequest(apiFactilizaConsultas, `/tipocambio/info/dia?fecha=${fecha}`),

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