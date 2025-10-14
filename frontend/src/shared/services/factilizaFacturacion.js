import axios from "axios";

const apiFactilizaFacturacion = axios.create({
    baseURL: import.meta.env.VITE_API_URL_FACTURACION_FACTILIZA,
    timeout: 180000,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_TOKEN_FACTURACION}`,
    }
});

export default apiFactilizaFacturacion