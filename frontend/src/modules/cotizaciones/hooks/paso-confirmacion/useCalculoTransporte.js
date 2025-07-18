import { useEffect } from "react";
import { calcularCostoTransporte } from "../../services/cotizacionesService";
import { extraerDistrito } from "../../utils/cotizacionUtils";

// Este hook funciona para el cálculo automático del precio de transporte.
// Utiliza el servicio para llamar a la API pasándole los atributos necesarios para el cálculo dependiendo el uso.
// Para verificar el distrito de la obra utiliza la función de utilidad 'extraerDistrito' 

// Map de funciones por uso_id extensible para cuando tengamos todos los usos
const obtenerParametrosExtra = {
  3: (formData) => { // Escalera de acceso
    const numero_tramos = (formData.detalles_escaleras.tramos_1m || 0) + (formData.detalles_escaleras.tramos_2m || 0);
    return { numero_tramos };
  },
  5: (formData) => { // Puntales

    if (!Array.isArray(formData.zonas)) return null;

    const transporte_puntales = formData.zonas
      .flatMap(zona => zona.atributos_formulario || [])
      .map(attr => {
        if(!attr?.tipoPuntal) return null;

        // Limpia el tipo de puntal del formulario (ej "3.00 m" => "3.00")
        const tipoPuntalLimpio = String(attr.tipoPuntal).replace(" m", "").trim();

        return { tipo_puntal: tipoPuntalLimpio };
      })
      .filter(Boolean) // esto elimina nulos
    
    return transporte_puntales.length > 0 ? { transporte_puntales } : null;
  },
  7: (formData) => { // Plataforma de descarga
    const cantidad = formData.cantidad_plataformas;
    return { cantidad };
  }
};


export function useCalculoTransporte(formData, setFormData) {
  useEffect(() => {
    const calcular = async () => {
      
      if (!formData.tiene_transporte) return;

      const distrito = extraerDistrito(formData.obra_direccion || "");

      if (!distrito) return;

      try {
        const basePayload = {
          uso_id: formData.uso_id,
          distrito_transporte: distrito,
          //tipo_transporte: formData.tipo_transporte || "Desconocido"
        };

        // Solo incluir si no es escalera de acceso 
        if(formData.uso_id !== 3 && formData.uso_id !== 7) {
          const pesoTn = formData.resumenDespiece?.peso_total_ton;
          if (!pesoTn) return;
          basePayload.peso_total_tn = String(pesoTn);
        }
        
        const extras = obtenerParametrosExtra[formData.uso_id]?.(formData);
        
        if (formData.uso_id in obtenerParametrosExtra && !extras) return;

        const payload = { ...basePayload, ...extras }; 

        console.log("Datos para calcular transporte: ", payload)
        
        const { costosTransporte = {}, tipo_transporte = ""} = await calcularCostoTransporte(payload);

        console.log("CostosTranpsortes:", costosTransporte);
        console.log("tipo transporte:", tipo_transporte);

        
        setFormData((prev) => ({
          ...prev,
          costo_tarifas_transporte: costosTransporte.costo_tarifas_transporte || 0,
          costo_distrito_transporte: costosTransporte.costo_distrito_transporte || 0,
          costo_pernocte_transporte: costosTransporte.costo_pernocte_transporte || 0,

          tipo_transporte: prev.tipo_transporte || tipo_transporte || "", // Solo si no está definido

        }));
      } catch (err) {
        console.error("❌ Error calculando transporte:", err.message);
      }
    };

    calcular();
  }, [formData.tiene_transporte, formData.tipo_transporte]);
}