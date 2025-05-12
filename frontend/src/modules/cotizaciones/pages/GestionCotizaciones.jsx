import TablaCotizacion from "../components/TablaCotizacion";
import { useGestionCotizaciones } from "../hooks/useGestionCotizaciones";

export default function GestionCotizaciones() {
   const {
      downloadPDF,
    } = useGestionCotizaciones();
  

  return (
    <div className="dashboard-main">
      <h2>Gestión de Cotizaciones</h2>

      <TablaCotizacion onDownloadPDF={downloadPDF} />
    </div>
  );
}
