import { useEffect, useState } from "react";
import api from "@/shared/services/api";
import { toast } from "react-toastify";

// Este hook se encarga de cargar los contactos y filiales desde el API al iniciar el componente.
// Proporciona los datos cargados y un estado de carga para manejar la UI mientras se obtienen los datos.

export default function usePasoContacto() {
  const [contactos, setContactos] = useState([]);
  const [filiales, setFiliales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [contactosRes, filialesRes] = await Promise.all([
          api.get("/contactos"),
          api.get("/filiales"),
        ]);
        setContactos(contactosRes.data);
        setFiliales(filialesRes.data);
      } catch (error) {
        console.error("Error cargando datos del paso 1", error);
        toast.error("Error al cargar datos iniciales.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  return { contactos, filiales, loading };
}