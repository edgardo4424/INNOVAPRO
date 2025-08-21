import axios from "axios";

const apiFactilizaConsultasDocumentos = axios.create({
    baseURL: import.meta.env.VITE_API_URL_CONSULTAS_DOCUMENTOS_FACTALIZA,
    timeout: 180000,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_TOKEN_CONSULTA_DOCUMENTOS_FACTILIZA}`,
    }
});

export default apiFactilizaConsultasDocumentos