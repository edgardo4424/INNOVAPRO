import TablaCotizacion from "../components/TablaCotizacion";
import { useGestionCotizaciones } from "../hooks/useGestionCotizaciones";
import { useState } from "react";
import PrevisualizadorPDF from "../components/PrevisualizadorPDF";

export default function GestionCotizaciones() {
   const {
    cotizacionesPaginados,
      downloadPDF,
    } = useGestionCotizaciones();

    const [cotizacionSeleccionadaId, setCotizacionSeleccionadaId] = useState(null);
  
  return (
    <div className="dashboard-main">
      <h2>Gestión de Cotizaciones</h2>

      <TablaCotizacion 
      cotizaciones={cotizacionesPaginados}
      onDownloadPDF={downloadPDF} 
      setCotizacionPrevisualizada={setCotizacionSeleccionadaId}
      />

      {cotizacionSeleccionadaId && <PrevisualizadorPDF cotizacionId={cotizacionSeleccionadaId} />}
    </div>
  );
}