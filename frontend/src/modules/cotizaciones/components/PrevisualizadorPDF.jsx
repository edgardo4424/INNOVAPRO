import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import fondo from "../assets/PlantillaIMG.png";
import cuenta from "../assets/cuentas_IR.png";
import { obtenerDatosPDF } from "../services/cotizacionesService";
import generarPDFPorUso from "../pdf/generadorPDFModular";

export default function PrevisualizadorPDF({ cotizacionId }) {
  const iframeRef = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!cotizacionId) return;

    const cargarDatos = async () => {
      try {
        const cotizacion = await obtenerDatosPDF(cotizacionId);
        setData(cotizacion);
      } catch (error) {
        console.error("❌ Error al cargar los datos de la cotización:", error);
      }
    };
    cargarDatos();
  }, [cotizacionId]);

  useEffect(() => {
    if (!data) return;

    const generarPDF = async () => {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      try {
        await generarPDFPorUso({ uso_id: data.uso.id, data, doc }); // 👈 Modular
      } catch (err) {
        console.error("❌ Error generando PDF:", err);
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