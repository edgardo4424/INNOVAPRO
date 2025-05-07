import useCentroAtencion from "../hooks/useCentroAtencion";
import TablaTareas from "../components/TablaTareas";
import DetalleTarea from "../components/DetalleTarea";
import DatePicker from "react-datepicker";
import ModuloNavegacion from "../../shared/components/ModuloNavegacion";
import "react-datepicker/dist/react-datepicker.css";

export default function CentroAtencion() {
  const {
    tareasFiltradas,
    paginaActual,
    totalPaginas,
    cambiarPagina,
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
    acciones
  } = useCentroAtencion();

  return (
    <div className="centro-atencion-container">

      <ModuloNavegacion />
      
      <h2>Centro de Atención - Oficina Técnica</h2>

      {/* Búsqueda y filtros */}
      <div className="busqueda-container">
        <input
          type="text"
          placeholder="Buscar tarea..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="busqueda-input"
        />
        <DatePicker
          selected={fechaFiltroInicio}
          onChange={(date) => setFechaFiltroInicio(date)}
          selectsStart
          startDate={fechaFiltroInicio}
          endDate={fechaFiltroFin}
          placeholderText="Fecha inicio"
          className="busqueda-input"
          dateFormat="yyyy-MM-dd"
        />
        <DatePicker
          selected={fechaFiltroFin}
          onChange={(date) => setFechaFiltroFin(date)}
          selectsEnd
          startDate={fechaFiltroInicio}
          endDate={fechaFiltroFin}
          minDate={fechaFiltroInicio}
          placeholderText="Fecha fin"
          className="busqueda-input"
          dateFormat="yyyy-MM-dd"
        />
      </div>

      {/* Tabs por estado */}
      <div className="estado-tabs">
        {["Pendiente", "En proceso", "Finalizada", "Cancelada", "Devuelta"].map((estado) => (
          <button
            key={estado}
            className={`tab-button ${filtroEstado === estado ? "active" : ""}`}
            onClick={() => cambiarFiltro(estado)}
          >
            {estado}
          </button>
        ))}
      </div>

      {/* Tabla de tareas */}
      <TablaTareas
        tareas={tareasFiltradas}
        ordenarTareas={ordenarTareas}
        columnaOrdenada={columnaOrdenada}
        orden={orden}
        onSeleccionarTarea={handleSeleccionarTarea}
      />

      {/* Modal de detalle */}
      {tareaSeleccionada && (
        <DetalleTarea
          tarea={tareaSeleccionada}
          onCerrar={handleCerrarDetalle}
          user={user}
          {...acciones}
        />
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="pagination">
          {[...Array(totalPaginas)].map((_, index) => (
            <button
              key={index}
              className={`page-button ${paginaActual === index + 1 ? "active" : ""}`}
              onClick={() => cambiarPagina(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}