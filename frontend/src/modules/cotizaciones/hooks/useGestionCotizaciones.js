import { jsPDF } from "jspdf";
import fondo from "../assets/PlantillaIMG.png"; // asegúrate de importar correctamente

export function useGestionCotizaciones() {
  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const img = new Image();
    img.src = fondo;

    img.onload = () => {
      doc.addImage(img, 'PNG', 0, 0, 210, 297); // imagen de fondo, A4 = 210x297 mm
      doc.text("Hola mundo", 20, 40); // tu contenido encima
      doc.save("Cotizacion.pdf");
    };
  };

  return {
    downloadPDF
  };
}
