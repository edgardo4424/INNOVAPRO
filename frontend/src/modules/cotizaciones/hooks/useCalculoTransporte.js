// INNOVA PRO+ v1.4.0
import { useEffect } from "react";
import { calcularCostoTransporte } from "../services/cotizacionesService";
import { extraerDistrito } from "../utils/cotizacionUtils";

export function useCalculoTransporte(formData, setFormData) {
  useEffect(() => {
    const calcular = async () => {
      if (!formData.tiene_transporte) return;

      const pesoTn = formData.resumenDespiece?.peso_total_ton;
      const direccion = formData.obra_direccion || "";
      const distrito = extraerDistrito(direccion);

      if (!distrito || !pesoTn) return;

      try {
        let atributos_para_calcular_transporte = {
          uso_id: formData.uso_id,
          peso_total_tn: String(pesoTn),
          distrito_transporte: distrito,
          tipo_transporte: formData.tipo_transporte || "Desconocido"
        };

        switch (formData.uso_id) {
          case 3: {
            const attr = formData.atributos?.[0];
            if (!attr?.alturaTotal) return;
            let numero_tramos = attr.alturaTotal / 2;
            if (attr.alturaTotal % 2 !== 0) numero_tramos += 0.5;
            atributos_para_calcular_transporte.numero_tramos = numero_tramos;
            break;
          }
          case 5: {
            const attr = formData.atributos?.[0];
            if (!attr?.tipoPuntal) return;
            atributos_para_calcular_transporte.tipo_puntal = attr.tipoPuntal;
            break;
          }
          default:
            break;
        }

        const respuesta = await calcularCostoTransporte(atributos_para_calcular_transporte);
        const costo = respuesta?.costosTransporte || {};

        setFormData((prev) => ({
          ...prev,
          costo_tarifas_transporte: costo.costo_tarifas_transporte || 0,
          costo_distrito_transporte: costo.costo_distrito_transporte || 0,
          costo_pernocte_transporte: costo.costo_pernocte_transporte || 0,
          tipo_transporte: formData.tipo_transporte || "Desconocido"
        }));
      } catch (err) {
        console.error("❌ Error calculando transporte:", err.message);
      }
    };

    calcular();
  }, [formData.tiene_transporte, formData.tipo_transporte]);
}