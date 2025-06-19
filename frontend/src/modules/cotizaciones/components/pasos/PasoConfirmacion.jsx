import { useEffect } from "react";
import { useWizardContext } from "../../context/WizardCotizacionContext";
import { useGenerarDespiece } from "../../hooks/useGenerarDespiece";
import { useCalculoTransporte } from "../../hooks/useCalculoTransporte";
import ResumenDespiece from "../ResumenDespiece";
import BloquePernos from "../BloquePernos";
import BloqueTransporte from "../BloqueTransporte";
import BloqueInstalacion from "../BloqueInstalacion";
import BloqueDescuento from "../BloqueDescuento";
import DespieceAdicional from "../DespieceAdicional"
import Loader from "../../../../shared/components/Loader";


export default function PasoConfirmacion() {
  const { formData, setFormData, errores } = useWizardContext();

  useGenerarDespiece(formData, setFormData); // Hook personalizado para generar el despiece
  useCalculoTransporte(formData, setFormData); // Hook personalizado para calcular el transporte
  
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

      <ResumenDespiece
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
      <BloqueInstalacion formData={formData} setFormData={setFormData} errores={errores} />
      <BloqueDescuento formData={formData} setFormData={setFormData} errores={errores} />
    </div>
  );
}