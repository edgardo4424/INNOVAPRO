import { useEffect, useState } from "react";
import { obtenerAtributosPorUso } from "../services/cotizacionesService";

// Este hook se encarga de cargar los atributos del uso el API al iniciar el componente.
// Proporciona los datos cargados y un estado de carga para manejar la UI mientras se obtienen los datos.

export function useAtributosPorUso(uso_id) {
  const [atributos, setAtributos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      if (!uso_id) return;
      setLoading(true);
      try {
        const data = await obtenerAtributosPorUso(uso_id);
        const atributosProcesados = data.map((atrib) => {
          let valores = [];
          try {
            valores = Array.isArray(atrib.valores_por_defecto)
              ? atrib.valores_por_defecto
              : JSON.parse(atrib.valores_por_defecto || "[]");
          } catch (e) {
            console.warn(`Error parseando '${atrib.nombre}'`, e);
          }
          return { ...atrib, valores_por_defecto: valores };
        });
        setAtributos(atributosProcesados);
      } catch (e) {
        console.error("Error cargando atributos:", e);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [uso_id]);

  return { atributos, loading };
}