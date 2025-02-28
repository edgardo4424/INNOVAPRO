import { useEffect, useState } from "react";
import Select from "react-select";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function GestionObras() {
  const { user } = useAuth();
  if (!["Gerencia", "Ventas"].includes(user.rol)) return <p>No tienes acceso a este módulo.</p>;

  const [obras, setObras] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const obrasPorPagina = 5;
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [obraEditando, setObraEditando] = useState(null);
  const [ubicaciones, setUbicaciones] = useState([]);

  const [nuevaObra, setNuevaObra] = useState({
    nombre: "",
    direccion: "",
    ubicacion: "",
    estado: ""
  });

  const estadosObra = [
    { value: "Planificación", label: "Planificación" },
    { value: "Demolición", label: "Demolición" },
    { value: "Excavación", label: "Excavación"},
    { value: "Cimentación y estructura", label: "Cimentación y estructura"},
    { value: "Cerramientos y albañilería", label: "Cerramientos y albañilería"},
    { value: "Acabados", label: "Acabados" },
    { value: "Entrega y postventa", label: "Entrega y postventa" },
  ];

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

  useEffect(() => {
    async function fetchData() {
      try {
        const resObras = await api.get("/obras");
        const resClientes = await api.get("/clientes");

        setObras(resObras.data || []);
        setClientes(resClientes.data.filter(cliente => cliente.ruc)); // 🔥 Filtrar solo clientes empresa
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
      }
    }
    fetchData();
  }, []);

  function handleAbrirModalAgregar() {
    setNuevaObra({ 
        nombre: "", 
        direccion: "", 
        ubicacion: "", 
        estado: "" 
    });
    setMostrarModalAgregar(true);
  }

  function handleCerrarModalAgregar() {
    setMostrarModalAgregar(false);
  }

  function handleAbrirModal(obra) {
    setObraEditando({ ...obra    });
    setMostrarModal(true);
  }

  function handleCerrarModal() {
    setObraEditando(null);
    setMostrarModal(false);
  }

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

  const obrasFiltradas = obras.filter((o) => o.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  const totalPaginas = Math.ceil(obrasFiltradas.length / obrasPorPagina);
  const obrasPaginadas = obrasFiltradas.slice((paginaActual - 1) * obrasPorPagina, paginaActual * obrasPorPagina);

  return (
    <div className="dashboard-main">
      <h2>Gestión de Obras</h2>

      <div className="top-actions">
        <button className="add-button" onClick={handleAbrirModalAgregar}>➕ Agregar Obra</button>
        <input type="text" placeholder="Buscar obra..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="busqueda-input" />
      </div>

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
                <button onClick={() => handleAbrirModal(obra)} className="edit-button">✏️</button>
                <button onClick={() => handleEliminar(obra.id)} className="delete-button">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>⬅ Anterior</button>
        <span>Página {paginaActual} de {totalPaginas}</span>
        <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>Siguiente ➡</button>
      </div>

    {/* Modal de Agregar Obra */}
    {mostrarModalAgregar && (
        <div className="modal">
          <div className="modal-content">
            <h3>Agregar Obra</h3>
            <form onSubmit={handleAgregarObra} className="gestion-contactos-form">
                
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={nuevaObra.nombre} onChange={(e) => setNuevaObra({ ...nuevaObra, nombre: e.target.value })} required />
                </div>

                <div className="form-group">
                    <label>Dirección</label>
                    <input type="text" value={nuevaObra.direccion} onChange={(e) => setNuevaObra({ ...nuevaObra, direccion: e.target.value })} required />
                </div>

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

              <div className="modal-buttons">
                <button type="submit" className="btn-guardar">Guardar</button>
                <button type="button" className="btn-cancelar" onClick={handleCerrarModalAgregar}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    {/* Modal de Editar Obra */}
      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Obra</h3>
            <form onSubmit={handleGuardarEdicion} className="gestion-contactos-form">
                <input type="text" placeholder="Nombre" value={obraEditando?.nombre || ""} onChange={(e) => setObraEditando({ ...obraEditando, nombre: e.target.value })} required />
                <input type="text" placeholder="Dirección" value={obraEditando?.direccion || ""} onChange={(e) => setObraEditando({ ...obraEditando, direccion: e.target.value })} required />

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

              <button type="submit">Guardar</button>
            </form>
            <button onClick={handleCerrarModal}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}