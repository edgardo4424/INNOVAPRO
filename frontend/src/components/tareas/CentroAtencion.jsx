import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/centroAtencion.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useTareaActions from "../../hooks/useTareaActions";


export default function CentroAtencion() {
  // Obtiene información del usuario autenticado
  const { user } = useAuth();
  
  // Estados para manejar datos de tareas
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

  // 🔹 Cargar tareas según el estado seleccionado
  useEffect(() => {
    async function fetchTareas() {
      try {
        let url = "/tareas";
        if (filtroEstado === "Devuelta") url = "/tareas/devueltas"; // 🔥 Nueva API para devueltas

        const res = await api.get(url);
        setTareas(res.data);
      } catch (error) {
        console.error("❌ Error al obtener tareas:", error);
      }
    }
    fetchTareas();
    const intervalo = setInterval(fetchTareas, 10000); // 🔄 Actualiza cada 10s
    return () => clearInterval(intervalo);
  }, [filtroEstado]);

  // 🔹 Función para ordenar tareas por campo
  const ordenarTareas = (campo) => {
    const ordenActual = orden === "asc" ? 1 : -1;
    const nuevoOrden = orden === "asc" ? "desc" : "asc";
  
    const sorted = [...tareas].sort((a, b) => {
      const valorA = campo.includes(".") ? campo.split(".").reduce((o, i) => o?.[i], a) : a[campo];
      const valorB = campo.includes(".") ? campo.split(".").reduce((o, i) => o?.[i], b) : b[campo];
  
      if (!valorA || !valorB) return 0;
  
      return valorA.toString().localeCompare(valorB.toString()) * ordenActual;
    });
  
    setOrden(nuevoOrden);
    setColumnaOrdenada(campo);
    setTareas(sorted);
  };
  
  // 🔹 Función para cambiar de pestaña (filtrado por estado)
  const cambiarFiltro = (estado) => {
    setFiltroEstado(estado);
    setPaginaActual(1);
  };

  
// 🔹 Función para filtrar tareas con búsqueda por ID, texto y rango de fechas
const filtrarTareas = (tarea) => {
  const busquedaLower = busqueda.toLowerCase();

  // 🔥 Si hay una búsqueda por ID, buscar coincidencias exactas o parciales
  const coincideID = tarea.id?.toString().includes(busqueda.trim());

  // 🔥 Si hay una búsqueda por texto, verificar coincidencias en los campos relevantes
  const coincideTexto =
    tarea.cliente?.razon_social?.toLowerCase().includes(busquedaLower) ||
    tarea.obra?.nombre?.toLowerCase().includes(busquedaLower) ||
    tarea.tipoTarea?.toLowerCase().includes(busquedaLower) ||
    (tarea.usuario_solicitante && tarea.usuario_solicitante.nombre?.toLowerCase().includes(busquedaLower)) ||
    (tarea.tecnico_asignado && tarea.tecnico_asignado.nombre?.toLowerCase().includes(busquedaLower));

  // 🔥 Asegurar que `tarea.fecha_creacion` existe y tiene valor
  if (!tarea.fecha_creacion) {
    console.warn("⚠️ Tarea sin fecha_creacion:", tarea);
    return coincideTexto || coincideID; // Si no hay fecha, solo filtrar por texto/ID
  }

  // 🔥 Convertir la fecha de la tarea a `YYYY-MM-DD`
  const fechaTarea = new Date(tarea.fecha_creacion).toISOString().split("T")[0];

  // 🔥 Convertir fechas del filtro a `YYYY-MM-DD`
  const convertirFecha = (fecha) => {
    if (!fecha) return null;
    return fecha.toISOString().split("T")[0];
  };

  const fechaInicio = convertirFecha(fechaFiltroInicio);
  const fechaFin = convertirFecha(fechaFiltroFin);


  // 🔥 Comparar fechas correctamente
  const coincideFecha =
    (!fechaInicio || fechaTarea >= fechaInicio) &&
    (!fechaFin || fechaTarea <= fechaFin);

  // 🔥 Retornar verdadero si coincide con el texto/ID o si entra en el rango de fechas
  return (coincideTexto || coincideID) && coincideFecha;
};
  
  // 🔹 Función para seleccionar una tarea
  const handleSeleccionarTarea = (tarea) => {
    setTareaSeleccionada(tarea);
  };

  // 🔹 Función para cerrar detalles de la tarea
  const handleCerrarDetalle = () => {
    setTareaSeleccionada(null);
  };

  // Función para cambiar de página
  const cambiarPagina = (numero) => setPaginaActual(numero);

  // Calcular índices de las tareas a mostrar
  const indexUltimaTarea = paginaActual * tareasPorPagina;
  const indexPrimeraTarea = indexUltimaTarea - tareasPorPagina;
  const tareasFiltradas = tareas
  .filter((tarea) => tarea.estado === filtroEstado)
  .filter((tarea) => (busqueda ? filtrarTareas(tarea) : true))
  .slice(indexPrimeraTarea, indexUltimaTarea);

  const totalPaginas = Math.ceil(
    tareas.filter((tarea) => tarea.estado === filtroEstado)
          .filter((tarea) => (busqueda ? filtrarTareas(tarea) : true))
          .length / tareasPorPagina
  );

  // Inicializamos el hook de tareas 
  const {
    handleTomarTarea,
    handleLiberarTarea,
    handleFinalizarTarea,
    handleDevolverTarea,
    handleCancelarTarea,
    handleCorregirTarea,
  } = useTareaActions({
    tareas,
    setTareas,
    tareaSeleccionada,
    handleCerrarDetalle,
    user,
  });

  return (
    <div className="centro-atencion-container">
      <h2>Centro de Atención - Oficina Técnica</h2>

      {/* 🔹 Barra de búsqueda mejorada */}
      <div className="busqueda-container">
        {/* 🔥 Input de búsqueda por texto o ID */}
        <input
          type="text"
          placeholder="Buscar tarea..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="busqueda-input"
        />

        {/* 🔥 Filtro por fecha de inicio */}
        <DatePicker
          selected={fechaFiltroInicio}
          onChange={(date) => {
            setFechaFiltroInicio(date);
          }}
          selectsStart
          startDate={fechaFiltroInicio}
          endDate={fechaFiltroFin}
          placeholderText="Fecha inicio"
          className="busqueda-input"
          dateFormat="yyyy-MM-dd"
        />

        {/* 🔥 Filtro por fecha de fin */}
        <DatePicker
          selected={fechaFiltroFin}
          onChange={(date) => {
            setFechaFiltroFin(date);
          }}
          selectsEnd
          startDate={fechaFiltroInicio}
          endDate={fechaFiltroFin}
          minDate={fechaFiltroInicio}
          placeholderText="Fecha fin"
          className="busqueda-input"
          dateFormat="yyyy-MM-dd"
        />

      </div>

      {/* 🔹 Sub-pestañas para filtrar */}
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

      {/* 🔹 Tabla de tareas filtradas */}
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
          <th 
            onClick={() => ordenarTareas("id")} 
            className={`sortable ${columnaOrdenada === "id" ? "active" : ""}`}
            data-order={columnaOrdenada === "id" ? (orden === "asc" ? "⬆️" : "⬇️") : "↕️"}
          >
            ID
          </th>
          <th 
            onClick={() => ordenarTareas("cliente.razon_social")} 
            className={`sortable ${columnaOrdenada === "cliente.razon_social" ? "active" : ""}`}
            data-order={columnaOrdenada === "cliente.razon_social" ? (orden === "asc" ? "⬆️" : "⬇️") : "↕️"}
          >
            Cliente
          </th>
          <th 
            onClick={() => ordenarTareas("obra.nombre")} 
            className={`sortable ${columnaOrdenada === "obra.nombre" ? "active" : ""}`}
            data-order={columnaOrdenada === "obra.nombre" ? (orden === "asc" ? "⬆️" : "⬇️") : "↕️"}
          >
            Obra
          </th>
          <th 
            onClick={() => ordenarTareas("usuario_solicitante")} 
            className={`sortable ${columnaOrdenada === "usuario_solicitante" ? "active" : ""}`}
            data-order={columnaOrdenada === "usuario_solicitante" ? (orden === "asc" ? "⬆️" : "⬇️") : "↕️"}
          >
            Comercial
          </th>
          <th 
            onClick={() => ordenarTareas("tipoTarea")} 
            className={`sortable ${columnaOrdenada === "tipoTarea" ? "active" : ""}`}
            data-order={columnaOrdenada === "tipoTarea" ? (orden === "asc" ? "⬆️" : "⬇️") : "↕️"}
          >
            Tarea
          </th>
          <th 
            onClick={() => ordenarTareas("fecha_creacion")} 
            className={`sortable ${columnaOrdenada === "fecha_creacion" ? "active" : ""}`}
            data-order={columnaOrdenada === "fecha_creacion" ? (orden === "asc" ? "⬆️" : "⬇️") : "↕️"}
          >
            Fecha
          </th>
            <th>Estado</th>
            <th>Asignada A</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {tareasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="9">No hay tareas en este estado.</td>
              </tr>
            ) : (
              tareasFiltradas.map((tarea) => (
              <tr key={tarea.id}>
              <td>{tarea.id}</td>
              <td>{tarea.cliente?.razon_social || "-"}</td>
              <td>{tarea.obra?.nombre || "-"}</td>
              <td>{tarea.usuario_solicitante?.nombre || "Desconocido"}</td>
              <td>{tarea.tipoTarea}</td>
              <td>{new Date(tarea.fecha_creacion).toLocaleString()}</td>

              {/* Estado con Color */}
                <td>
                <span className={`estado estado-${tarea.estado.toLowerCase().replace(" ", "-")}`}>
                    {tarea.estado}
                </span>
                </td>

                <td>{tarea.tecnico_asignado?.nombre || "Sin asignar"}</td>

                <td>
                  <button onClick={() => handleSeleccionarTarea(tarea)} className="edit-button">Ver Detalles</button>
                </td>
            </tr>
          ))
        )}
        </tbody>
      </table>
    </div>

    {tareaSeleccionada && (
        <div className="centro-modal">
          <div className="modal-content">
            <h3>Detalles de la Tarea</h3>
            <div className="detalles-tarea">
                <p><strong>Cliente:</strong> {tareaSeleccionada.cliente?.razon_social}</p>
                <p><strong>Obra:</strong> {tareaSeleccionada.obra?.nombre}</p>
                <p><strong>Ubicación:</strong> {tareaSeleccionada.ubicacion}</p>
                <p><strong>Comercial:</strong> {tareaSeleccionada.usuario_solicitante?.nombre || "Desconocido"}</p>
                <p><strong>Tarea:</strong> {tareaSeleccionada.tipoTarea}</p>
                <p><strong>Fecha Creación:</strong> {new Date(tareaSeleccionada.fecha_creacion).toLocaleString()}</p>            
            </div>

            {/* 🔹 Sección para mostrar detalles específicos */}
            {tareaSeleccionada.detalles && Object.keys(tareaSeleccionada.detalles).length > 0 && (
            <div className="tarea-detalles">
                <h4>Detalles Específicos</h4>
                <ul>
                {Object.entries(tareaSeleccionada.detalles)
                    .sort(([keyA], [keyB]) => {
                    // Define el orden manualmente para las claves importantes
                    const orden = [
                        "apoyoTecnico", "apoyoAdministrativo", "tipoServicio", 
                        "estadoPasePedido",
                        "numeroVersionContrato", "despacho", "tipoOperacion",
                        "estadoHabilitacion", "obraNueva", "valorizacionAdelantada",
                        "transporte", "fechaEntrega", "horaEntrega",
                        "adaptarMotor", "tipoServicioColgante", "valorizacion",
                        "envioCliente", "tipoModulacion", "tipoEquipo", 
                        "plataformado", "anclajes", "uso",
                        "infoAdicional", "nota"
                    ];
                    const indexA = orden.indexOf(keyA);
                    const indexB = orden.indexOf(keyB);
                    if (indexA === -1 && indexB === -1) return keyA.localeCompare(keyB); // Ordenar alfabéticamente si no están en la lista
                    if (indexA === -1) return 1; // Si `keyA` no está en la lista, va después
                    if (indexB === -1) return -1; // Si `keyB` no está en la lista, va después
                    return indexA - indexB; // Orden personalizado
                    })
                    .map(([key, value], index) => (
                    <li key={index}><strong>{key}:</strong> {Array.isArray(value) ? value.join(", ") : value}</li>
                    ))}
                </ul>
            </div>
            )}

            {/*  Siempre mostrar si existen */}
            {tareaSeleccionada.motivoDevolucion && (
              <div className="tarea-detalles">
                <h4>📌 Motivo de Devolución</h4>
                  <p className="motivo-devuelto">{tareaSeleccionada.motivoDevolucion}</p>
              </div>
            )}

            {tareaSeleccionada.correccionComercial && (
              <div className="tarea-detalles">
                <h4>✏️ Corrección del Comercial</h4>
                  <p className="correccion-comercial">{tareaSeleccionada.correccionComercial}</p>
              </div>
            )}            

            {/* Estado editable SOLO para Oficina Técnica */}
            {user.rol === "Oficina Técnica" && (
              <>
                {/* 🔹 Si la tarea está pendiente y nadie la ha tomado */}
                {tareaSeleccionada.estado === "Pendiente" && !tareaSeleccionada.asignadoA && (
                  <div className="button-group">
                    <button onClick={handleTomarTarea} className="button primary-button">
                      Tomar Tarea
                    </button>
                  </div>
                )}

                {/* 🔹 Si la tarea está en proceso y fue tomada por el usuario actual */}
                {tareaSeleccionada.asignadoA === user.id && tareaSeleccionada.estado === "En proceso" && (
                  <>
                    <div className="button-group">
                      <button onClick={handleLiberarTarea} className="button secondary-button">
                        Liberar
                      </button>
                      <button onClick={handleFinalizarTarea} className="button primary-button">
                        Finalizar
                      </button>
                      <button onClick={handleDevolverTarea} className="button warning-button">
                        Devolver
                      </button>
                      <button onClick={handleCancelarTarea} className="button danger-button">
                        Anular
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {/* 🔹 Si la tarea fue devuelta y el usuario es el comercial que la creó */}
            {user.rol === "Ventas" && tareaSeleccionada.estado === "Devuelta" && tareaSeleccionada.usuario_solicitante?.id === user.id && (
              <div className="button-group">
                <button onClick={handleCorregirTarea} className="button primary-button">
                  Corregir Tarea
                </button>
              </div>
            )}


          <button onClick={handleCerrarDetalle} className="close-button">×</button>
          </div>
        </div>
      )}

    {/* 🔹 Paginación */}
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