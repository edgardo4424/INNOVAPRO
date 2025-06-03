// INNOVA PRO+ v1.2.5
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
import * as cotizacionesService from "../services/cotizacionesService";
import generarPDFPorUso from "../pdf/generadorPDFModular";

export function useGestionCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const cotizacionesPorPagina = 100;

  // 📥 Descargar PDF con nombre personalizado
  const downloadPDF = async (cotizacionId) => {
    try {
      const data = await cotizacionesService.obtenerDatosPDF(cotizacionId);
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      await generarPDFPorUso({ uso_id: data.uso.id, data, doc });

      // 🧠 Construcción del nombre del archivo
      const codigo = data.cotizacion?.codigo_documento || "COTIZACION";
      const razon = data.cliente?.razon_social?.replace(/[^\w\s-]/gi, "").replace(/\s+/g, " ") || "CLIENTE";
      const obra = data.obra?.nombre?.replace(/[^\w\s-]/gi, "").replace(/\s+/g, " ") || "OBRA";
      const uso = data.uso?.nombre?.replace(/[^\w\s-]/gi, "").replace(/\s+/g, " ") || "USO";
      const tipo = data.cotizacion?.tipo_servicio?.toUpperCase() || "TIPO";

      const nombreArchivo = `${codigo}-${razon}-${obra}-${uso}-${tipo}.pdf`;

      // 📤 Guardar archivo directamente
      doc.save(nombreArchivo);
    } catch (error) {
      console.error("❌ Error al descargar PDF:", error);
      toast.error("Error al generar el PDF");
    }
  };

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
    downloadPDF,
  };
}