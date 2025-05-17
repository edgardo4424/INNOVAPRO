import api from "@/shared/services/api";

// Obtener atributos de un uso (ej. Andamio de Trabajo)
export async function obtenerAtributosPorUso(usoId = 2) {
  const response = await api.get(`/atributos/usos/${usoId}`);
  return response.data;
}

// Generar despiece a partir de los atributos ingresados
export async function generarDespiece(atributos) {
  const response = await api.post("/despieces/andamio-de-trabajo", {
    atributos_formulario: [atributos],
  });
  return response.data.despieceGenerado;
}

// Crear una cotización completa
export async function crearCotizacion({
  uso_id,
  atributos_formulario,
  cotizacion,
  despiece,
}) {
  const response = await api.post("/cotizaciones", {
    uso_id,
    atributos_formulario: [atributos_formulario],
    cotizacion,
    despiece,
  });
  return response.data;
}