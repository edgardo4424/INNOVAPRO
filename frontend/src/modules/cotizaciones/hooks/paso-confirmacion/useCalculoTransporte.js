import { useEffect } from "react";
import { calcularCostoTransporte } from "../../services/cotizacionesService";
import { extraerDistrito } from "../../utils/cotizacionUtils";

// Este hook funciona para el cálculo automático del precio de transporte.
// Utiliza el servicio para llamar a la API pasándole los atributos necesarios para el cálculo dependiendo el uso.
// Para verificar el distrito de la obra utiliza la función de utilidad 'extraerDistrito' 

// Mapa de funciones por uso extensible si se añaden más usos
// obtenemos los parametros específicos para el cálculo del precio del transporte
const obtenerParametrosExtra = {
  3: (formData) => { // Escalera de acceso
    const numero_tramos = (formData.uso.detalles_escaleras.tramos_1m || 0) + (formData.uso.detalles_escaleras.tramos_2m || 0);
    return { numero_tramos };
  },
  5: (formData) => { // Puntales

    if (!Array.isArray(formData.uso.zonas)) return null;

    const transporte_puntales = formData.uso.zonas
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
    const cantidad = formData.uso.cantidad_plataformas;
    return { cantidad };
  },
  11: (formData) => { // Escuadras sin plataformas

    const cantidad = formData.uso.cantidad_escuadras;

    if (!Array.isArray(formData.uso.zonas)) return null;

    const transporte_escuadras = formData.uso.zonas
      .flatMap(zona => zona.atributos_formulario || [])
      .map(attr => {
        if(!attr?.escuadra) return null;

        // Limpia el tipo de puntal del formulario (ej "3.00 m" => "3.00")
        const tipoEscuadraFormateado = String(attr.escuadra).concat(".00").trim();

        return { tipo_escuadra: tipoEscuadraFormateado, cantidad: cantidad};
      })
      .filter(Boolean) // esto elimina nulos
    
    return transporte_escuadras.length > 0 ? { transporte_escuadras } : null;
  }
};


// Función principal para el cálculo del transporte
// Recibe el formData y el setter como parámetros.
export function useCalculoTransporte(formData, setFormData) {

  useEffect(() => {
    const calcular = async () => {
      // Validamos que no se ejecute si no se ha pedido el cálculo
      if (!formData.atributos_opcionales.transporte?.tiene_transporte) return;
      
      // Obtenemos el distrito mediante la utilidad diseñada para extraer 
      // el distrito de una dirección dada
      const distrito = extraerDistrito(formData.entidad.obra.direccion || "");
      
      // Si no conseguimos ningún distrito no podemos calcular el transporte
      if (!distrito) return;

      try {
        // Definimos la base del Payload que enviaremos al backend
        const basePayload = {
          uso_id: formData.uso.id,
          distrito_transporte: distrito,
        };
        
        // Solo incluir si no es escalera de acceso o plataforma de descarga
        if(formData.uso.id !== 3 && formData.uso.id !== 7 && formData.uso.id !== 11) {
          const pesoTn = formData.uso.resumenDespiece?.peso_total_ton;
          // Si no logramos extraer el peso no agregamos nada al Payload
          if (!pesoTn) return;
          // Agregamos el peso total en tonelaje al Payload
          basePayload.peso_total_tn = String(pesoTn);
        }
        
        // Obtenemos los parámetros extras con la función dinámica dependiendo el uso
        const extras = obtenerParametrosExtra[formData.uso.id]?.(formData);
        
        // Validamos que si existe el uso y no se cargan los adicionales no hacemos nada
        if (formData.uso.id in obtenerParametrosExtra && !extras) return;
        
        const payload = { ...basePayload, ...extras }; 
        
        const { costosTransporte = {}, tipo_transporte = ""} = await calcularCostoTransporte(payload);
     
        setFormData((prev) => ({
          ...prev,
          atributos_opcionales: {
            ...prev.atributos_opcionales,
            transporte: {
              ...prev.atributos_opcionales.transporte,
              costo_tarifas_transporte: costosTransporte.costo_tarifas_transporte || 0,
              costo_distrito_transporte: costosTransporte.costo_distrito_transporte || 0,
              costo_pernocte_transporte: costosTransporte.costo_pernocte_transporte || 0,
              tipo_transporte: prev.atributos_opcionales.transporte.tipo_transporte || tipo_transporte || "",
            }
          }
        }));
      } catch (err) {
        console.error("❌ Error calculando transporte:", err.message);
      }
    };

    calcular();
  }, [formData.atributos_opcionales.transporte?.tiene_transporte, formData.atributos_opcionales.transporte?.tipo_transporte]);
}