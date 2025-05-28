import generarPDFAndamioTrabajo from "./plantillas/andamio_trabajo/generarPDF";
//import generarPDFEscuadras from "./plantillas/generarPDFEscuadras";
//import generarPDFServicios from "./plantillas/generarPDFServicios";


export default function generarPDFPorUso({ uso_id, data, doc }) {
    uso_id = 1 // Forzar uso_id a 1 para pruebas, eliminar en producción
  switch (uso_id) {
    case 1:
      return generarPDFAndamioTrabajo(doc, data);
    case 2:
      return generarPDFEscuadras(doc, data);
    case 3:
      return generarPDFServicios(doc, data);
    // ...otros usos
    default:
      throw new Error("Uso no reconocido o sin plantilla definida");
  }
}