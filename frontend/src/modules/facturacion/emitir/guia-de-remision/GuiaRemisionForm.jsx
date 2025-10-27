import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";
import ModalVisualizarGuiaPrivada from "./components/modal/ModalVisualizarGuiaPrivada";
import ChoferPrivadoForm from "./forms/ChoferPrivadoForm";
import DatosDeClienteForm from "./forms/DatosDeClienteForm";
import DatosGuiaEnvioForm from "./forms/DatosGuiaEnvioForm";
import DetalleForm from "./forms/DetalleForm";
import InfDocumentoForm from "./forms/InfDocumentoForm";
import TransportistaPublicoForm from "./forms/TransportistaPublicoForm";

const GuiaRemisionForm = () => {

  return (
    <div
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="mb-6 rounded-3xl border border-gray-400 bg-white p-4 shadow-xl transition-all duration-300"
    >
      {/* Sección de Documento Principal */}
      <InfDocumentoForm />

      {/* Sección de Datos del Cliente */}
      <DatosDeClienteForm />

      {/* Seccion de Datos Guia de Envío */}
      <DatosGuiaEnvioForm />

      {/* //? Seccion de Transportista Publico */}
      <TransportistaPublicoForm />

      {/* Seccion de Chofer Privado */}
      <ChoferPrivadoForm />

      {/* Sección de Detalle de Productos */}
      <DetalleForm />

      {/* Botón de Enviar */}
      <div className="flex justify-end">
        <ModalVisualizarGuiaPrivada />
      </div>
    </div>
  );
};

export default GuiaRemisionForm;
