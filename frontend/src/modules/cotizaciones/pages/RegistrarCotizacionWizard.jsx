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
import { toast } from "react-toastify";
import { USOS_SIN_DESPIECE } from "../constants/usos";

// Este componente es un wizard para registrar una cotización, dividido en varios pasos.
// Cada paso es un componente separado que se renderiza según el estado actual del wizard.
// Utiliza el hook useWizardCotizacion para manejar la lógica de validación y estado del formulario.
// Al finalizar, se envían los datos al backend para crear la cotización y se muestra un mensaje de éxito.
// El wizard incluye pasos para ingresar datos de contacto, uso del equipo, atributos del equipo, confirmación final y revisión y envío.
// También maneja la navegación entre pasos y la validación de datos ingresados en cada paso.
// El componente utiliza animaciones de Framer Motion para transiciones suaves entre pasos y un diseño responsivo.

// Definimos los pasos del wizard, cada uno con su título y componente asociado.
// Los componentes de cada paso se importan desde su respectivo archivo.
const pasos_cotizacion = [
  { id: 1, titulo: "Contacto", componente: PasoContacto },
  { id: 2, titulo: "Uso del Equipo", componente: PasoUso },
  { id: 3, titulo: "Atributos del Equipo", componente: PasoAtributos },
  { id: 4, titulo: "Confirmación Final", componente: PasoConfirmacion },
  { id: 5, titulo: "Revisión y Envío", componente: PasoFinal },
];

export default function RegistrarCotizacionWizard() {
  const { formData, validarPaso, setErrores } = useWizardContext();

  const {
    pasoActual,
    setPasoActual,
    avanzarPaso,
    retrocederPaso,
    guardarCotizacion,
    guardarCotizacionDesdeOT,
    guardando,
    exito,
  } = useRegistrarCotizacion(pasos_cotizacion.length);

  const handleSiguientePaso = () => {
    const erroresValidacion = validarPaso();
    setErrores(erroresValidacion);

    if (Object.keys(erroresValidacion).length > 0) {
      toast.error("Completa los campos obligatorios antes de continuar.");
      return;
    }
        
    // Bloqueamos avance si es un uso sin despiece
    if (
      pasoActual === 2 && // Está en PasoAtributos y quiere pasar a PasoConfirmación
      USOS_SIN_DESPIECE.includes(formData.uso_id)
    ) {
      toast.warning("Este uso no permite generar despiece. Registra una tarea de apoyo técnico.");
      return;
    }
    avanzarPaso();
  }

  // Detectamos si es cotización con despiece de OT
  const cotizacionConDespieceOT = formData.cotizacion.id ? true : false;

  return (
    <WizardLayout
      titulo="Registrar Cotización"
      pasos={pasos_cotizacion}
      pasoActual={pasoActual}
      onPasoClick={setPasoActual}
      onAtras={retrocederPaso}
      onSiguiente={handleSiguientePaso}
      onGuardar={cotizacionConDespieceOT ? guardarCotizacionDesdeOT : guardarCotizacion}
      guardando={guardando}
      exito={exito}
    >
      <ExitoCotizacion />
    </WizardLayout>
  )
}