import { useEffect, useState } from "react";
import Select from "react-select";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function GestionObras() {
  
  // Obtiene información del usuario autenticado
  const { user } = useAuth();
  
  // Restringe el acceso a Gerencia y Ventas
  if (!["Gerencia", "Ventas"].includes(user.rol)) return <p>No tienes acceso a este módulo.</p>;

  // Estados para manejar datos de las obras
  const [obras, setObras] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [ubicaciones, setUbicaciones] = useState([]);
  const estadosObra = [
    { value: "Planificación", label: "Planificación" },
    { value: "Demolición", label: "Demolición" },
    { value: "Excavación", label: "Excavación"},
    { value: "Cimentación y estructura", label: "Cimentación y estructura"},
    { value: "Cerramientos y albañilería", label: "Cerramientos y albañilería"},
    { value: "Acabados", label: "Acabados" },
    { value: "Entrega y postventa", label: "Entrega y postventa" },
  ];
  const [paginaActual, setPaginaActual] = useState(1);
  const obrasPorPagina = 5;

  // Estado para manejar datos de nuevas obras
  const [nuevaObra, setNuevaObra] = useState({
    nombre: "",
    direccion: "",
    ubicacion: "",
    estado: ""
  });

  const [obraEditando, setObraEditando] = useState(null);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);

  // Efecto para cargar las ubicaciones de Perú
  useEffect(() => {
    async function fetchEnums() {
      try {
        const resUbicaciones = await api.get("/obras/enum-ubicaciones");
        setUbicaciones(resUbicaciones.data.map(value => ({ value, label: value })));
      } catch (error) {
        console.error("❌ Error obteniendo ENUM ubicaciones:", error);
      }
    }
    fetchEnums();
  }, []);

    // Efecto para cargar las obras
  useEffect(() => {
    async function fetchData() {
      try {
        const resObras = await api.get("/obras");
        setObras(resObras.data || []);
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
      }
    }
    fetchData();
  }, []);

  // Función para eliminar una obra
  async function handleEliminar(id) {
    if (!window.confirm("¿Seguro que quieres eliminar esta obra?")) return;
    try {
      await api.delete(`/obras/${id}`);
      setObras(obras.filter((o) => o.id !== id));
      alert("✅ Obra eliminada con éxito");
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
    }
  }

  // Función para agregar un cliente nuevo
  async function handleAgregarObra(e) {
    e.preventDefault();
    try {
      if (!nuevaObra.nombre || !nuevaObra.direccion || !nuevaObra.ubicacion || !nuevaObra.estado) {
        alert("⚠️ Debes completar todos los campos.");
        return;
      }

      await api.post("/obras", nuevaObra);
      alert("✅ Obra creada con éxito");

      const resObras = await api.get("/obras");
      setObras(resObras.data);

      handleCerrarModalAgregar();
    } catch (error) {
      console.error("❌ Error al agregar obra:", error);
      
      if (error.response) {
        alert(`❌ Error: ${error.response.status} - ${error.response.data.error}`);
    } else {
        alert("❌ Error desconocido al agregar la obra.");
    }

    }
  }

  // Función para guardar cambios en un contacto editado
  async function handleGuardarEdicion(e) {
    e.preventDefault();
    if (!obraEditando) return;

    try {
      await api.put(`/obras/${obraEditando.id}`, obraEditando);
      alert("✅ Obra actualizada correctamente");

      const resObras = await api.get("/obras");
      setObras(resObras.data);

      handleCerrarModal();
    } catch (error) {
      console.error("❌ Error al editar obra:", error);
      alert("❌ No se pudo actualizar la obra.");
    }
  }

  // Funciones para abrir y cerrar modales
  function handleAbrirModal(obra) {
    setObraEditando({ ...obra    });
  }

  function handleCerrarModal() {
    setObraEditando(null);
  }

  function handleAbrirModalAgregar() {
    setMostrarModalAgregar(true);
  }

  function handleCerrarModalAgregar() {
    setNuevaObra({ 
      nombre: "", 
      direccion: "", 
      ubicacion: "", 
      estado: "" 
    });
    setMostrarModalAgregar(false);
  }

  // Filtrar obras en base a la búsqueda
  const obrasFiltradas = obras.filter(
    (o) => 
      o.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      o.direccion.toLowerCase().includes(busqueda.toLowerCase()) ||
      o.ubicacion.toLowerCase().includes(busqueda.toLowerCase()) ||
      o.estado.toLowerCase().includes(busqueda.toLowerCase())
  );
  
  // Reiniciar paginación cuando cambia la búsqueda
  useEffect(() => {
    setPaginaActual(1);  // 🔥 Cada vez que cambia la búsqueda, vuelve a la primera página
  }, [busqueda]);
  
  // Configuración de paginación
  const totalPaginas = Math.ceil(obrasFiltradas.length / obrasPorPagina);
  const obrasPaginadas = obrasFiltradas.slice((paginaActual - 1) * obrasPorPagina, paginaActual * obrasPorPagina);  
  
  return (
    <div className="dashboard-main">
      <h2>Gestión de Obras</h2>

      {/* 🔥 Barra superior: Botón de agregar obra + Búsqueda */}
      <div className="top-actions">
          <button className="btn-agregar" onClick={handleAbrirModalAgregar}>
            ➕ Agregar Obra
          </button>
          <input 
            type="text" 
            placeholder="Buscar obra..." 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            className="busqueda-input" 
          />
        </div>

      {/* 🔹 Tabla de clientes */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {obrasPaginadas.map((obra) => (
              <tr key={obra.id}>
                <td>{obra.nombre}</td>
                <td>{obra.direccion}</td>
                <td>{obra.ubicacion}</td>
                <td>{obra.estado}</td>
                <td>
                  <div style={{ display: "flex", gap: "1px", justifyContent: "left" }}>
                    <button onClick={() => handleAbrirModal(obra)} className="edit-button">✏️Editar</button>
                    <button onClick={() => handleEliminar(obra.id)} className="btn-eliminar">🗑Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Agregar Obra */}
      {mostrarModalAgregar && (
          <div className="centro-modal">
            <div className="modal-content">
              <h3>Agregar Obra</h3>
              <form onSubmit={handleAgregarObra} className="gestion-form-global">
                  
                  {/* Razon Social/Nombre - Solo letras y espacios */}
                  <input 
                      type="text" 
                      placeholder="Nombre del proyecto"
                      value={nuevaObra.nombre} 
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,-\s]/g, ""); // Ahora los espacios son válidos
                        setNuevaObra({ ...nuevaObra, nombre: value });
                      }} 
                    />

                  {/* Dirección - Permite letras, números y caracteres básicos */}
                  <input 
                    type="text" 
                    placeholder="Dirección" 
                    value={nuevaObra.direccion} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,-\s]/g, ""); // Ahora los espacios son válidos
                      setNuevaObra({ ...nuevaObra, direccion: value });
                    }} 
                  />

                  <div className="form-group">
                      <label>Ubicación</label>
                      <Select
                          options={ubicaciones}
                          onChange={(selected) => setNuevaObra({ ...nuevaObra, ubicacion: selected.value })}
                          placeholder="Selecciona la ubicación..."
                      />
                  </div>

                  <div className="form-group">
                      <label>Etapa de la obra</label>
                      <Select
                          options={estadosObra}
                          value={estadosObra.find(e => e.value === nuevaObra.estado) || null}
                          onChange={(selected) => setNuevaObra({ ...nuevaObra, estado: selected ? selected.value : "" })} // 🔥 Estado vacío si no selecciona
                          placeholder="Selecciona una etapa..."
                      />
                  </div>

                  <button type="submit" >Guardar Obra</button>
                  <button type="button" className="btn-cancelar" onClick={handleCerrarModalAgregar}>Cancelar</button>
              </form>
            </div>
          </div>
        )}

      {/* Modal de Editar Obra */}
        {obraEditando && (
          <div className="centro-modal">
            <div className="modal-content">
              <h3>Editar Obra</h3>
              <form onSubmit={handleGuardarEdicion} className="gestion-form-global">
                  
                {/* Nombre del proyecto - Solo letras y espacios */}
                <input 
                  type="text"
                  placeholder="Nombre del proyecto" 
                  value={obraEditando.nombre} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,-\s]/g, ""); // Ahora los espacios son válidos
                    setObraEditando({ ...obraEditando, nombre: value });
                  }} 
                />
                
                {/* Dirección - Permite letras, números y caracteres básicos */}
                <input 
                      type="text" 
                      placeholder="Dirección" 
                      value={obraEditando.direccion} 
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,-\s]/g, ""); // Ahora los espacios son válidos
                        setObraEditando({ ...obraEditando, direccion: value });
                      }} 
                />
                  <label>Ubicación</label>
                  <Select
                      options={ubicaciones}
                      value={ubicaciones.find(u => u.value === obraEditando?.ubicacion) || null}                    
                      onChange={(selected) => setObraEditando({ ...obraEditando, ubicacion: selected.value })}                    
                      placeholder="Selecciona una ubicación..."
                  />
      
                  <label>Etapa de la obra</label>
                  <Select 
                      options={estadosObra} // 🔥 Opciones predefinidas de estados
                      value={estadosObra.find(e => e.value === obraEditando?.estado) || null} // 🔥 Busca el estado actual
                      onChange={(selected) => setObraEditando({ ...obraEditando, estado: selected.value })}
                      placeholder="Selecciona una etapa..."
                  />

                  {/* Botones de acción */}
                  <button  className="btn-guardar">Guardar</button>
                  <button  className="btn-cancelar" onClick={handleCerrarModal}>Cancelar</button>
            </form>
            </div>
          </div>
        )}

      {/* 🔹 Paginación */}
      <div className="pagination">
        <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>⬅ Anterior</button>
        <span>Página {paginaActual} de {totalPaginas}</span>
        <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>Siguiente ➡</button>
      </div>
    </div>
  );
}