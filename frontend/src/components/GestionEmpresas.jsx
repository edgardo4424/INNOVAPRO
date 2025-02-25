import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function GestionEmpresas() {
  const { user, logout } = useAuth();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const empresasPorPagina = 5;
  const [nuevaEmpresa, setNuevaEmpresa] = useState({
    razon_social: "",
    ruc: "",
    direccion: "",
    representante_legal: "",
    dni_representante: "",
    cargo_representante: "",
    telefono_representante: "",
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [empresaEditando, setEmpresaEditando] = useState(null);

  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const res = await api.get("/empresas_proveedoras");
        setEmpresas(res.data || []);
      } catch (error) {
        console.error("❌ Error al obtener empresas:", error);
        setError(null);
      } finally {
        setLoading(false);
      }
    }
    fetchEmpresas();
  }, []);

  async function handleEliminar(id) {
    if (!window.confirm("¿Seguro que quieres eliminar esta empresa?")) return;
    try {
      await api.delete(`/empresas_proveedoras/${id}`);
      setEmpresas(empresas.filter((e) => e.id !== id));
      alert("✅ Empresa eliminada con éxito");
    } catch (error) {
      console.error("❌ Error al eliminar empresa:", error);
    }
  }

  async function handleAgregarEmpresa(e) {
    e.preventDefault();
    try {
        const empresaConUsuario = { ...nuevaEmpresa, creado_por: user.id }; // 🔥 Agregamos el usuario actual
        const res = await api.post("/empresas_proveedoras", empresaConUsuario);
        setEmpresas([...empresas, res.data]);
        setNuevaEmpresa({
            razon_social: "",
            ruc: "",
            direccion: "",
            representante_legal: "",
            dni_representante: "",
            cargo_representante: "",
            telefono_representante: "",
        });
        alert("✅ Empresa agregada con éxito");
    } catch (error) {
        console.error("❌ Error al agregar empresa:", error);
        alert("❌ Error al agregar empresa.");
    }
}

async function handleGuardarEdicion() {
    if (!empresaEditando) return;
    try {
        await api.put(`/empresas_proveedoras/${empresaEditando.id}`, empresaEditando);
        setEmpresas(empresas.map((e) => (e.id === empresaEditando.id ? empresaEditando : e)));
        alert("✅ Empresa actualizada correctamente");
        setEmpresaEditando(null);
    } catch (error) {
        console.error("❌ Error al editar empresa:", error);
        alert("❌ No se pudo actualizar la empresa.");
    }
}

  function handleAbrirModal(empresa) {
    setEmpresaEditando({ ...empresa });
  }

  function handleCerrarModal() {
    setEmpresaEditando(null);
  }

  const empresasFiltradas = empresas.filter(
    (e) =>
      e.razon_social.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.ruc.includes(busqueda)
  );

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const totalPaginas = Math.ceil(empresasFiltradas.length / empresasPorPagina);
  const empresasPaginadas = empresasFiltradas.slice((paginaActual - 1) * empresasPorPagina, paginaActual * empresasPorPagina);

  return (
    <div className="dashboard-main">
        <h2>Gestión de Empresas Proveedoras</h2>

        {/* 🔥 Barra superior: Botón de agregar empresa + Búsqueda */}
        <div className="top-actions">
            <button className="add-button" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
                {mostrarFormulario ? "Cerrar Formulario" : "Agregar Empresa"}
            </button>
            <input type="text" placeholder="Buscar empresa..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="busqueda-input" />
        </div>

        {/* 🔹 Formulario de agregar empresa */}
        {mostrarFormulario && (
            <form onSubmit={handleAgregarEmpresa} className="gestion-empresas-form">
                <input type="text" placeholder="Razón Social" value={nuevaEmpresa.razon_social} onChange={(e) => setNuevaEmpresa({ ...nuevaEmpresa, razon_social: e.target.value })} required />
                <input type="text" placeholder="RUC" value={nuevaEmpresa.ruc} onChange={(e) => setNuevaEmpresa({ ...nuevaEmpresa, ruc: e.target.value })} required />
                <input type="text" placeholder="Dirección" value={nuevaEmpresa.direccion} onChange={(e) => setNuevaEmpresa({ ...nuevaEmpresa, direccion: e.target.value })} required />
                <input type="text" placeholder="Representante Legal" value={nuevaEmpresa.representante_legal} onChange={(e) => setNuevaEmpresa({ ...nuevaEmpresa, representante_legal: e.target.value })} required />
                <input type="text" placeholder="DNI Representante" value={nuevaEmpresa.dni_representante} onChange={(e) => setNuevaEmpresa({ ...nuevaEmpresa, dni_representante: e.target.value })} required />
                <input type="text" placeholder="Cargo Representante" value={nuevaEmpresa.cargo_representante} onChange={(e) => setNuevaEmpresa({ ...nuevaEmpresa, cargo_representante: e.target.value })} required />
                <input type="text" placeholder="Teléfono Representante" value={nuevaEmpresa.telefono_representante} onChange={(e) => setNuevaEmpresa({ ...nuevaEmpresa, telefono_representante: e.target.value })} required />
                <button type="submit">Guardar Empresa</button>
            </form>
        )}

        {/* 🔹 Tabla de empresas */}
        <div className="table-responsive">
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Razón Social</th>
                        <th>RUC</th>
                        <th>Dirección</th>
                        <th>Representante Legal</th>
                        <th>DNI Representante</th>
                        <th>Cargo Representante</th>
                        <th>Teléfono Representante</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empresasPaginadas.map((empresa) => (
                        <tr key={empresa.id}>
                            <td>{empresa.id}</td>
                            <td>{empresa.razon_social}</td>
                            <td>{empresa.ruc}</td>
                            <td>{empresa.direccion}</td>
                            <td>{empresa.representante_legal}</td>
                            <td>{empresa.dni_representante}</td>
                            <td>{empresa.cargo_representante}</td>
                            <td>{empresa.telefono_representante}</td>
                            <td>
                                <button onClick={() => handleAbrirModal(empresa)} className="edit-button">✏️</button>
                                <button onClick={() => handleEliminar(empresa.id)} className="delete-button">🗑</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* 🔹 Paginación */}
        <div className="pagination">
            <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>⬅ Anterior</button>
            <span>Página {paginaActual} de {totalPaginas}</span>
            <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>Siguiente ➡</button>
        </div>

        {/* 🔹 Modal de edición */}
        {empresaEditando && (
            <div className="modal">
                <div className="modal-content">
                    <h3>Editar Empresa</h3>
                    <input type="text" value={empresaEditando.razon_social} onChange={(e) => setEmpresaEditando({ ...empresaEditando, razon_social: e.target.value })} />
                    <input type="text" value={empresaEditando.ruc} onChange={(e) => setEmpresaEditando({ ...empresaEditando, ruc: e.target.value })} />
                    <input type="text" value={empresaEditando.direccion} onChange={(e) => setEmpresaEditando({ ...empresaEditando, direccion: e.target.value })} />
                    <input type="text" value={empresaEditando.representante_legal} onChange={(e) => setEmpresaEditando({ ...empresaEditando, representante_legal: e.target.value })} />
                    <input type="text" value={empresaEditando.dni_representante} onChange={(e) => setEmpresaEditando({ ...empresaEditando, dni_representante: e.target.value })} />
                    <input type="text" value={empresaEditando.cargo_representante} onChange={(e) => setEmpresaEditando({ ...empresaEditando, cargo_representante: e.target.value })} />
                    <input type="text" value={empresaEditando.telefono_representante} onChange={(e) => setEmpresaEditando({ ...empresaEditando, telefono_representante: e.target.value })} />
                    
                    <button onClick={handleGuardarEdicion}>Guardar</button>
                    <button onClick={handleCerrarModal}>Cancelar</button>
                </div>
            </div>
        )}
    </div>
);
}