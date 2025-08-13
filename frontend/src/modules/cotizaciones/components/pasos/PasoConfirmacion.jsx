import { useEffect } from "react";
import { useWizardContext } from "../../context/WizardCotizacionContext";
import { useGenerarDespiece } from "../../hooks/paso-confirmacion/useGenerarDespiece";
import { useCalculoTransporte } from "../../hooks/paso-confirmacion/useCalculoTransporte";
import { USOS_INSTALABLES, USOS_SIN_DESCUENTO} from "../../constants/usos";
import ResumenDespiece from "./paso-confirmacion/ResumenDespiece";
import BloquePernos from "./paso-confirmacion/BloquePernos";
import BloquePuntales from "./paso-confirmacion/BloquePuntales";
import BloquePlataformaDescarga from "./paso-confirmacion/BloquePlataformaDescarga";
import BloqueEscuadras from "./paso-confirmacion/BloqueEscuadras";
import BloqueTransporte from "./paso-confirmacion/BloqueTransporte";
import BloqueInstalacion from "./paso-confirmacion/BloqueInstalacion";
import BloqueDescuento from "./paso-confirmacion/BloqueDescuento";
import BloqueEscaleraAcceso from "./paso-confirmacion/BloqueEscaleraAcceso";
import BloqueEscaleraAccesoOT from "./paso-confirmacion/BloqueEscaleraAccesoOT";
import BloqueColgantes from "./paso-confirmacion/BloqueColgantes";
import DespieceAdicional from "./paso-confirmacion/DespieceAdicional"
import Loader from "../../../../shared/components/Loader";

// Este componente representa el quinto paso del Wizard. Muestra el resumen del despiece generado automáticamente.
// Le permite al comercial confirmar las piezas calculadas, agregar piezas adicionales, incluir o excluir pernos,
// configurar transporte, instalación y descuentos.
// Utiliza la lógica separada en hooks para generar el despiece y realizar el cálculo del transporte automático.
// Desacoplado los componentes que se van a renderizar de manera condicional con sus lógicas separadas.

export default function PasoConfirmacion() {
  const { formData, setFormData, errores } = useWizardContext();

  useGenerarDespiece(formData, setFormData); // Hook personalizado para generar el despiece
  useCalculoTransporte(formData, setFormData); // Hook personalizado para calcular el transporte

  // Validación básica para determinar si todos los datos mínimos están listos 
  const datosListos =
    formData.uso_id &&
    formData.zonas?.length &&
    (
      (Array.isArray(formData.despiece) && formData.despiece.length > 0) ||
      formData.uso_id === 8 // Si es caso andamios colgantes, no requiere despiece
    ) &&
    (
      formData.uso_id === 8 || formData.resumenDespiece !== undefined // Si no es andamio colgante, debe tener un resumen de despiece
    )

  // Si el comercial desactiva los pernos, se eliminan del despiece

  useEffect(() => {
    if (!formData.despiece?.length) return;
    const despieceActualizado = formData.despiece.map(pieza => 
      pieza.esPerno 
      ? { ...pieza, incluido: formData.tiene_pernos } 
      : pieza
    );
    setFormData(prev => ({ ...prev, despiece: despieceActualizado }));
  }, [formData.tiene_pernos]);

  if (!datosListos) return <Loader texto="Generando despiece..." />

  return (
    <div className="paso-formulario">
      <h3>Paso 5: Confirmación Final</h3>

      {/* Si es andamio colgante renderizamos el siguiente bloque*/}
      {formData.uso_id === 8 && (
        <BloqueColgantes formData={formData} setFormData={setFormData} />
      )}

      {/* La lógica del renderizado de este bloque se encuentra dentro del mismo */}
      <BloquePuntales formData={formData} setFormData={setFormData} />

      {formData.uso_id === 7 && ( // Si es caso plataforma de descarga mostrar este bloque
        <BloquePlataformaDescarga formData={formData} setFormData={setFormData} />
      )}

      {(formData.uso_id === 4 || formData.uso_id === 11) && ( // Si es caso escuadras mostrar este bloque
        <BloqueEscuadras formData={formData} setFormData={setFormData} />
      )}

      {/* 
        Si es escalera de acceso en alquiler generado por el comercial con CP0,
        renderizamos este bloque
      */}
      {formData.uso_id === 3 && formData.tipo_cotizacion === "Alquiler" && !formData.id && (
        <BloqueEscaleraAcceso formData={formData} setFormData={setFormData} />
      )}

      {/* Siempre mostraremos el resumen del despiece con sus condiciones dentro del mismo bloque */}
      {formData.uso_id !== 8 && ( // Si no es andamio colgante, que es el unico uso que no requiere despiece
        <ResumenDespiece formData={formData} />
      )}

      {/* Si es escalera de acceso generado por Despiece de Oficina Técnica */}
      {formData.uso_id === 3 && formData.id && (
        <BloqueEscaleraAccesoOT formData={formData} setFormData={setFormData} />
      )}

      {/* Sección para determinar si se añadirán piezas adicionales al despiece */}
      <div className="wizard-section">
        <label>¿Desea agregar más piezas al despiece?</label>
        <select
          value={formData.agregar_mas_piezas ?? ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              agregar_mas_piezas: e.target.value === "true",
            }))
          }
        >
          <option value="">Seleccione una opción</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
        {errores.agregar_mas_piezas && (
          <p className="error-text">{errores.agregar_mas_piezas}</p>
        )}
      </div>

      {/* En caso la sección previa sea afirmativa, mostramos este bloque */}
      {formData.agregar_mas_piezas && (
        <DespieceAdicional formData={formData} setFormData={setFormData} />
      )}

      {/* Siempre que exista pernos en el despiece renderiza el BloquePernos. */}
      <BloquePernos formData={formData} setFormData={setFormData} errores={errores} />

      {/* Consultaremos mediante el BloqueTransporte si se desea incluir o no. */}
      {formData.uso_id !== 8 && ( // Si no es andamio colgante, que es el unico uso que no requiere esta pregunta
        <BloqueTransporte formData={formData} setFormData={setFormData} errores={errores} />
      )}
      
      {/* Solo para los usos que sean instalables renderizamos el BloqueInstalacion */}
      {USOS_INSTALABLES.includes(formData.uso_id) && (
        <BloqueInstalacion formData={formData} setFormData={setFormData} errores={errores} />
      )}

      {/* Solo para los usos que dependan exclusivamente del despiece se permitirá hacer descuento en % */}
      {!USOS_SIN_DESCUENTO.includes(formData.uso_id) && (
        <BloqueDescuento formData={formData} setFormData={setFormData} errores={errores} />
      )}

      {/*En caso de que la cotización sea Escalera de Acceso en Venta para que apliquen descuento*/}
      {formData.uso_id === 3 && formData.tipo_cotizacion === "Venta" && (
        <BloqueDescuento formData={formData} setFormData={setFormData} errores={errores} />
      )}
      {console.log("FormData en Paso Confirmación viniendo de OT: ", formData)}

    </div>
  );
}