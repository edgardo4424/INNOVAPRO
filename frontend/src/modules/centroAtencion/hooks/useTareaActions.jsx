import api from "@/shared/services/api";
import { toast } from "react-toastify";

export default function useTareaActions({
  tareas,
  setTareas,
  tareaSeleccionada,
  handleCerrarDetalle,
  user,
}) {
  const handleTomarTarea = async () => {
    if (!tareaSeleccionada) return;
    try {
      await api.put(`/tareas/${tareaSeleccionada.id}/tomar`);
      setTareas((prevTareas) =>
        prevTareas.map((t) =>
          t.id === tareaSeleccionada.id
            ? { ...t, estado: "En proceso", asignadoA: user.id }
            : t,
        ),
      );
      toast.success("✅ Tarea tomada con éxito");
      handleCerrarDetalle();
    } catch (error) {
      console.error("❌ Error al tomar la tarea:", error);
      toast.error("❌ No se pudo tomar la tarea.");
    }
  };

  const handleLiberarTarea = async () => {
    if (!tareaSeleccionada) return;
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas liberar esta tarea?",
    );
    if (!confirmacion) return;
    try {
      await api.put(`/tareas/${tareaSeleccionada.id}/liberar`);
      setTareas((prevTareas) =>
        prevTareas.map((t) =>
          t.id === tareaSeleccionada.id
            ? { ...t, estado: "Pendiente", asignadoA: null }
            : t,
        ),
      );
      toast.success("✅ Tarea liberada con éxito");
      handleCerrarDetalle();
    } catch (error) {
      console.error("❌ Error al liberar la tarea:", error);
      toast.error("❌ No se pudo liberar la tarea.");
    }
  };

  const handleFinalizarTarea = async () => {
    if (!tareaSeleccionada) return;
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas finalizar esta tarea?",
    );
    if (!confirmacion) return;

    toast.promise(
      api.put(`/tareas/${tareaSeleccionada.id}/finalizar`).then(() => {
        setTareas((prevTareas) =>
          prevTareas.map((t) =>
            t.id === tareaSeleccionada.id ? { ...t, estado: "Finalizada" } : t,
          ),
        );
        handleCerrarDetalle();
      }),
      {
        pending: "Finalizando tarea...",
        success: "✅ Tarea finalizada con éxito",
        error: "❌ No se pudo finalizar la tarea",
      },
    );
  };

  const handleDevolverTarea = async () => {
    if (!tareaSeleccionada) return;
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas devolver esta tarea?",
    );
    if (!confirmacion) return;
    const motivo = prompt("Ingrese el motivo de la devolución:");
    if (!motivo) return;

    toast.promise(
      api
        .put(`/tareas/${tareaSeleccionada.id}/devolver`, {
          motivo: motivo,
          user_name: user.nombre,
          user_id: user.id,
        })
        .then(() => {
          setTareas((prevTareas) =>
            prevTareas.map((t) =>
              t.id === tareaSeleccionada.id ? { ...t, estado: "Devuelta" } : t,
            ),
          );
          handleCerrarDetalle();
        }),
      {
        pending: "Devolviendo tarea...",
        success: "✅ Tarea devuelta con éxito",
        error: "❌ No se pudo devolver la tarea",
      },
    );
  };

  const handleCancelarTarea = async () => {
    if (!tareaSeleccionada) return;
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas cancelar esta tarea?",
    );
    if (!confirmacion) return;

    toast.promise(
      api.put(`/tareas/${tareaSeleccionada.id}/cancelar`).then(() => {
        setTareas((prevTareas) =>
          prevTareas.map((t) =>
            t.id === tareaSeleccionada.id ? { ...t, estado: "Cancelada" } : t,
          ),
        );
        handleCerrarDetalle();
      }),
      {
        pending: "Cancelando tarea...",
        success: "✅ Tarea cancelada con éxito",
        error: "❌ No se pudo cancelar la tarea",
      },
    );
  };

  const handleCorregirTarea = async () => {
    if (!tareaSeleccionada) return;
    const correccion = prompt("🔍 Ingresa la corrección para esta tarea:");
    if (!correccion) return;

    toast.promise(
      api
        .put(`/tareas/${tareaSeleccionada.id}/corregir`, {
          correccion: correccion,
          user_name: user.nombre,
          user_id: user.id,
        })
        .then(() => {
          setTareas((prevTareas) =>
            prevTareas.map((t) =>
              t.id === tareaSeleccionada.id
                ? { ...t, estado: "Pendiente", correccionComercial: correccion }
                : t,
            ),
          );
          handleCerrarDetalle();
        }),
      {
        pending: "Corrigiendo tarea...",
        success:
          "✅ Tarea corregida con éxito. Ahora está en estado Pendiente.",
        error: "❌ No se pudo corregir la tarea",
      },
    );
  };

  return {
    handleTomarTarea,
    handleLiberarTarea,
    handleFinalizarTarea,
    handleDevolverTarea,
    handleCancelarTarea,
    handleCorregirTarea,
  };
}
