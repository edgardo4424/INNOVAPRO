import api from "@/shared/services/api";

export default function useTareaActions({ tareas, setTareas, tareaSeleccionada, handleCerrarDetalle, user }) {

  const handleTomarTarea = async () => {
    if (!tareaSeleccionada) return;
    try {
      await api.put(`/tareas/${tareaSeleccionada.id}/tomar`);
      setTareas(prevTareas =>
        prevTareas.map(t =>
          t.id === tareaSeleccionada.id
            ? { ...t, estado: "En proceso", asignadoA: user.id }
            : t
        )
      );
      alert("✅ Tarea tomada con éxito");
      handleCerrarDetalle();
    } catch (error) {
      console.error("❌ Error al tomar la tarea:", error);
      alert("❌ No se pudo tomar la tarea.");
    }
  }

  const handleLiberarTarea = async () => {
    if (!tareaSeleccionada) return;
    const confirmacion = window.confirm("¿Estás seguro de que deseas liberar esta tarea?");
    if (!confirmacion) return;
    try {
      await api.put(`/tareas/${tareaSeleccionada.id}/liberar`);
      setTareas(prevTareas =>
        prevTareas.map(t =>
          t.id === tareaSeleccionada.id
            ? { ...t, estado: "Pendiente", asignadoA: null }
            : t
        )
      );
      alert("✅ Tarea liberada con éxito");
      handleCerrarDetalle();
    } catch (error) {
      console.error("❌ Error al liberar la tarea:", error);
      alert("❌ No se pudo liberar la tarea.");
    }
  }

  const handleFinalizarTarea = async () => {
    if (!tareaSeleccionada) return;
    const confirmacion = window.confirm("¿Estás seguro de que deseas finalizar esta tarea?");
    if (!confirmacion) return;
    try {
      await api.put(`/tareas/${tareaSeleccionada.id}/finalizar`);
      setTareas(prevTareas =>
        prevTareas.map(t =>
          t.id === tareaSeleccionada.id ? { ...t, estado: "Finalizada" } : t
        )
      );
      alert("✅ Tarea finalizada con éxito");
      handleCerrarDetalle();
    } catch (error) {
      console.error("❌ Error al finalizar la tarea:", error);
      alert("❌ No se pudo finalizar la tarea.");
    }
  }

  const handleDevolverTarea = async () => {
    if (!tareaSeleccionada) return;
    const confirmacion = window.confirm("¿Estás seguro de que deseas devolver esta tarea?");
    if (!confirmacion) return;
    const motivo = prompt("Ingrese el motivo de la devolución:");
    if (!motivo) return;

    try {
      await api.put(`/tareas/${tareaSeleccionada.id}/devolver`, { motivo });
      setTareas(prevTareas =>
        prevTareas.map(t =>
          t.id === tareaSeleccionada.id ? { ...t, estado: "Devuelta" } : t
        )
      );
      alert("✅ Tarea devuelta con éxito");
      handleCerrarDetalle();
    } catch (error) {
      console.error("❌ Error al devolver la tarea:", error);
      alert("❌ No se pudo devolver la tarea.");
    }
  }

  const handleCancelarTarea = async () => {
    if (!tareaSeleccionada) return;
    const confirmacion = window.confirm("¿Estás seguro de que deseas cancelar esta tarea?");
    if (!confirmacion) return;

    try {
      await api.put(`/tareas/${tareaSeleccionada.id}/cancelar`);
      setTareas(prevTareas =>
        prevTareas.map(t =>
          t.id === tareaSeleccionada.id ? { ...t, estado: "Cancelada" } : t
        )
      );
      alert("✅ Tarea cancelada con éxito");
      handleCerrarDetalle();
    } catch (error) {
      console.error("❌ Error al cancelar la tarea:", error);
      alert("❌ No se pudo cancelar la tarea.");
    }
  }

  const handleCorregirTarea = async () => {
    if (!tareaSeleccionada) return;

    const correccion = prompt("🔍 Ingresa la corrección para esta tarea:");
    if (!correccion) return; // Si no ingresa nada, no hace cambios

    try {
        await api.put(`/tareas/${tareaSeleccionada.id}/corregir`, { correccion });

        // 🔥 Actualizar la lista de tareas en el frontend
        setTareas(prevTareas =>
        prevTareas.map(t =>
            t.id === tareaSeleccionada.id ? { ...t, estado: "Pendiente", correccionComercial: correccion } : t
        )
        );

        alert("✅ Tarea corregida con éxito. Ahora está en estado Pendiente.");
        handleCerrarDetalle();
    } catch (error) {
        console.error("❌ Error al corregir la tarea:", error);
        alert("❌ No se pudo corregir la tarea.");
    }
    }

  return {
    handleTomarTarea,
    handleLiberarTarea,
    handleFinalizarTarea,
    handleDevolverTarea,
    handleCancelarTarea,
    handleCorregirTarea,
  };
}
