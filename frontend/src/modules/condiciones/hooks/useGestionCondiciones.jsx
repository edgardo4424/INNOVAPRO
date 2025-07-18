import { useState, useEffect } from "react";
import { obtenerCondicionesPendientes, responderCondicion } from "../services/condicionesService";
import { toast } from "react-toastify";

export default function useGestionCondiciones() {
  const [condiciones, setCondiciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarCondiciones = async () => {
    setLoading(true);
    try {
      const data = await obtenerCondicionesPendientes();
      setCondiciones(data);
    } catch (error) {
      console.error("❌ Error al cargar condiciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const guardarCondicion = async (id, texto) => {
    console.log("Envio al backend:", id, texto)
    try {
      await responderCondicion(id, texto);
      toast.success("Condiciones registradas");
      await cargarCondiciones();
    } catch (error) {
      console.error("❌ Error al guardar condiciones:", error);
      toast.error("No se pudo guardar la respuesta");
    }
  };

  useEffect(() => {
    cargarCondiciones();
  }, []);

  return {
    condiciones,
    loading,
    guardarCondicion,
  };
}