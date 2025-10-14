import axios from "axios";

const apiFactilizaConsultas = axios.create({
    baseURL: import.meta.env.VITE_API_URL_CONSULTAS_FACTALIZA,
    timeout: 180000,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_TOKEN_CONSULTAS_FACTILIZA}`,
    }
});

export default apiFactilizaConsultas