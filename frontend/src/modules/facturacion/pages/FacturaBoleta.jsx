import { useLocation } from "react-router-dom";
import FacturaBoletaForm from "../emitir/factura-boleta/FacturaBoletaForm";
import { useEffect } from "react";
import { useFacturaBoleta } from "../context/FacturaBoletaContext";
import { ValorInicialFactura } from "../emitir/factura-boleta/utils/valoresInicial";

const FacturaBoleta = () => {
  const {
    factura,
    setFactura,
    setIdBorrador,
    setRetencionActivado,
    setDetraccion,
    setRetencion,
    setDetallesExtra,
  } = useFacturaBoleta();
  const location = useLocation();
  const documento = location.state || {};

  useEffect(() => {
    const PlasmarBorrador = async () => {
      if (documento.length > 0) {
        let {
          valores_Detraccion,
          valores_Retencion,
          retencion_activada,
          valores_Detalles_Extra,
          ...facturaObtenida
        } = documento[0];
        setFactura(facturaObtenida);
        setIdBorrador(documento[1].borr_id_delete);
        setDetraccion(valores_Detraccion);
        setRetencion(valores_Retencion);
        setRetencionActivado(retencion_activada);
        setDetallesExtra(valores_Detalles_Extra);
      } else {
        setFactura({
          tipo_Operacion: "0101",
          tipo_Doc: "01",
          serie: "F001",
          ...ValorInicialFactura,
        });
      }
    };
    PlasmarBorrador();
  }, []);

  return (
    <div className="flex w-full flex-col items-center bg-gray-100 py-6 md:px-8">
      <div className="w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold  md:text-3xl">
            Generar Factura / Boleta
          </h2>
        </div>
        <FacturaBoletaForm />
      </div>
    </div>
  );
};

export default FacturaBoleta;
