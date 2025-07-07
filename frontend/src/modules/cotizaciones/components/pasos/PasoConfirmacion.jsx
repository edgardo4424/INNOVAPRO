import { useEffect } from "react";
import { useWizardContext } from "../../context/WizardCotizacionContext";
import { useGenerarDespiece } from "../../hooks/paso-confirmacion/useGenerarDespiece";
import { useCalculoTransporte } from "../../hooks/paso-confirmacion/useCalculoTransporte";
import { USOS_INSTALABLES, USOS_SIN_DESCUENTO} from "../../constants/usos";
import ResumenDespiece from "./paso-confirmacion/ResumenDespiece";
import BloquePernos from "./paso-confirmacion/BloquePernos";
import BloquePuntales from "./paso-confirmacion/BloquePuntales";
import BloqueTransporte from "./paso-confirmacion/BloqueTransporte";
import BloqueInstalacion from "./paso-confirmacion/BloqueInstalacion";
import BloqueDescuento from "./paso-confirmacion/BloqueDescuento";
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
    Array.isArray(formData.despiece) &&
    formData.resumenDespiece !== undefined;


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

      {formData.uso_id === 5 && formData.tipo_cotizacion === "Alquiler" && (
        <BloquePuntales formData={formData} setFormData={setFormData} />
      )}

      <ResumenDespiece
        duracion_alquiler={formData.duracion_alquiler}
        despiece={formData.despiece}
        resumen={formData.resumenDespiece}
        tipo={formData.tipo_cotizacion}
      />

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


      {formData.agregar_mas_piezas && (
        <DespieceAdicional formData={formData} setFormData={setFormData} />
      )}

      <BloquePernos formData={formData} setFormData={setFormData} errores={errores} />
      <BloqueTransporte formData={formData} setFormData={setFormData} errores={errores} />
      {USOS_INSTALABLES.includes(formData.uso_id) && (
        <BloqueInstalacion formData={formData} setFormData={setFormData} errores={errores} />
      )}
      {!USOS_SIN_DESCUENTO.includes(formData.uso_id) && (
        <BloqueDescuento formData={formData} setFormData={setFormData} errores={errores} />
      )}

      {/* Para el caso en que sea cotización de venta de puntales si se puede aplicar descuento */}
      {formData.uso_id === 5 && formData.tipo_cotizacion === "Venta" && (
        <BloqueDescuento formData={formData} setFormData={setFormData} errores={errores} />
      )}
    </div>
  );
}