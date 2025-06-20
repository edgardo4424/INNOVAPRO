import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { obtenerDatosPDF } from "../services/cotizacionesService";
import { toast } from "react-toastify";
import generarPDFPorUso from "../pdf/generadorPDFModular";

// Este componente permite previsualizar un PDF de una cotización específica.
// Utiliza el ID de la cotización para obtener los datos necesarios y generar el PDF.
// La previsualización se muestra en un iframe, y el PDF se genera utilizando jsPDF.

export default function PrevisualizadorPDF({ cotizacionId }) {
  const iframeRef = useRef();
  const [data, setData] = useState(null);

  // Cargar los datos de la cotización al montar el componente
  // y generar el PDF una vez que los datos estén disponibles.

  useEffect(() => {
    if (!cotizacionId) return;

    const cargarDatos = async () => {
      try {
        const cotizacion = await obtenerDatosPDF(cotizacionId);
        setData(cotizacion);
      } catch (error) {
        console.error("❌ Error al cargar los datos de la cotización:", error);
        toast.error("Error al cargar los datos de la cotización");
      }
    };
    cargarDatos();
  }, [cotizacionId]);

  useEffect(() => {
    if (!data) return;

    const generarPDF = async () => {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      try {
        await generarPDFPorUso({ uso_id: data.uso.id, data, doc });
      } catch (err) {
        console.error("❌ Error generando PDF:", err);
        toast.error("Error generando PDF");
        return;
      }

      // Para previsualización
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;
    };
    generarPDF();
  }, [data]);
  

  return (
    <div style={{ border: "1px solid #ccc", marginTop: "2rem" }}>
      <h4 style={{ textAlign: "center" }}>Previsualización del PDF</h4>
      <iframe
        ref={iframeRef}
        width="100%"
        height="800px"
        style={{ border: "none" }}
        title="Vista previa del PDF"
      ></iframe>
    </div>
    
  );
}