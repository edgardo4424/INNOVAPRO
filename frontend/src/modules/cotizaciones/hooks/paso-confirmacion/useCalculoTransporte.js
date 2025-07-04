import { useEffect } from "react";
import { calcularCostoTransporte } from "../../services/cotizacionesService";
import { extraerDistrito } from "../../utils/cotizacionUtils";

// Este hook funciona para el cálculo automático del precio de transporte.
// Utiliza el servicio para llamar a la API pasándole los atributos necesarios para el cálculo dependiendo el uso.
// Para verificar el distrito de la obra utiliza la función de utilidad 'extraerDistrito' 

// Map de funciones por uso_id extensible para cuando tengamos todos los usos
const obtenerParametrosExtra = {
  3: (atributos) => { // Escalera de acceso
    const attr = atributos?.[0];
    if (!attr?.alturaTotal) return null;
    let numero_tramos = attr.alturaTotal / 2;
    if (attr.alturaTotal % 2 !== 0) numero_tramos += 0.5;
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
};


export function useCalculoTransporte(formData, setFormData) {
  useEffect(() => {
    const calcular = async () => {
      
      if (!formData.tiene_transporte) return;

      const pesoTn = formData.resumenDespiece?.peso_total_ton;
      const distrito = extraerDistrito(formData.obra_direccion || "");

      if (!distrito || !pesoTn) return;

      try {
        const basePayload = {
          uso_id: formData.uso_id,
          peso_total_tn: String(pesoTn),
          distrito_transporte: distrito,
          tipo_transporte: formData.tipo_transporte || "Desconocido"
        };
        
        const extras = obtenerParametrosExtra[formData.uso_id]?.(formData);
        
        if (formData.uso_id in obtenerParametrosExtra && !extras) return;

        const payload = { ...basePayload, ...extras }; 
        
        const { costosTransporte = {}, tipo_transporte = ""} = await calcularCostoTransporte(payload);
        
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