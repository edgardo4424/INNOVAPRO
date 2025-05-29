import generarPDFAndamioTrabajo from "./plantillas/andamio_trabajo/generarPDF";
import generarPDFPuntales from "./plantillas/puntales/generarPDF";
//import generarPDFEscuadras from "./plantillas/generarPDFEscuadras";
//import generarPDFServicios from "./plantillas/generarPDFServicios";


export default function generarPDFPorUso({ uso_id, data, doc }) {
    //uso_id = 1 // Forzar uso_id a 1 para pruebas, eliminar en producción
  switch (uso_id) {
    case 2:
      return generarPDFAndamioTrabajo(doc, data);
    case 3:
      return generarPDFEscuadras(doc, data);
    case 7:
      return generarPDFServicios(doc, data);
    case 5:
      return generarPDFPuntales(doc, data);
    default:
      throw new Error("Uso no reconocido o sin plantilla definida");
  }
}