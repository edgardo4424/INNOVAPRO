import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function GestionClientes() {
  // Obtiene información del usuario autenticado
  const { user } = useAuth();
  
  // Estados para manejar datos de clientes 
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 5;
  const [errorMensaje, setErrorMensaje] = useState("");

  // Estado para manejar datos de nuevos clientes y edición
  const [nuevoCliente, setNuevoCliente] = useState({
    razon_social: "",
    tipo: "Persona Jurídica",
    ruc: "",
    dni: "",
    telefono: "",
    email: "",
    domicilio_fiscal: "",
    representante_legal: "",
    dni_representante: "",
    creado_por: user.id,
  });

  const [clienteEditando, setClienteEditando] = useState(null);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);

  // Efecto para cargar los clientes
  useEffect(() => {
    async function fetchClientes() {
      try {
        const res = await api.get("/clientes");
        setClientes(res.data || []);
      } catch (error) {
        console.error("❌ Error al obtener clientes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClientes();
  }, []);
  
  // Función para eliminar un cliente
  async function handleEliminar(id) {
    if (!window.confirm("¿Seguro que quieres eliminar este cliente?")) return;
    try {
      await api.delete(`/clientes/${id}`);
      setClientes(clientes.filter((c) => c.id !== id));
      alert("✅ Cliente eliminado con éxito");
    } catch (error) {
      console.error("❌ Error al eliminar cliente:", error);
    }
  }

  // Función para agregar un cliente nuevo
  async function handleAgregarCliente(e) {
    e.preventDefault();
    try {
        
        // 🔹 Validar antes de enviar
        if (!nuevoCliente.razon_social || !nuevoCliente.tipo || !user.id) {
          setErrorMensaje("❌ Razón Social y Tipo de Cliente son obligatorios.");
          return;
        }

        let clienteAEnviar = { ...nuevoCliente, creado_por: user.id };

        if (nuevoCliente.tipo === "Persona Natural") {
          clienteAEnviar = {
              ...clienteAEnviar,
              ruc: null,
              representante_legal: null,
              dni_representante: null,
              domicilio_fiscal: null,
          };
      } else if (nuevoCliente.tipo === "Persona Jurídica") {
          clienteAEnviar = {
              ...clienteAEnviar,
              dni: null, // 🔥 Asegurar que no envíe DNI si es empresa
          };
      }

      // 🚀 Convertir valores vacíos en null para evitar problemas en el backend
      Object.keys(clienteAEnviar).forEach(key => {
          if (clienteAEnviar[key] === "") {
              clienteAEnviar[key] = null;
          }
      });

        const res = await api.post("/clientes", clienteAEnviar);
        
        if (!res.data || !res.data.cliente) {
            throw new Error("La respuesta del servidor no contiene los datos esperados.");
        }

        // 🔥 Aseguramos que el nuevo cliente tiene `razon_social`
        const nuevoClienteGuardado = res.data.cliente;

       
        if (!nuevoClienteGuardado.razon_social) {
            throw new Error("El cliente guardado no tiene una razón social válida.");
        }

        // 🔥 Agregar cliente a la lista sin perder los existentes
        setClientes((prevClientes) => [...prevClientes, nuevoClienteGuardado]);

        // 🔹 Resetear el formulario
        setNuevoCliente({
            razon_social: "",
            tipo: "Persona Jurídica",
            ruc: "",
            dni: "",
            telefono: "",
            email: "",
            domicilio_fiscal: "",
            representante_legal: "",
            dni_representante: "",
            creado_por: user.id,
        });

        setErrorMensaje(""); // Limpiar errores
        alert("✅ Cliente agregado con éxito");
        handleCerrarModalAgregar();
    } catch (error) {
        console.error("❌ Error al agregar cliente:", error);
        if (error.response && error.response.data && error.response.data.mensaje) {
          setErrorMensaje(`❌ ${error.response.data.mensaje}`);
      } else {
          setErrorMensaje("❌ Error al agregar cliente: Error desconocido.");
      }
      }
}

  // Función para guardar cambios en un contacto editado
  async function handleGuardarEdicion(e) {
    e.preventDefault();
    if (!clienteEditando) return;
    try {
        const clienteData = {
            razon_social: clienteEditando.razon_social,
            tipo: clienteEditando.tipo,
            telefono: clienteEditando.telefono,
            email: clienteEditando.email,
            ...(clienteEditando.tipo === "Persona Jurídica"
                ? {
                      ruc: clienteEditando.ruc,
                      representante_legal: clienteEditando.representante_legal,
                      dni_representante: clienteEditando.dni_representante,
                      domicilio_fiscal: clienteEditando.domicilio_fiscal,
                  }
                : { dni: clienteEditando.dni }),
        };
  
        await api.put(`/clientes/${clienteEditando.id}`, clienteData);
        setClientes(clientes.map((c) => (c.id === clienteEditando.id ? { ...c, ...clienteData } : c)));
        setErrorMensaje("");
        alert("✅ Cliente actualizado correctamente");
        handleCerrarModal();
    } catch (error) {
      console.error("❌ Error al modificar cliente:", error);
      if (error.response && error.response.data && error.response.data.mensaje) {
        setErrorMensaje(`❌ ${error.response.data.mensaje}`);
    } else {
        setErrorMensaje("❌ Error al modificar cliente: Error desconocido.");
    }
    }
  }
  
  // Funciones para abrir y cerrar modales
  function handleAbrirModal(cliente) {
    setClienteEditando({ ...cliente });
  }

  function handleCerrarModal() {
    setClienteEditando(null);
    setErrorMensaje(""); // Limpiar errores
  }

  function handleAbrirModalAgregar() {
    setMostrarModalAgregar(true);
  }

  function handleCerrarModalAgregar() {
    setNuevoCliente({
      razon_social: "",
      tipo: "Persona Jurídica",
      ruc: "",
      dni: "",
      telefono: "",
      email: "",
      domicilio_fiscal: "",
      representante_legal: "",
      dni_representante: "",
      creado_por: "",
    });
    setMostrarModalAgregar(false);
    setErrorMensaje(""); // Limpiar errores
  }

  // Filtrar clientes en base a la búsqueda
  const clientesFiltrados = clientes.filter(
    (c) =>
        c.razon_social?.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.ruc?.includes(busqueda) ||
        c.representante_legal?.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.dni?.includes(busqueda)  // 🔥 Ahora permite buscar por DNI también
    );
  
  // Reiniciar paginación cuando cambia la búsqueda
  useEffect(() => {
    setPaginaActual(1);  // 🔥 Cada vez que cambia la búsqueda, vuelve a la primera página
    }, [busqueda]);

  // Configuración de paginación
  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);
  const clientesPaginados = clientesFiltrados.slice((paginaActual - 1) * clientesPorPagina, paginaActual * clientesPorPagina);

  return (
    <div className="dashboard-main">
      <h2>Gestión de Clientes</h2>

      {/* 🔥 Barra superior: Botón de agregar cliente + Búsqueda */}
      <div className="top-actions">
          <button className="btn-agregar" onClick={handleAbrirModalAgregar}>
            ➕ Agregar Cliente
          </button>
          <input 
            type="text" 
            placeholder="Buscar cliente..." 
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
                  <th title="Razón Social/Nombre">Ra.Soc./Nom./</th>
                  <th>Tipo</th>
                  <th>RUC/DNI</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th title="Domicilio Fiscal">Dom. Fiscal</th>
                  <th title="Representante Legal">Rep. Legal</th>
                  <th title="DNI Representante">DNI Rep.</th>
                  <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {clientesPaginados.map((cliente) => (
                    <tr key={cliente.id}>
                        <td>{cliente.razon_social || "—"}</td>
                        <td>{cliente.tipo || "—"}</td>
                        <td>{cliente.ruc || cliente.dni || "—"}</td> {/* 🔥 Muestra "—" si no hay dato */}
                        <td>{cliente.telefono || "—"}</td>
                        <td>{cliente.email || "—"}</td>
                        <td>{cliente.domicilio_fiscal || "—"}</td>
                        <td>{cliente.representante_legal || "—"}</td>
                        <td>{cliente.dni_representante || "—"}</td>
                        <td>
                        <div style={{ display: "flex", gap: "1px", justifyContent: "left" }}>
                          <button onClick={() => handleAbrirModal(cliente)} className="edit-button">✏️Editar</button>
                          <button onClick={() => handleEliminar(cliente.id)} className="btn-eliminar">🗑Eliminar</button>
                        </div>
                      </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
      
      {/* Modal de Agregar Cliente */}
      {mostrarModalAgregar && (
        <div className="modal">
          <div className="modal-content">
            <h3>Agregar Cliente</h3>
            <form onSubmit={handleAgregarCliente} className="gestion-form-global">
              
              {/* Tipo de cliente */}
              <div className="form-group">
                <label>Tipo de Cliente:</label>
                <select value={nuevoCliente.tipo} onChange={(e) => setNuevoCliente({ ...nuevoCliente, tipo: e.target.value })}>
                  <option value="Persona Jurídica">Persona Jurídica</option>
                  <option value="Persona Natural">Persona Natural</option>
                </select>
              </div>

              {/* Razon Social/Nombre - Solo letras y espacios */}
              <input 
                  type="text" 
                  placeholder="Razón Social/Nombre"
                  value={nuevoCliente.razon_social} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ. ]/g, "");
                    setNuevoCliente({ ...nuevoCliente, razon_social: value });
                  }} 
                />

              {nuevoCliente.tipo === "Persona Jurídica" ? (
                <>
                  {/* RUC - Exactamente 11 dígitos numéricos */}
                  <input 
                    type="text" 
                    placeholder="RUC" 
                    value={nuevoCliente.ruc} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
                      setNuevoCliente({ ...nuevoCliente, ruc: value });
                    }} 
                    required 
                  />
                  {/* Representante Legal - Solo letras y espacios */}
                  <input 
                    type="text" 
                    placeholder="Representante Legal" 
                    value={nuevoCliente.representante_legal} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, ""); 
                      setNuevoCliente({ ...nuevoCliente, representante_legal: value });
                    }} 
                  />
                  {/* DNI Representante - Exactamente 8 dígitos numéricos */}
                  <input 
                    type="text" 
                    placeholder="DNI Representante" 
                    value={nuevoCliente.dni_representante} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
                      setNuevoCliente({ ...nuevoCliente, dni_representante: value });
                    }} 
                    required 
                  />
                  {/* Dirección - Permite letras, números y caracteres básicos */}
                  <input 
                    type="text" 
                    placeholder="Domicilio Fiscal" 
                    value={nuevoCliente.domicilio_fiscal} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,-\s]/g, ""); // Ahora los espacios son válidos
                      setNuevoCliente({ ...nuevoCliente, domicilio_fiscal: value });
                    }} 
                  />
                </>
              ) : (
                <input 
                type="text" 
                placeholder="DNI" 
                value={nuevoCliente.dni} 
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
                  setNuevoCliente({ ...nuevoCliente, dni: value });
                }} 
                required 
              />
            )}

            {/* Teléfono - Exactamente 9 dígitos numéricos */}
            <input 
                  type="text" 
                  placeholder="Teléfono" 
                  value={nuevoCliente.telefono} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);
                    setNuevoCliente({ ...nuevoCliente, telefono: value });
                  }}  
                />

              {/* Correo - Formato correo */}
              <input 
                type="email" 
                placeholder="Correo" 
                value={nuevoCliente.email} 
                onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}  
              />

              {errorMensaje && <p className="error-message">{errorMensaje}</p>}

              <button type="submit" >Guardar Cliente</button>
              <button type="button" className="btn-cancelar" onClick={handleCerrarModalAgregar}>Cancelar</button>
            </form>
            </div>
          </div>
      )}

      {/* 🔹 Modal de edición */}
      {clienteEditando && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Cliente</h3>
            <form onSubmit={handleGuardarEdicion} className="gestion-form-global">
            <label>Tipo de Cliente:</label>
            <select value={clienteEditando.tipo} onChange={(e) => setClienteEditando({ ...clienteEditando, tipo: e.target.value })}>
              <option value="Persona Jurídica">Persona Jurídica</option>
              <option value="Persona Natural">Persona Natural</option>
            </select>

            {/* Razón Social - Solo letras y espacios */}
            <input 
              type="text"
              placeholder="Razón Social" 
              value={clienteEditando.razon_social} 
              onChange={(e) => {
                const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ. ]/g, "");
                setClienteEditando({ ...clienteEditando, razon_social: value });
              }} 
            />

            {clienteEditando.tipo === "Persona Jurídica" ? (
            <>
              {/* RUC - Exactamente 11 dígitos numéricos */}
              <input 
                type="text" 
                placeholder="RUC"
                value={clienteEditando.ruc} 
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
                  setClienteEditando({ ...clienteEditando, ruc: value });
                }} required
              />
              {/* Representante Legal - Solo letras y espacios */}
              <input 
                type="text" 
                placeholder="Representante Legal"
                value={clienteEditando.representante_legal} 
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, "");
                  setClienteEditando({ ...clienteEditando, representante_legal: value });
                }} 
              />
              {/* DNI Representante - Exactamente 8 dígitos numéricos */}
              <input 
                type="text" 
                placeholder="DNI Representante"
                value={clienteEditando.dni_representante} 
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
                  setClienteEditando({ ...clienteEditando, dni_representante: value });
                }} required
              />
              {/* Dirección - Permite letras, números y caracteres básicos */}
              <input 
                    type="text" 
                    placeholder="Domicilio Fiscal" 
                    value={clienteEditando.domicilio_fiscal} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,-\s]/g, ""); // Ahora los espacios son válidos
                      setClienteEditando({ ...clienteEditando, domicilio_fiscal: value });
                    }} 
              />
              </>
              ) : (
                <input 
                type="text" 
                placeholder="DNI"
                value={clienteEditando.dni} 
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
                  setClienteEditando({ ...clienteEditando, dni: value });
                }} required
              />
              )}
              {/* Teléfono - Exactamente 9 dígitos numéricos */}
              <input 
                type="text" 
                placeholder="Teléfono"
                value={clienteEditando.telefono} 
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);
                  setClienteEditando({ ...clienteEditando, telefono: value });
                }} 
              />
              {/* Correo - Formato correo */}
              <input 
                type="email" 
                placeholder="Correo" 
                value={clienteEditando.email} 
                onChange={(e) => setClienteEditando({ ...clienteEditando, email: e.target.value })}  
              />

            {errorMensaje && <p className="error-message">{errorMensaje}</p>}

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