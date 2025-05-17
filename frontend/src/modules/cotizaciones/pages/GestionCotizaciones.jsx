import TablaCotizacion from "../components/TablaCotizacion";
import { useGestionCotizaciones } from "../hooks/useGestionCotizaciones";

export default function GestionCotizaciones() {
   const {
    cotizacionesPaginados,
      downloadPDF,
    } = useGestionCotizaciones();
  

  return (
    <div className="dashboard-main">
      <h2>Gestión de Cotizaciones</h2>

      <TablaCotizacion 
      cotizaciones={cotizacionesPaginados}
        onDownloadPDF={downloadPDF} />
    </div>
  );
}
