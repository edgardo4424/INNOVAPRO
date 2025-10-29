import { useEffect, useState } from "react";
import { obtenerUsos } from "../../services/cotizacionesService";
import { toast } from "react-toastify";

// Este hook se encarga de cargar los usos disponibles desde el API al iniciar el componente.
// Proporciona los datos de los usos cargados y funciones para manejar cambios en el formulario de cotización

export function usePasoUso({ formData, setFormData }) {
  const [usos, setUsos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerUsos();
        setUsos(data);
      } catch (err) {
        console.error(err);
        toast.error("Error al cargar los usos");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const handleChange = (campo, valor) => {
    setFormData((prev) => ({ 
      ...prev, 
      [campo]: valor,
    }));
  };

  const handleSeleccionUso = (equipo) => {
    const id = parseInt(equipo.target.value);
    const uso = usos.find(uso => uso.id === id);
    handleChange("uso", {
      id: uso?.id || null,
      nombre: uso?.descripcion || "",
    })
  };

  return {
    usos,
    loading,
    handleChange,
    handleSeleccionUso,
  };
}