import { useState, useEffect } from "react";
import { obtenerAtributosPorUso } from "../../services/cotizacionesService";

// Este hook permite la carga de los atributos del uso mediante un "usoId".
// También inicializa todos los valores por defecto a "" para que sean enviados a validar al backend.
// Maneja además las funciones para agregar y eliminar tanto Zonas como equipos.

export const useZonasCotizacion = (usoId) => {
  // Inicializamos la primera zona a definir
  const [zonas, setZonas] = useState([{ zona: 1, nota_zona: "", atributos_formulario: [{}] }]);

  const [atributos, setAtributos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar atributos por uso
  useEffect(() => {
    const cargarAtributos = async () => {
      // Si no se reconoce el id del se queda en loading
      if (!usoId) return;
      setLoading(true);

      try {
        const data = await obtenerAtributosPorUso(usoId);
        const atributosProcesados = data.map((atributo) => {
          let valores = [];
          try {
            valores = Array.isArray(atributo.valores_por_defecto)
              ? atributo.valores_por_defecto
              : JSON.parse(atributo.valores_por_defecto || "[]");
          } catch (error) {
            console.warn(`Error parseando valores_por_defecto en '${atributo.nombre}'`, error);
          }
          return { ...atributo, valores_por_defecto: valores };
        });
        setAtributos(atributosProcesados);
      } catch (error) {
        console.error("Error al cargar atributos", error);
      } finally {
        setLoading(false);
      }
    };
    // Cargamos los atributos cuando se monta el componente
    cargarAtributos();
  }, [usoId]);

  // Inicializar atributos vacíos ("") para cada equipo
  useEffect(() => {
    // Si atributos viene vacío, no hacer nada
    if (atributos.length === 0) return;

    setZonas((zonasPrevias) =>
      zonasPrevias.map((zona) => ({
        ...zona,
        atributos_formulario: zona.atributos_formulario.map((equipo) => {
          const nuevoEquipo = { ...equipo };
          atributos.forEach((atributo) => {
            if (nuevoEquipo[atributo.llave_json] === undefined) {
              nuevoEquipo[atributo.llave_json] = "";
            }
          });
          return nuevoEquipo;
        }),
      }))
    ); 
  }, [atributos]);

  // Maneja los cambios dentro de los equipos de cada zona
  const handleChange = (zonaIndex, equipoIndex, llave, valor) => {
    setZonas((prevZonas) => {
      const nuevasZonas = [...prevZonas];
      const zona = nuevasZonas[zonaIndex];
      if (!zona.atributos_formulario[equipoIndex]) zona.atributos_formulario[equipoIndex] = {};
      zona.atributos_formulario[equipoIndex][llave] = valor;
      return nuevasZonas;
    });
  };

  // Método para agregar nueva zona limpia
  const agregarZona = () => {
    setZonas((prev) => [
      ...prev, 
      { 
        zona: prev.length + 1, 
        nota_zona: "", 
        atributos_formulario: [{}] 
      }]);
  };

  // Método para eliminar una zona borrando todo
  const eliminarZona = () => {
    setZonas((prev) => (
      prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  // Método para agregar un equipo a una zona
  const agregarEquipo = (zonaIndex) => {
    setZonas((prev) => {
      // Clonamos de manera profunda el objeto de equipos, sin alterar los previos (originales)
      const nuevasZonas = JSON.parse(JSON.stringify(prev)); 

      const notaZona = nuevasZonas[zonaIndex].nota_zona || "";
      const equipoVacio = {};

      atributos.forEach((atributo) => {
        equipoVacio[atributo.llave_json] = "";
      });

      nuevasZonas[zonaIndex].atributos_formulario.push(equipoVacio);

      nuevasZonas[zonaIndex].nota_zona = notaZona; // Mantener la nota de la zona

      return nuevasZonas;
    });
  };

  // Método para eliminar un equipo dentro de una zona
  const eliminarEquipo = (zonaIndex) => {
    setZonas((prev) => {
      // Clonamos de manera profunda el objeto de equipos, sin alterar los previos (originales)
      const nuevasZonas = JSON.parse(JSON.stringify(prev));
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