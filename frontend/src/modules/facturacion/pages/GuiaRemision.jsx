import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGuiaTransporte } from "../context/GuiaTransporteContext";
import GuiaRemisionForm from "../emitir/guia-de-remision/GuiaRemisionForm";
import { guiaInical } from "../emitir/guia-de-remision/utils/valoresIncialGuia";

const GuiaRemision = () => {
  const {
    setGuiaTransporte,
    setTipoGuia,
    setGuiaDatosPrivado,
    setGuiaDatosPublico,
    setPedidoId,
    setPesoPlasmadoKilos,
    setEditadoPlasmado,
  } = useGuiaTransporte();

  const location = useLocation();
  const documento = location.state || {};

  const plasmarRuc = (ruc) => {
    setTimeout(() => {
      setGuiaTransporte((prev) => ({
        ...prev,
        empresa_Ruc: ruc,
      }));
    }, 500);
  };
  const plasmarPeso = (peso) => {
    setEditadoPlasmado(true);
    setTimeout(() => {
      setPesoPlasmadoKilos(peso);
    }, 500);
  };

  useEffect(() => {
    const plasmarPedido = () => {
      if (documento.length > 0) {
        const {
          guia,
          codigo_traslado,
          tipoGuia,
          ruc_filial,
          peso_total_kilo,
          pedido_id,
        } = documento[0];

        // ✅ UNA sola actualización completa y controlada
        setGuiaTransporte((prev) => ({
          ...prev,
          ...guia,
          empresa_Ruc:
            guia?.empresa_Ruc ?? documento[0]?.guia?.empresa_Ruc ?? "",
        }));

        setGuiaDatosPrivado((prev) => ({
          ...prev,
          guia_Envio_Cod_Traslado:
            codigo_traslado?.guia_Envio_Cod_Traslado ?? "",
          guia_Envio_Des_Traslado:
            codigo_traslado?.guia_Envio_Des_Traslado ?? "",
        }));

        setGuiaDatosPublico((prev) => ({
          ...prev,
          guia_Envio_Cod_Traslado:
            codigo_traslado?.guia_Envio_Cod_Traslado ?? "",
          guia_Envio_Des_Traslado:
            codigo_traslado?.guia_Envio_Des_Traslado ?? "",
        }));

        setTipoGuia(tipoGuia);
        setPedidoId(pedido_id);
        plasmarRuc(ruc_filial ?? "");
        plasmarPeso(peso_total_kilo);
      }
    };
    plasmarPedido();
  }, [documento]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-100 py-6 md:px-8">
      <div className="w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-600 md:text-3xl">
            Guia de Remision
          </h2>
        </div>
        <GuiaRemisionForm />
      </div>
    </div>
  );
};

export default GuiaRemision;
