import generarPDFAndamioTrabajo from "./plantillas/andamio_trabajo/generarPDF";
import generarPDFPuntales from "./plantillas/puntales/generarPDF";
import generarPDFEscaleraAndamioFachada from "./plantillas/escalera_acceso_andamio_fachada/generarPDF";
import generarPDFEscuadras from "./plantillas/escuadras/generarPDF";


export default function generarPDFPorUso({ uso_id, data, doc }) {
  switch (uso_id) {
    case 2:
      return generarPDFAndamioTrabajo(doc, data);
    case 1:
    case 3:
      // Andamio de Fachada y Escalera de acceso comparten plantilla
      return generarPDFEscaleraAndamioFachada(doc, data);
    case 4:
      return generarPDFEscuadras(doc, data);
    case 5:
      return generarPDFPuntales(doc, data);
    default:
      throw new Error("Uso no reconocido o sin plantilla definida");
  }
}