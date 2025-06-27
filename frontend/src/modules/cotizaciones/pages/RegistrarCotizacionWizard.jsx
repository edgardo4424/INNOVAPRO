import PasoContacto from "../components/pasos/PasoContacto.jsx";
import PasoUso from "../components/pasos/PasoUso.jsx";
import PasoAtributos from "../components/pasos/PasoAtributos";
import PasoConfirmacion from "../components/pasos/PasoConfirmacion";
import PasoFinal from "../components/pasos/PasoFinal.jsx";
import ExitoCotizacion from "../components/ExitoCotizacion";
import WizardLayout from "../components/WizardLayout.jsx";
import { useRegistrarCotizacion } from "../hooks/useRegistrarCotizacion.js";
import { useWizardContext } from "../context/WizardCotizacionContext";
import "../styles/wizard.css";
import "../styles/exito.css";

// Este componente es un wizard para registrar una cotización, dividido en varios pasos.
// Cada paso es un componente separado que se renderiza según el estado actual del wizard.
// Utiliza el hook useWizardCotizacion para manejar la lógica de validación y estado del formulario.
// Al finalizar, se envían los datos al backend para crear la cotización y se muestra un mensaje de éxito.
// El wizard incluye pasos para ingresar datos de contacto, uso del equipo, atributos del equipo, confirmación final y revisión y envío.
// También maneja la navegación entre pasos y la validación de datos ingresados en cada paso.
// El componente utiliza animaciones de Framer Motion para transiciones suaves entre pasos y un diseño responsivo.

// Definimos los pasos del wizard, cada uno con su título y componente asociado.
// Los componentes de cada paso se importan desde su respectivo archivo.
const pasos = [
  { id: 1, titulo: "Contacto", componente: PasoContacto },
  { id: 2, titulo: "Uso del Equipo", componente: PasoUso },
  { id: 3, titulo: "Atributos del Equipo", componente: PasoAtributos },
  { id: 4, titulo: "Confirmación Final", componente: PasoConfirmacion },
  { id: 5, titulo: "Revisión y Envío", componente: PasoFinal },
];

export default function RegistrarCotizacionWizard() {
  const { formData } = useWizardContext();

  const {
    pasoActual,
    setPasoActual,
    avanzarPaso,
    retrocederPaso,
    guardarCotizacion,
    guardarCotizacionDesdeOT,
    guardando,
    exito,
  } = useRegistrarCotizacion(pasos.length);

  // Detectamos si es cotización con despiece de OT
  const cotizacionConDespieceOT = formData.id ? true : false;
  console.log("validacion para guardar por OT", cotizacionConDespieceOT)
  console.log("Id de la cotizacion:", formData.id)

  return (
    <WizardLayout
      titulo="Registrar Cotización"
      pasos={pasos}
      pasoActual={pasoActual}
      onPasoClick={setPasoActual}
      onAtras={retrocederPaso}
      onSiguiente={avanzarPaso}
      onGuardar={cotizacionConDespieceOT ? guardarCotizacionDesdeOT : guardarCotizacion}
      guardando={guardando}
      exito={exito}
    >
      <ExitoCotizacion />
    </WizardLayout>
  )
}