import api from "@/shared/services/api";

// Obtener atributos de un uso (ej. Andamio de Trabajo)
export async function obtenerAtributosPorUso(usoId) {
  const response = await api.get(`/atributos/usos/${usoId}`);
  return response.data;
}

// Generar despiece a partir de los atributos ingresados
export async function generarDespiece(atributos, usoId) {
  let uso = "";
  switch (usoId) {
    case 2: // Andamio de trabajo
      uso = "andamio-de-trabajo";
      break;
    case 5: // Puntales
      uso = "puntales";
      break;
    case 3: // Escalera de acceso
      uso = "escalera-de-acceso";
      break;
  }
  const response = await api.post(`/despieces/${uso}`, {
    atributos_formulario: atributos,
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
    atributos_formulario,
    cotizacion,
    despiece,
  });
  return response.data;
}

// Obtener todas las cotizaciones (o recursos según la entidad)
export async function obtenerTodos() {
  const response = await api.get("/cotizaciones");
  return response.data;
}

//Generar un PDF a partir de una cotización
export async function  obtenerDatosPDF(id) {
  const response = await api.post("/cotizaciones/generar-pdf", {id});
  return response.data;
}

// Calcular el costo de transporte según uso, peso y distrito
export async function calcularCostoTransporte({ uso_id, peso_total_tn, distrito_transporte }) {
  const response = await api.post("/cotizaciones_transporte/costo-transporte", {
    uso_id,
    peso_total_tn,
    distrito_transporte,
  });
  return response.data;
}