import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/dashboard.css";
import { validarPassword, validarTextoLetras, validarEmail } from "../../utils/validaciones";
import useValidacionCampo from "../../hooks/useValidacionCampo";

export default function GestionUsuarios() {
  // Obtiene información del usuario autenticado
  const { user, logout } = useAuth();

  // Estados para manejar datos de usuarios, carga, errores y búsqueda
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 5;
  const nombre = useValidacionCampo("", validarTextoLetras, "Solo se permiten letras y espacios");
  const email = useValidacionCampo("", validarEmail, "Correo electrónico no válido");
  const password = useValidacionCampo("", validarPassword, "Contraseña debe tener 8 caracteres, una letra mayúscula y una letra minúscula, como mínimo")

  // Estado para manejar datos del nuevo usuario y edición
  const [nuevoUsuario, setNuevoUsuario] = useState({ 
    nombre: "", 
    email: "", 
    password: "", 
    rol: "" 
  });
  
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);

  // Función para validar la contraseña en tiempo real
  const validatePassword = (password) => {
    if (!validarPassword(password)) {
      setError((prev) => ({
        ...prev,
        password: "Debe tener 8 caracteres, incluir mayúscula, minúscula y número"
      }));
      return false;
    } else {
      setError((prev) => {
        const newErrors = { ...prev };
        delete newErrors.password;
        return newErrors;
      });
      return true;
    }
  };
  
  // Efecto para cargar los usuarios al montar el componente
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

  // Función para eliminar un usuario
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

  // Función para agregar un usuario nuevo
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
      handleCerrarModalAgregar();
    } catch (error) {
    
      alert(`❌ Error al agregar usuario. ${ error.response.data?.mensaje}`);
    }
  }

  // Función para guardar cambios en un usuario editado
  async function handleGuardarEdicion(e) {
    e.preventDefault();
  
    if (!usuarioEditando) return;
  
    try {
      const response = await api.put(`/usuarios/${usuarioEditando.id}`, {
        nombre: usuarioEditando.nombre,
        email: usuarioEditando.email,
        rol: usuarioEditando.rol,
      });
  
      if (response.status === 200) {
        console.log("✅ Usuario actualizado en la base de datos:", response.data.usuario);
  
        // 🚀 ACTUALIZA EL ESTADO PARA REFLEJAR EL CAMBIO
        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((u) => (u.id === usuarioEditando.id ? response.data.usuario : u))
        );
  
        alert("✅ Usuario actualizado correctamente");
  
        // 🚀 CIERRA EL MODAL
        setUsuarioEditando(null);
      }
    } catch (error) {
      console.log(error);
      console.error("❌ Error al actualizar usuario:", error);
      alert(`❌ No se pudo actualizar el usuario. ${ error.response.data?.mensaje}`);
    }
  }
  
// Funciones para abrir y cerrar modales
  function handleAbrirModal(usuario) {
    setUsuarioEditando({ ...usuario });
  }

  function handleCerrarModal() {
    setUsuarioEditando(null);
  }

  function handleAbrirModalAgregar() {
    setMostrarModalAgregar(true);
  }

  function handleCerrarModalAgregar() {
    setNuevoUsuario({
      nombre: "",
      email: "",
      rol: "",
    });
    setMostrarModalAgregar(false);
  }

  // Filtrar usuarios en base a la búsqueda
  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.rol.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Reiniciar paginación cuando cambia la búsqueda
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  // Configuración de paginación
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const usuariosPaginados = usuariosFiltrados.slice((paginaActual - 1) * usuariosPorPagina, paginaActual * usuariosPorPagina);

  return (
  <div className="dashboard-main">
    <h2>Gestión de Usuarios</h2>

    {/* 🔥 Barra superior: Botón de agregar usuario + Búsqueda */}
    <div className="top-actions">
      <button className="btn-agregar" onClick={handleAbrirModalAgregar}>
        ➕ Agregar Usuario
      </button>
      <input 
        type="text" 
        placeholder="Buscar usuario..." 
        value={busqueda} 
        onChange={(e) => setBusqueda(e.target.value)} 
        className="busqueda-input" 
      />
    </div>

    {/* 🔹 Tabla de usuarios */}
    <div className="table-responsive">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosPaginados.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre || "—"}</td>
              <td>{usuario.email || "—"}</td>
              <td>{usuario.rol || "—"}</td>
              <td>
                <div style={{ display: "flex", gap: "1px", justifyContent: "left" }}>
                  <button onClick={() => handleAbrirModal(usuario)} className="edit-button">✏️Editar</button>
                  <button onClick={() => handleEliminar(usuario.id)} className="btn-eliminar">🗑Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* 🔹 Modal de crear usuario */}
    {mostrarModalAgregar && (
      <div className="centro-modal">
        <div className="modal-content">
          <h3>Crear Usuario</h3>
          <form onSubmit={handleAgregarUsuario } className="gestion-form-global" autocomplete="off">
            <input 
              type="text" 
              placeholder="Nombre" 
              value={nombre.valor} 
              onChange={(e) => {
                nombre.onChange(e);
                setNuevoUsuario((prev) => ({ ...prev, nombre: e.target.value }));
              }}
              required 
            />
            {nombre.error && <p classname="error-message">{nombre.error}</p>}

            <input 
              type="email" 
              placeholder="Correo" 
              value={email.valor}
              onChange={(e) => {
                email.onChange(e);
                setNuevoUsuario((prev) => ({ ...prev, email: e.target.value }));
              }}
              required
              autocomplete="off" 
            />
            {email.error && <p className="error-message">{email.error}</p>}

            <input 
              type="password" 
              placeholder="Contraseña" 
              value={nuevoUsuario.password} 
              onChange={(e) => {
                const value = e.target.value;
                setNuevoUsuario({ ...nuevoUsuario, password: value });
                validatePassword(value); // asumes que ya usas esta función
              }} 
              required 
              autocomplete="new-password"
            />
            {error?.password && <p className="error-message">{error.password}</p>}

            <select 
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })} 
              value={nuevoUsuario.rol} 
              required
            >
              <option value="">Seleccione un ROL</option>
              <option value="Clientes">Clientes</option>
              <option value="Gerencia">Gerencia</option>
              <option value="Ventas">Ventas</option>
              <option value="Oficina Técnica">Oficina Técnica</option>
              <option value="Almacén">Almacén</option>
              <option value="Administración">Administración</option>
            </select>
            
            <button 
              type="submit" 
              className="btn-guardar" 
              disabled={
                !!error?.password ||
                !!nombre.error ||
                !!email.error ||
                !nombre.valor ||
                !email.valor ||
                !nuevoUsuario.password ||
                !nuevoUsuario.rol
              }
            >
              Guardar Usuario
            </button>
            <button type="button" className="btn-cancelar" onClick={handleCerrarModalAgregar}>Cancelar</button>
          </form>
        </div>
      </div>
    )}

    {/* 🔹 Modal de edición */}
    {usuarioEditando && (
      <div className="centro-modal">
        <div className="modal-content">
          <h3>Editar Usuario</h3>
          <form onSubmit={handleGuardarEdicion} className="gestion-form-global">
          <input 
              type="text" 
              placeholder="Nombre" 
              value={usuarioEditando.nombre} 
              onChange={(e) => {
                const value = e.target.value;
                setUsuarioEditando((prev) => ({ ...prev, nombre: value }));

                if (!validarTextoLetras(value)){
                  setError((prev) => ({
                    ...prev,
                    nombre: "Solo se permiten letras y espacios",
                  }));
                } else {
                  setError((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.nombre;
                    return newErrors;
                  });
                }
              }} 
              required 
            />
            {error?.nombre && <p classname="error-message">{error.nombre}</p>}

            <input 
              type="email" 
              placeholder="Correo" 
              value={usuarioEditando.email} 
              onChange={(e) => {
                const value = e.target.value;
                setUsuarioEditando((prev) => ({ ...prev, email: value }));
                
                if (!validarEmail(value)) {
                  setError((prev) => ({
                    ...prev,
                    email: "Correo electrónico no válido",
                  }));
                } else {
                  setError((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.email;
                    return newErrors;
                  });
                }
              }}
              required 
            />

            {error?.email && <p classname="error-message">{error.email}</p>}

            <select 
              value={usuarioEditando.rol} 
              onChange={(e) => setUsuarioEditando({ ...usuarioEditando, rol: e.target.value })} 
              required
            >
              <option value="Clientes">Clientes</option>
              <option value="Gerencia">Gerencia</option>
              <option value="Ventas">Ventas</option>
              <option value="Oficina Técnica">Oficina Técnica</option>
              <option value="Almacén">Almacén</option>
              <option value="Administración">Administración</option>
            </select>
            
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