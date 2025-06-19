import { useEffect } from "react";
import { useWizardContext } from "../../hooks/useWizardCotizacion";
import { useGenerarDespiece } from "../../hooks/useGenerarDespiece";
import { useCalculoTransporte } from "../../hooks/useCalculoTransporte";
import ResumenDespiece from "../ResumenDespiece";
import BloquePernos from "../BloquePernos";
import BloqueTransporte from "../BloqueTransporte";
import BloqueInstalacion from "../BloqueInstalacion";
import BloqueDescuento from "../BloqueDescuento";
import Loader from "../../../../shared/components/Loader";

export default function PasoConfirmacion() {
  const { formData, setFormData, errores } = useWizardContext(); 

  useGenerarDespiece(formData, setFormData); // Hook personalizado para generar el despiece
  useCalculoTransporte(formData, setFormData); // Hook personalizado para calcular el transporte
  
  const datosListos =
    formData.uso_id &&
    formData.zonas?.length &&
    formData.despiece.length &&
    formData.resumenDespiece;

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

  if (!datosListos) return <Loader texto="Generando despiece..." />;

  return (
    <div className="paso-formulario">
      <h3>Paso 5: Confirmación Final</h3>

      <ResumenDespiece
        despiece={formData.despiece}
        resumen={formData.resumenDespiece}
        tipo={formData.tipo_cotizacion}
      />

      <BloquePernos formData={formData} setFormData={setFormData} errores={errores} />
      <BloqueTransporte formData={formData} setFormData={setFormData} errores={errores} />
      <BloqueInstalacion formData={formData} setFormData={setFormData} errores={errores} />
      <BloqueDescuento formData={formData} setFormData={setFormData} errores={errores} />
    </div>
  );
}