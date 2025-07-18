import api from "@/shared/services/api";

// Función para buscar datos de una empresa por su RUC en la SUNAT
// Esta función realiza una solicitud GET a la API para obtener información de la empresa asociada al RUC proporcionado.

export const buscarDatosPorRUC = async (ruc) => {
    try {
        const res = await api.get(`/sunat/buscar-ruc/${ruc}`);
        return res.data;
    } catch (error) {
        console.error("❌ Error buscando RUC en SUNAT:", error);
        return null;
    }
};