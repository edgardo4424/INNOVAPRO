import generarPDFAndamioTrabajo from "./plantillas/andamio_trabajo/generarPDF";
import generarPDFPuntales from "./plantillas/puntales/generarPDF";
import generarPDFEscalera from "./plantillas/escalera_acceso_andamio_fachada/generarPDF";
import generarPDFEscuadras from "./plantillas/escuadras/generarPDF";


export default function generarPDFPorUso({ uso_id, data, doc }) {
  switch (uso_id) {
    case 2:
      return generarPDFAndamioTrabajo(doc, data);
    case 3:
    case 1:
      // Caso 1 y 3 comparten la misma plantilla de escalera de acceso / andamio fachada
      return generarPDFEscalera(doc, data);
    case 4:
      return generarPDFEscuadras(doc, data);
    case 5:
      return generarPDFPuntales(doc, data);
    default:
      throw new Error("Uso no reconocido o sin plantilla definida");
  }
}