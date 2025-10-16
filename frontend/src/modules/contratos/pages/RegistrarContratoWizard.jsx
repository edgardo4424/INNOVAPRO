import PasoOrigenCotizacion from "../components/pasos/PasoOrigenCotizacion.jsx";
import PasoCondicionesLegales from "../components/pasos/PasoCondicionesLegales.jsx";
import PasoValorizacion from "../components/pasos/PasoValorizacion.jsx";
import PasoFirmas from "../components/pasos/PasoFirmas.jsx";
import PasoRevisionEnvio from "../components/pasos/PasoRevisionEnvio.jsx";

import ExitoContrato from "../components/ExitoContrato.jsx";
import WizardLayoutContrato from "../components/WizardLayoutContrato.jsx";

import { useWizardContratoContext } from "../context/WizardContratoContext.jsx";
import { useRegistrarContrato } from "../hooks/useRegistrarContrato.js";
import { toast } from "react-toastify";

const pasos_contrato = [
  { id: 1, titulo: "Origen (Cotización)", componente: PasoOrigenCotizacion },
  { id: 2, titulo: "Condiciones Legales", componente: PasoCondicionesLegales },
  { id: 3, titulo: "Valorización", componente: PasoValorizacion },
  { id: 4, titulo: "Firmas", componente: PasoFirmas },
  { id: 5, titulo: "Revisión y Envío", componente: PasoRevisionEnvio },
];

export default function RegistrarContratoWizard() {
  const { formData, validarPaso, setErrores } = useWizardContratoContext();
  console.log("FORM DATA EN REGISTRAR: ", formData)
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