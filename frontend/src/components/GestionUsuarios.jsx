import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function GestionUsuarios() {
  const { user, logout } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 5;
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", email: "", password: "", rol: "" });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const res = await api.get("/usuarios");
        setUsuarios(res.data.usuarios || []);
      } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
        setError(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, []);

  async function handleEliminar(id) {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      await api.delete(`/usuarios/${id}`);
      setUsuarios(usuarios.filter((u) => u.id !== id));
      alert("✅ Usuario eliminado con éxito");
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
    }
  }

  async function handleAgregarUsuario(e) {
    e.preventDefault();
    if (!nuevoUsuario.rol) {
      alert("❌ Debes seleccionar un rol.");
      return;
    }
    try {
      const res = await api.post("/usuarios", nuevoUsuario);
      setUsuarios([...usuarios, res.data.usuario]);
      setNuevoUsuario({ nombre: "", email: "", password: "", rol: "" });
      alert("✅ Usuario agregado con éxito");
    } catch (error) {
      console.error("❌ Error al agregar usuario:", error);
      alert("❌ Error al agregar usuario.");
    }
  }

  async function handleGuardarEdicion() {
    if (!usuarioEditando) return;
    try {
      await api.put(`/usuarios/${usuarioEditando.id}`, usuarioEditando);
      setUsuarios(usuarios.map((u) => (u.id === usuarioEditando.id ? usuarioEditando : u)));
      alert("✅ Usuario actualizado correctamente");
      setUsuarioEditando(null);
    } catch (error) {
      console.error("❌ Error al editar usuario:", error);
      alert("❌ No se pudo actualizar el usuario.");
    }
  }

  function handleAbrirModal(usuario) {
    setUsuarioEditando({ ...usuario });
  }

  function handleCerrarModal() {
    setUsuarioEditando(null);
  }

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.rol.toLowerCase().includes(busqueda.toLowerCase())
  );

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const usuariosPaginados = usuariosFiltrados.slice((paginaActual - 1) * usuariosPorPagina, paginaActual * usuariosPorPagina);

  return (
    <div className="gestion-usuarios">
      <h2>Gestión de Usuarios</h2>

      {/* 🔥 Barra superior: Botón de agregar usuario + Búsqueda */}
      <div className="top-actions">
        <button className="gestion-usuarios-btn" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? "Cerrar Formulario" : "Agregar Usuario"}
        </button>
        <input type="text" placeholder="Buscar usuario..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="busqueda-input" />
      </div>

      {/* 🔹 Formulario de agregar usuario */}
      {mostrarFormulario && (
        <form onSubmit={handleAgregarUsuario} className="gestion-usuarios-form">
          <input type="text" placeholder="Nombre" value={nuevoUsuario.nombre} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} required />
          <input type="email" placeholder="Correo" value={nuevoUsuario.email} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })} required />
          <input type="password" placeholder="Contraseña" value={nuevoUsuario.password} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })} required />
          <select onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })} value={nuevoUsuario.rol} required>
            <option value="">Seleccione un ROL</option>
            <option value="Clientes">Clientes</option>
            <option value="Gerencia">Gerencia</option>
            <option value="Ventas">Ventas</option>
            <option value="Oficina Técnica">Oficina Técnica</option>
            <option value="Almacén">Almacén</option>
            <option value="Administración">Administración</option>
          </select>
          <button type="submit">Guardar Usuario</button>
        </form>
      )}

      {/* 🔹 Tabla de usuarios */}
      <table className="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosPaginados.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>{usuario.rol}</td>
              <td>
                <button onClick={() => handleAbrirModal(usuario)} className="edit-button">✏️</button>
                <button onClick={() => handleEliminar(usuario.id)} className="delete-button">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Paginación */}
      <div className="pagination">
        <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>⬅ Anterior</button>
        <span>Página {paginaActual} de {totalPaginas}</span>
        <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>Siguiente ➡</button>
      </div>

      {/* 🔹 Modal de edición */}
      {usuarioEditando && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Usuario</h3>
            <input type="text" value={usuarioEditando.nombre} onChange={(e) => setUsuarioEditando({ ...usuarioEditando, nombre: e.target.value })} />
            <input type="email" value={usuarioEditando.email} onChange={(e) => setUsuarioEditando({ ...usuarioEditando, email: e.target.value })} />
            <select value={usuarioEditando.rol} onChange={(e) => setUsuarioEditando({ ...usuarioEditando, rol: e.target.value })}>
              <option value="Clientes">Clientes</option>
              <option value="Gerencia">Gerencia</option>
              <option value="Ventas">Ventas</option>
              <option value="Oficina Técnica">Oficina Técnica</option>
              <option value="Almacén">Almacén</option>
              <option value="Administración">Administración</option>
            </select>
            <button onClick={handleGuardarEdicion}>Guardar</button>
            <button onClick={handleCerrarModal}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}