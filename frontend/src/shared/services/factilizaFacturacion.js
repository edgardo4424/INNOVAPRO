import axios from "axios";

const apiFactilizaFacturacion = axios.create({
    baseURL: import.meta.env.VITE_API_URL_FACTURACION,
    timeout: 2400000,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_TOKEN_FACTURACION}`,
    }
});

export default apiFactilizaFacturacion


