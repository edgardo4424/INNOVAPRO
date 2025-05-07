import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import useTareaActions from "@/hooks/useTareaActions";

export default function useCentroAtencion() {
  const { user } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("Pendiente");
  const [paginaActual, setPaginaActual] = useState(1);
  const [tareasPorPagina] = useState(20);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("asc");
  const [columnaOrdenada, setColumnaOrdenada] = useState(null);
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

  const ordenarTareas = (campo) => {
    const ordenActual = orden === "asc" ? 1 : -1;
    const nuevoOrden = orden === "asc" ? "desc" : "asc";
    const sorted = [...tareas].sort((a, b) => {
      const valorA = campo.includes(".") ? campo.split(".").reduce((o, i) => o?.[i], a) : a[campo];
      const valorB = campo.includes(".") ? campo.split(".").reduce((o, i) => o?.[i], b) : b[campo];
      return (!valorA || !valorB) ? 0 : valorA.toString().localeCompare(valorB.toString()) * ordenActual;
    });
    setOrden(nuevoOrden);
    setColumnaOrdenada(campo);
    setTareas(sorted);
  };

  const cambiarFiltro = (estado) => {
    setFiltroEstado(estado);
    setPaginaActual(1);
  };

  const filtrarTareas = (tarea) => {
    const b = busqueda.toLowerCase();
    const coincideTexto =
      tarea.cliente?.razon_social?.toLowerCase().includes(b) ||
      tarea.obra?.nombre?.toLowerCase().includes(b) ||
      tarea.tipoTarea?.toLowerCase().includes(b) ||
      tarea.usuario_solicitante?.nombre?.toLowerCase().includes(b) ||
      tarea.tecnico_asignado?.nombre?.toLowerCase().includes(b);
    const coincideID = tarea.id?.toString().includes(busqueda.trim());
    if (!tarea.fecha_creacion) return coincideTexto || coincideID;
    const f = (fecha) => fecha?.toISOString().split("T")[0];
    const fechaTarea = new Date(tarea.fecha_creacion).toISOString().split("T")[0];
    const coincideFecha = (!fechaFiltroInicio || fechaTarea >= f(fechaFiltroInicio)) &&
                          (!fechaFiltroFin || fechaTarea <= f(fechaFiltroFin));
    return (coincideTexto || coincideID) && coincideFecha;
  };

  const indexUltima = paginaActual * tareasPorPagina;
  const indexPrimera = indexUltima - tareasPorPagina;
  const tareasFiltradas = tareas.filter(t => t.estado === filtroEstado).filter(t => busqueda ? filtrarTareas(t) : true);
  const totalPaginas = Math.ceil(tareasFiltradas.length / tareasPorPagina);
  const tareasPaginadas = tareasFiltradas.slice(indexPrimera, indexUltima);

  const handleSeleccionarTarea = (tarea) => setTareaSeleccionada(tarea);
  const handleCerrarDetalle = () => setTareaSeleccionada(null);

  const acciones = useTareaActions({ tareas, setTareas, tareaSeleccionada, handleCerrarDetalle, user });

  return {
    tareas,
    tareasFiltradas: tareasPaginadas,
    paginaActual,
    totalPaginas,
    cambiarPagina: setPaginaActual,
    filtroEstado,
    cambiarFiltro,
    busqueda,
    setBusqueda,
    fechaFiltroInicio,
    setFechaFiltroInicio,
    fechaFiltroFin,
    setFechaFiltroFin,
    ordenarTareas,
    columnaOrdenada,
    orden,
    tareaSeleccionada,
    handleSeleccionarTarea,
    handleCerrarDetalle,
    user,
    acciones,
  };
}