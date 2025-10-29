import { useMemo, useEffect, useRef } from "react";

export function useEscaleraAcceso(formData, setFormData) {

const detalles_escaleras = formData?.uso?.detalles_escaleras;
  if (!detalles_escaleras) return null;

  const precioTramo = Number(detalles_escaleras?.precio_tramo || 0);
  const alturaFija = Number(detalles_escaleras?.altura_total_general || 0);

  // --------------- CÁLCULO LOCAL PARA MOSTRAR (no muta altura_total_general) ---------------
  const { tramos_2m, tramos_1m, subtotal, inconsistencias } = useMemo(() => {
    let _t2 = 0, _t1 = 0, _subtotal = 0;
    const errores = [];
    (detalles_escaleras.escaleras || []).forEach((zona) =>
      (zona.equipos || []).forEach((equipo, idx) => {
        const alturaTotal = Number(equipo.alturaTotal || 0);
        const tramosAlturaTotal = Number(equipo.tramos_2m || 0) * 2 + Number(equipo.tramos_1m || 0);
        if (alturaTotal !== tramosAlturaTotal) errores.push({ zona: zona.zona, equipo: idx + 1, esperado: alturaTotal, calculado: tramosAlturaTotal });
        _t2 += Number(equipo.tramos_2m || 0);
        _t1 += Number(equipo.tramos_1m || 0);
        _subtotal += (Number(equipo.tramos_2m || 0) + Number(equipo.tramos_1m || 0)) * precioTramo;
      })
    );
    return { tramos_2m: _t2, tramos_1m: _t1, subtotal: _subtotal, inconsistencias: errores };
  }, [detalles_escaleras?.escaleras, precioTramo]);

  // --- recalcula y persiste los subtotales de cada equipo cuando cambia precio_tramo/tramos ---
  const equiposHashReferencia = useRef("");
  useEffect(() => {
    if (!Array.isArray(detalles_escaleras?.escaleras)) return;

    // armamos un hash de precio_tramo + tramos por equipo para evitar loops
    const hash = JSON.stringify({
      precio: precioTramo,
      zona: detalles_escaleras.escaleras.map(zona => (zona.equipos || []).map(equipo => [equipo.tramos_2m || 0, equipo.tramos_1m || 0]))
    });
   
    if (equiposHashReferencia.current === hash) return;
    equiposHashReferencia.current = hash;

    setFormData(prev => {
      const escaleras = structuredClone(prev.uso.detalles_escaleras.escaleras);
      escaleras.forEach(zona => (zona.equipos || []).forEach(equipo => {
        const numero_tramos = (Number(equipo.tramos_2m || 0) + Number(equipo.tramos_1m || 0));
        equipo.numero_tramos = numero_tramos;
        equipo.precio_subtotal_alquiler_soles = (precioTramo * numero_tramos).toFixed(2);
      }));
      return {
        ...prev,
        uso: {
          ...prev.uso,
          detalles_escaleras: {
            ...prev.uso.detalles_escaleras,
            escaleras
          }
        }
      };
    });
  }, [precioTramo, detalles_escaleras?.escaleras, setFormData]);
  // -------------------------------------------------------------------

  // --------------- SINCRONIZACIÓN CON formData (sin tocar altura_total_general) ---------------
  // - Refleja tramos_2m/tramos_1m y subtotal en el estado global para que:
  //   alturaTotal) Resumen y total de alquiler usen estos valores
  //   b) El guardado lleve el subtotal correcto
  // - NO actualiza 'altura_total_general' (permanece inmutable)
   // --- Sincroniza totales globales (NO toca altura_total_general) ---
  const sincronizacionHashReferencia = useRef("");
  useEffect(() => {
    const hash = JSON.stringify({ tramos_2m, tramos_1m, subtotal, precioTramo });
    if (sincronizacionHashReferencia.current === hash) return;
    sincronizacionHashReferencia.current = hash;

    setFormData(prev => ({
      ...prev,
      uso: {
        ...prev.uso,
        detalles_escaleras: {
          ...prev.uso.detalles_escaleras,
          tramos_2m: tramos_2m,
          tramos_1m: tramos_1m,
          precio_subtotal_alquiler_soles: subtotal.toFixed(2),
        },
        resumenDespiece: {
          ...prev.uso.resumenDespiece,
          precio_subtotal_alquiler_soles: subtotal.toFixed(2),
        }
      }
    }));
  }, [tramos_2m, tramos_1m, subtotal, precioTramo, setFormData]);

  // --------------- Handlers ---------------

  // Buffer temporal para edición de tramos (permite vacío)
  const actualizarCambioEnTramo = (zonaIdx, eqIdx, campo, value) => {
    setFormData(prev => {
      const escaleras = structuredClone(prev.uso.detalles_escaleras.escaleras);
      const equipo = escaleras[zonaIdx].equipos[eqIdx];
      equipo.__tmp = equipo.__tmp || {};
      equipo.__tmp[campo] = value; // guardamos como string temporal
      return {
        ...prev,
        uso: { 
          ...prev.uso, 
          detalles_escaleras: { 
            ...prev.uso.detalles_escaleras, 
            escaleras 
          } 
        }
      };
    });
  };

  const actualizarTramo = (zonaIdx, eqIdx, campo) => {
    setFormData(prev => {
      const escaleras = structuredClone(prev.uso.detalles_escaleras.escaleras);
      const equipo = escaleras[zonaIdx].equipos[eqIdx];

      const raw = equipo.__tmp?.[campo] ?? "";
      const parsed = parseInt(raw, 10);
      const val = Number.isNaN(parsed) ? 0 : parsed;

      equipo[campo] = val;
      // limpiamos buffer del campo y recalculamos
      if (equipo.__tmp) delete equipo.__tmp[campo];
      if (equipo.__tmp && !Object.keys(equipo.__tmp).length) delete equipo.__tmp;

      const n = (Number(equipo.tramos_2m || 0) + Number(equipo.tramos_1m || 0));
      equipo.numero_tramos = n;
      equipo.precio_subtotal_alquiler_soles = (precioTramo * n).toFixed(2);

      return {
        ...prev,
        uso: { 
          ...prev.uso, 
          detalles_escaleras: { 
            ...prev.uso.detalles_escaleras, 
            escaleras 
          } 
        }
      };
    });
  };

  return {
    detalles_escaleras,
    alturaFija,
    precioTramo,
    tramos_2m,
    tramos_1m,
    subtotal,
    inconsistencias,
    actualizarCambioEnTramo,
    actualizarTramo,
  };
}