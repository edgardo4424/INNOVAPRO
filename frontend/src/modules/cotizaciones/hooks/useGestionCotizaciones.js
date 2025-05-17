import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import fondo from "../assets/PlantillaIMG.png"; // asegúrate de importar correctamente
import * as cotizacionesService from "../services/cotizacionesService";

export function useGestionCotizaciones() {
  const downloadPDF = (cotizacion) => {
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


  const [cotizaciones, setCotizaciones] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const cotizacionesPorPagina = 5;

   // 🔄 Cargar cotizaciones al iniciar
   useEffect(() => {
    async function fetchCotizaciones() {
      try {
        const res = await cotizacionesService.obtenerTodos();
        setCotizaciones(res || []);
      } catch (error) {
        console.error("❌ Error al obtener cotizaciones:", error);
        toast.error("Error al cargar cotizaciones");
      }
    }
    fetchCotizaciones();
  }, []);


  const cotizacionesPaginados = cotizaciones.slice(
    (paginaActual - 1) * cotizacionesPorPagina,
    paginaActual * cotizacionesPorPagina
  );

  return {
    cotizacionesPaginados,
    downloadPDF
  };
}
