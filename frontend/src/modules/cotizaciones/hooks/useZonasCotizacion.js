import { useState, useEffect } from "react";
import { obtenerAtributosPorUso } from "../services/cotizacionesService";

export const useZonasCotizacion = (usoId) => {
  const [zonas, setZonas] = useState([{ zona: 1, atributos_formulario: [{}] }]);
  const [atributos, setAtributos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar atributos por uso
  useEffect(() => {
    const cargarAtributos = async () => {
      if (!usoId) return;
      setLoading(true);
      try {
        const data = await obtenerAtributosPorUso(usoId);
        const atributosProcesados = data.map((atrib) => {
          let valores = [];
          try {
            valores = Array.isArray(atrib.valores_por_defecto)
              ? atrib.valores_por_defecto
              : JSON.parse(atrib.valores_por_defecto || "[]");
          } catch (error) {
            console.warn(`❌ Error parseando valores_por_defecto en '${atrib.nombre}'`, error);
          }
          return { ...atrib, valores_por_defecto: valores };
        });
        setAtributos(atributosProcesados);
      } catch (error) {
        console.error("Error al cargar atributos", error);
      } finally {
        setLoading(false);
      }
    };

    cargarAtributos();
  }, [usoId]);

  // Inicializar atributos vacíos ("") para cada equipo
  useEffect(() => {
    if (atributos.length === 0) return;

    setZonas((zonasPrevias) =>
      zonasPrevias.map((zona) => ({
        ...zona,
        atributos_formulario: zona.atributos_formulario.map((equipo) => {
          const nuevoEquipo = { ...equipo };
          atributos.forEach((atrib) => {
            if (!(atrib.llave_json in nuevoEquipo)) {
              nuevoEquipo[atrib.llave_json] = "";
            }
          });
          return nuevoEquipo;
        }),
      }))
    );
  }, [atributos]);

  const handleChange = (zonaIndex, equipoIndex, llave, valor) => {
    setZonas((prevZonas) => {
      const nuevasZonas = [...prevZonas];
      const zona = nuevasZonas[zonaIndex];
      if (!zona.atributos_formulario[equipoIndex]) zona.atributos_formulario[equipoIndex] = {};
      zona.atributos_formulario[equipoIndex][llave] = valor;
      return nuevasZonas;
    });
  };

  const agregarZona = () => {
    setZonas((prev) => [...prev, { zona: prev.length + 1, atributos_formulario: [{}] }]);
  };

  const eliminarZona = () => {
    setZonas((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const agregarEquipo = (zonaIndex) => {
    setZonas((prev) => {
      const nuevasZonas = JSON.parse(JSON.stringify(prev)); // clonado profundo
      const equipoVacio = {};
      atributos.forEach((atrib) => {
        equipoVacio[atrib.llave_json] = "";
      });
      nuevasZonas[zonaIndex].atributos_formulario.push(equipoVacio);
      return nuevasZonas;
    });
  };

  const eliminarEquipo = (zonaIndex) => {
    setZonas((prev) => {
      const nuevasZonas = JSON.parse(JSON.stringify(prev)); // clonado profundo
      if (nuevasZonas[zonaIndex].atributos_formulario.length > 1) {
        nuevasZonas[zonaIndex].atributos_formulario.pop();
      }
      return nuevasZonas;
    });
  };

  return {
    zonas,
    atributos,
    loading,
    handleChange,
    agregarZona,
    eliminarZona,
    agregarEquipo,
    eliminarEquipo,
    setZonas
  };
};