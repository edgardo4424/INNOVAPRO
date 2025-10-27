// Pasos del Wizard
import PasoOrigenCotizacion from "../components/pasos/PasoOrigenCotizacion.jsx";
import PasoCondicionesLegales from "../components/pasos/PasoCondicionesLegales.jsx";
import PasoValorizacion from "../components/pasos/PasoValorizacion.jsx";
import PasoFirmas from "../components/pasos/PasoFirmas.jsx";
import PasoRevisionEnvio from "../components/pasos/PasoRevisionEnvio.jsx";
// Componente que renderiza el éxito del proceso
import ExitoContrato from "../components/ExitoContrato.jsx";
// Layout del Wizard de contratos
import WizardLayoutContrato from "../components/WizardLayoutContrato.jsx";
// Hooks
import { useWizardContratoContext } from "../context/WizardContratoContext.jsx";
import { useRegistrarContrato } from "../hooks/useRegistrarContrato.js";
// librería para alertas bien bonitas xd
import { toast } from "react-toastify";
// constante de pasos para el flujo del wizard
const pasos_contrato = [
  { id: 1, titulo: "Origen (Cotización)", componente: PasoOrigenCotizacion },
  { id: 2, titulo: "Condiciones Legales", componente: PasoCondicionesLegales },
  { id: 3, titulo: "Valorización", componente: PasoValorizacion },
  { id: 4, titulo: "Firmas", componente: PasoFirmas },
  { id: 5, titulo: "Revisión y Envío", componente: PasoRevisionEnvio },
];

export default function RegistrarContratoWizard() {
  const { formData, validarPaso, setErrores } = useWizardContratoContext();
  
  const {
    pasoActual,
    setPasoActual,
    avanzarPaso,
    retrocederPaso,
    guardarContrato,
    guardando,
    exito,
  } = useRegistrarContrato(pasos_contrato.length);

  const handleSiguientePaso = () => {
    const errores = validarPaso(pasoActual); 
    setErrores(errores);

    if (Object.keys(errores).length > 0) {
      toast.error(`${Object.values(errores)}`);
      return;
    }

    // Paso 1 requiere cotización base
    if (pasoActual === 1 && !formData?.cotizacion?.id) {
      toast.warning("Debes seleccionar una cotización válida para continuar.");
      return;
    }

    avanzarPaso();
  };

  return (
    <WizardLayoutContrato
      titulo="Generar Contrato"
      subtitulo="Extiende una cotización existente y completa la información legal."
      pasos={pasos_contrato}
      pasoActual={pasoActual}
      onPasoClick={setPasoActual}
      onAtras={retrocederPaso}
      onSiguiente={handleSiguientePaso}
      onGuardar={guardarContrato}
      guardando={guardando}
      exito={exito}
    >
      <ExitoContrato />
    </WizardLayoutContrato>
  );
}