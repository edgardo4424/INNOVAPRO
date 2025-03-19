import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function GestionEmpresas() {
  // Obtiene información del usuario autenticado
  const { user, logout } = useAuth();

  // Estados para manejar datos de empresas, carga, errores y búsqueda
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const empresasPorPagina = 5;

  // Estado para manejar datos de la nueva empresa y edición
  const [nuevaEmpresa, setNuevaEmpresa] = useState({
    razon_social: "",
    ruc: "",
    direccion: "",
    representante_legal: "",
    dni_representante: "",
    cargo_representante: "",
    telefono_representante: "",
    telefono_oficina: ""
  });

  const [empresaEditando, setEmpresaEditando] = useState(null);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);

  // Efecto para cargar las empresas al montar el componente
  useEffect(() => {
    async function fetchEmpresas() {
      try {
        const res = await api.get("/empresas_proveedoras");
        setEmpresas(res.data || []);
      } catch (error) {
        console.error("❌ Error al obtener filiales:", error);
        setError(null);
      } finally {
        setLoading(false);
      }
    }
    fetchEmpresas();
  }, []);

  // Función para eliminar una empresa
  async function handleEliminar(id) {
    if (!window.confirm("¿Seguro que quieres eliminar este filial?")) return;
    try {
      await api.delete(`/empresas_proveedoras/${id}`);
      setEmpresas(empresas.filter((e) => e.id !== id));
      alert("✅ Filial eliminado con éxito");
    } catch (error) {
      console.error("❌ Error al eliminar filial:", error);
    }
  }
  
  // Función para agregar una empresa nueva
  async function handleAgregarEmpresa(e) {
    e.preventDefault();
  
    try {
      const empresaConUsuario = { ...nuevaEmpresa, creado_por: user.id }; // Agregar usuario actual
      const res = await api.post("/empresas_proveedoras", empresaConUsuario);
  
      if (res.status === 201 || res.status === 200) { // Asegurarse de que la respuesta es correcta
        console.log("✅ Nueva filial agregada:", res.data);
  
        // 🔥 Crear un objeto asegurando la estructura correcta
        const nuevaEmpresaAgregada = {
          id: res.data.empresa?.id || res.data.id, // Tomar el ID de la respuesta, dependiendo del formato
          razon_social: res.data.empresa?.razon_social || empresaConUsuario.razon_social,
          ruc: res.data.empresa?.ruc || empresaConUsuario.ruc,
          direccion: res.data.empresa?.direccion || empresaConUsuario.direccion,
          representante_legal: res.data.empresa?.representante_legal || empresaConUsuario.representante_legal,
          dni_representante: res.data.empresa?.dni_representante || empresaConUsuario.dni_representante,
          cargo_representante: res.data.empresa?.cargo_representante || empresaConUsuario.cargo_representante,
          telefono_representante: res.data.empresa?.telefono_representante || empresaConUsuario.telefono_representante,
          telefono_oficina: res.data.empresa?.telefono_oficina || empresaConUsuario.telefono_oficina
        };
  
        // 🚀 Agregar la nueva empresa sin perder la lista actual
        setEmpresas((prevEmpresas) => [...prevEmpresas, nuevaEmpresaAgregada]);
  
        // Limpiar formulario
        setNuevaEmpresa({
          razon_social: "",
          ruc: "",
          direccion: "",
          representante_legal: "",
          dni_representante: "",
          cargo_representante: "",
          telefono_representante: "",
          telefono_oficina: ""
        });
  
        alert("✅ Filial agregada con éxito");
        handleCerrarModalAgregar();
      }
    } catch (error) {
      console.error("❌ Error al agregar filial:", error);
      alert("❌ Error al agregar filial.");
    }
  }
  

  // Función para guardar cambios en una empresa editada
  async function handleGuardarEdicion(e) {
    e.preventDefault();
  
    if (!empresaEditando) return;
  
    try {
      const response = await api.put(`/empresas_proveedoras/${empresaEditando.id}`, empresaEditando);
  
      if (response.status === 200) {
        console.log("✅ Filial actualizada en la base de datos:", response.data);
  
        // 🔥 Asegurar que los datos devueltos mantengan la estructura esperada
        const empresaActualizada = {
          id: empresaEditando.id,
          razon_social: empresaEditando.razon_social,
          ruc: empresaEditando.ruc,
          direccion: empresaEditando.direccion,
          representante_legal: empresaEditando.representante_legal,
          dni_representante: empresaEditando.dni_representante,
          cargo_representante: empresaEditando.cargo_representante,
          telefono_representante: empresaEditando.telefono_representante,
          telefono_oficina: empresaEditando.telefono_oficina,
        };
  
        // 🚀 ACTUALIZA EL ESTADO PARA REFLEJAR EL CAMBIO SIN DESAPARECER LA EMPRESA
        setEmpresas((prevEmpresas) =>
          prevEmpresas.map((e) => (e.id === empresaEditando.id ? empresaActualizada : e))
        );
  
        alert("✅ Filial actualizada correctamente");
  
        setEmpresaEditando(null);
      }
    } catch (error) {
      console.error("❌ Error al editar filial:", error);
      alert("❌ No se pudo actualizar la filial.");
    }
  }
  

// Funciones para abrir y cerrar modales
  function handleAbrirModal(empresa) {
    setEmpresaEditando({ ...empresa });
  }

  function handleCerrarModal() {
    setEmpresaEditando(null);
  }

  function handleAbrirModalAgregar() {
    setMostrarModalAgregar(true);
  }

  function handleCerrarModalAgregar() {
    setNuevaEmpresa({
      razon_social: "",
      ruc: "",
      direccion: "",
      representante_legal: "",
      dni_representante: "",
      cargo_representante: "",
      telefono_representante: "",
      telefono_oficina: "",
    });
    setMostrarModalAgregar(false);
  }

  // Filtrar empresas en base a la búsqueda
  const empresasFiltradas = empresas.filter(
    (e) =>
      e?.razon_social?.toLowerCase().includes(busqueda.toLowerCase()) ||
      e?.direccion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      e?.representante_legal?.toLowerCase().includes(busqueda.toLowerCase()) ||
      e?.dni_representante?.includes(busqueda) ||
      e?.ruc?.includes(busqueda)
  );

  // Reiniciar paginación cuando cambia la búsqueda
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  // Configuración de paginación
  const totalPaginas = Math.ceil(empresasFiltradas.length / empresasPorPagina);
  const empresasPaginadas = empresasFiltradas.slice((paginaActual - 1) * empresasPorPagina, paginaActual * empresasPorPagina);

  return (
    <div className="dashboard-main">
        <h2>Gestión de Filiales de Innova</h2>

        {/* 🔥 Barra superior: Botón de agregar filial + Búsqueda */}
        <div className="top-actions">
          <button className="btn-agregar" onClick={handleAbrirModalAgregar}>
            ➕ Agregar Filial
          </button>
          <input 
            type="text" 
            placeholder="Buscar filial..." 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            className="busqueda-input" 
          />
        </div>

        {/* 🔹 Tabla de filiales */}
        <div className="table-responsive">
            <table className="custom-table">
                <thead>
                    <tr>
                    <th title="Razón Social">Razón Soc.</th>
                    <th title="RUC">RUC</th>
                    <th title="Domicilio Fiscal">Dom. Fiscal</th>
                    <th title="Representante Legal">Rep. Legal</th>
                    <th title="DNI Representante">DNI Rep.</th>
                    <th title="Cargo Representante">Cargo Rep.</th>
                    <th title="Teléfono Representante">Tel. Rep.</th>
                    <th title="Teléfono Oficina">Tel. Ofi.</th>
                    <th title="Acciones">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                  {empresasPaginadas.map((empresa) => (
                    <tr key={empresa.id}>
                      <td>{empresa.razon_social || "—"}</td>
                      <td>{empresa.ruc || "—"}</td>
                      <td>{empresa.direccion || "—"}</td>
                      <td>{empresa.representante_legal || "—"}</td>
                      <td>{empresa.dni_representante || "—"}</td>
                      <td>{empresa.cargo_representante || "—"}</td>
                      <td>{empresa.telefono_representante || "—"}</td>
                      <td>{empresa.telefono_oficina || "—"}</td>
                      <td>
                        <div style={{ display: "flex", gap: "1px", justifyContent: "left" }}>
                          <button onClick={() => handleAbrirModal(empresa)} className="edit-button">✏️Editar</button>
                          <button onClick={() => handleEliminar(empresa.id)} className="btn-eliminar">🗑Eliminar</button>
                        </div>
                      </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* 🔹 Modal de crear empresa */}
        {mostrarModalAgregar && (
          <div className="centro-modal">
            <div className="modal-content">
              <h3>Crear Filial</h3>
              <form onSubmit={handleAgregarEmpresa } className="gestion-form-global">

                {/* Razón Social - Solo letras y espacios */}
                <input 
                  type="text" 
                  placeholder="Razón Social"
                  value={nuevaEmpresa.razon_social} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ. ]/g, "");
                    setNuevaEmpresa({ ...nuevaEmpresa, razon_social: value });
                  }} 
                />

                {/* RUC - Exactamente 11 dígitos numéricos */}
                <input 
                  type="text" 
                  placeholder="RUC" 
                  value={nuevaEmpresa.ruc} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
                    setNuevaEmpresa({ ...nuevaEmpresa, ruc: value });
                  }} 
                  required 
                />

                {/* Dirección - Permite letras, números y caracteres básicos */}
                <input 
                  type="text" 
                  placeholder="Domicilio Fiscal" 
                  value={nuevaEmpresa.direccion} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,-\s]/g, ""); // Ahora los espacios son válidos
                    setNuevaEmpresa({ ...nuevaEmpresa, direccion: value });
                  }} 
                  required 
                />


                {/* Representante Legal - Solo letras y espacios */}
                <input 
                  type="text" 
                  placeholder="Representante Legal" 
                  value={nuevaEmpresa.representante_legal} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ""); 
                    setNuevaEmpresa({ ...nuevaEmpresa, representante_legal: value });
                  }} 
                  required 
                />

                {/* DNI Representante - Exactamente 8 dígitos numéricos */}
                <input 
                  type="text" 
                  placeholder="DNI Representante" 
                  value={nuevaEmpresa.dni_representante} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
                    setNuevaEmpresa({ ...nuevaEmpresa, dni_representante: value });
                  }} 
                  required 
                />

                {/* Cargo Representante - Solo letras y espacios */}
                <input 
                  type="text" 
                  placeholder="Cargo Representante" 
                  value={nuevaEmpresa.cargo_representante} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ""); 
                    setNuevaEmpresa({ ...nuevaEmpresa, cargo_representante: value });
                  }} 
                  required 
                />

                {/* Teléfono Representante - Exactamente 9 dígitos numéricos */}
                <input 
                  type="text" 
                  placeholder="Teléfono Representante" 
                  value={nuevaEmpresa.telefono_representante} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);
                    setNuevaEmpresa({ ...nuevaEmpresa, telefono_representante: value });
                  }} 
                  required 
                />

                {/* Teléfono Oficina - Exactamente 9 dígitos numéricos */}
                <input 
                  type="text" 
                  placeholder="Teléfono Oficina" 
                  value={nuevaEmpresa.telefono_oficina} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);
                    setNuevaEmpresa({ ...nuevaEmpresa, telefono_oficina: value });
                  }} 
                  required 
                />

                <button type="submit" >Guardar Filial</button>
                <button type="button" className="btn-cancelar" onClick={handleCerrarModalAgregar}>Cancelar</button>
              </form>
            </div>
          </div>
        )}

        {/* 🔹 Modal de edición */}
        {empresaEditando && (
        <div className="centro-modal">
          <div className="modal-content">
            <h3>Editar Filial</h3>
            <form onSubmit={handleGuardarEdicion} className="gestion-form-global">
            {/* Razón Social - Solo letras y espacios */}
            <input 
              type="text"
              placeholder="Razón Social" 
              value={empresaEditando.razon_social} 
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ. ]/g, "");
                setEmpresaEditando({ ...empresaEditando, razon_social: value });
              }} 
            />

            {/* RUC - Exactamente 11 dígitos numéricos */}
            <input 
              type="text" 
              placeholder="RUC"
              value={empresaEditando.ruc} 
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
                setEmpresaEditando({ ...empresaEditando, ruc: value });
              }} 
            />

            {/* Dirección - Permite letras, números y caracteres básicos */}
            <input 
                  type="text" 
                  placeholder="Domicilio Fiscal" 
                  value={empresaEditando.direccion} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,-\s]/g, ""); // Ahora los espacios son válidos
                    setEmpresaEditando({ ...empresaEditando, direccion: value });
                  }} 
                  required 
                />

            {/* Representante Legal - Solo letras y espacios */}
            <input 
              type="text" 
              placeholder="Representante Legal"
              value={empresaEditando.representante_legal} 
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, "");
                setEmpresaEditando({ ...empresaEditando, representante_legal: value });
              }} 
            />

            {/* DNI Representante - Exactamente 8 dígitos numéricos */}
            <input 
              type="text" 
              placeholder="DNI Representante"
              value={empresaEditando.dni_representante} 
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
                setEmpresaEditando({ ...empresaEditando, dni_representante: value });
              }} 
            />

            {/* Cargo Representante - Solo letras y espacios */}
            <input 
              type="text" 
              placeholder="Cargo Representante"
              value={empresaEditando.cargo_representante} 
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, "");
                setEmpresaEditando({ ...empresaEditando, cargo_representante: value });
              }} 
            />

            {/* Teléfono Representante - Exactamente 9 dígitos numéricos */}
            <input 
              type="text" 
              placeholder="Teléfono Representante"
              value={empresaEditando.telefono_representante} 
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);
                setEmpresaEditando({ ...empresaEditando, telefono_representante: value });
              }} 
            />

            {/* Teléfono Oficina - Exactamente 9 dígitos numéricos */}
            <input 
              type="text" 
              placeholder="Teléfono Oficina"
              value={empresaEditando.telefono_oficina} 
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);
                setEmpresaEditando({ ...empresaEditando, telefono_oficina: value });
              }} 
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