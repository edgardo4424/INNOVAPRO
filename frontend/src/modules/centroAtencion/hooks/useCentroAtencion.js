import { useEffect, useState } from "react";
import api from "@/shared/services/api";
import { useAuth } from "@/context/AuthContext";
import useTareaActions from "./useTareaActions";

export default function useCentroAtencion() {
   const { user } = useAuth();
   const [tareas, setTareas] = useState([]);
   const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
   const [filtroEstado, setFiltroEstado] = useState("Todas");
   const [busqueda, setBusqueda] = useState("");
   const [fechaFiltroInicio, setFechaFiltroInicio] = useState(null);
   const [fechaFiltroFin, setFechaFiltroFin] = useState(null);

   useEffect(() => {
      async function fetchTareas() {
         try {
            let url = "/tareas";
            const res = await api.get(url);
            setTareas(res.data);
         } catch (error) {
            console.error("❌ Error al obtener tareas:", error);
         }
      }
      fetchTareas();
      const intervalo = setInterval(fetchTareas, 10000);
      return () => clearInterval(intervalo);
   }, [filtroEstado]);



   const cambiarFiltro = (estado) => {
      setFiltroEstado(estado);
   };

   const filtrarTareas = (tarea) => {
      const b = busqueda.toLowerCase();
      const coincideTexto =
         tarea.cliente?.razon_social?.toLowerCase().includes(b) ||
         tarea.obra?.nombre?.toLowerCase().includes(b) ||
         tarea.tipoTarea?.toLowerCase().includes(b) ||
         tarea.usuario_solicitante?.nombre?.toLowerCase().includes(b) ||
         tarea.tecnico_asignado?.nombre?.toLowerCase().includes(b);
      const coincideID = tarea.id?.toString()===busqueda.trim();
      if (!tarea.fecha_creacion) return coincideTexto || coincideID;
      const f = (fecha) => fecha?.toISOString().split("T")[0];
      const fechaTarea = new Date(tarea.fecha_creacion)
         .toISOString()
         .split("T")[0];
      const coincideFecha =
         (!fechaFiltroInicio || fechaTarea >= f(fechaFiltroInicio)) &&
         (!fechaFiltroFin || fechaTarea <= f(fechaFiltroFin));
      return (coincideTexto || coincideID) && coincideFecha;
   };

   const tareasFiltradas = tareas
      .filter((t) =>
         filtroEstado !== "Todas" ? t.estado === filtroEstado : true
      )
      .filter((t) => (busqueda ? filtrarTareas(t) : true));

   const handleSeleccionarTarea = (tarea) => setTareaSeleccionada(tarea);
   const handleCerrarDetalle = () => setTareaSeleccionada(null);

   const acciones = useTareaActions({
      tareas,
      setTareas,
      tareaSeleccionada,
      handleCerrarDetalle,
      user,
   });

   return {
      tareas,
      tareasFiltradas,
      filtroEstado,
      cambiarFiltro,
      busqueda,
      setBusqueda,
      fechaFiltroInicio,
      setFechaFiltroInicio,
      fechaFiltroFin,
      setFechaFiltroFin,

      tareaSeleccionada,
      handleSeleccionarTarea,
      handleCerrarDetalle,
      user,
      acciones,
   };
}
