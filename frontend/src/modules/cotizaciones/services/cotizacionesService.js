import api from "@/shared/services/api";

// Obtener todos los usos disponibles
// Ejemplo: Andamio de Trabajo, Puntales, Escalera de Acceso
export async function obtenerUsos(){
  const response = await api.get("/usos");
  return response.data;
}

// Obtener atributos de un uso (ej. Andamio de Trabajo)
export async function obtenerAtributosPorUso(usoId) {
  const response = await api.get(`/atributos/usos/${usoId}`);
  return response.data;
}

// Generar despiece a partir de los atributos ingresados
export async function generarDespiece(atributos, usoId) {
  let uso = "";
  switch (usoId) {
    case 1: // Andamio de fachada
      uso = "andamio-de-fachada";
      break;
    case 2: // Andamio de trabajo
      uso = "andamio-de-trabajo";
      break;
    case 3: // Escalera de acceso
      uso = "escalera-de-acceso";
      break;
    case 4: // Escuadras con plataformas
      uso = "escuadras-con-plataformas";
      break;
    case 5: // Puntales
      uso = "puntales";
      break;
    case 7: // Plataforma de descarga
      uso = "plataforma-de-descarga";
      break;
    case 11: // Escuadras sin plataformas
      uso = "escuadras-sin-plataformas";
      break;
  }
  const response = await api.post(`/despieces/${uso}`, 
    atributos,
  );
  return response.data.despieceGenerado;
}

// Crear una cotización completa
export async function crearCotizacion({
  uso_id,
  zonas,
  cotizacion,
  despiece,
}) {
 
  const response = await api.post("/cotizaciones", {
    uso_id,
    zonas,
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
export async function calcularCostoTransporte(data) {
  const response = await api.post("/cotizaciones_transporte/costo-transporte", data);
  return response.data;
}

// Cargar datos de una cotización desde "DESPIECE DE OT"
export async function obtenerCotizacionPorId(id) {
  const response = await api.get(`/cotizaciones/${id}`);
  return response.data;
}

// Crear una cotización con datos desde "DESPIECE DE OT"
export async function crearCotizacionDesdeOT(data) {
  try {
    const response = await api.post("/cotizaciones/ot", data);
    return response.data;
  } catch (error) {
    console.error(" Error al crear cotización desde OT: ", error);
    throw error.response?.data || error;
  }
}

// Solicitar condiciones de alquiler al área de administración
export async function solicitarCondiciones(idCotizacion, comentario="") {
  const res = await api.put(`/cotizaciones/${idCotizacion}/solicitar-condiciones`, {
    comentario,
  })
  return res.data;
}