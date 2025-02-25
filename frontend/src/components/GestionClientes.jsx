import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function GestionClientes() {
  const { user } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 5;
  const [nuevoCliente, setNuevoCliente] = useState({
    razon_social: "",
    tipo: "Empresa",
    ruc: "",
    dni: "",
    telefono: "",
    email: "",
    domicilio_fiscal: "",
    representante_legal: "",
    dni_representante: "",
    creado_por: user.id,
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

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

  useEffect(() => {
    setPaginaActual(1);  // 🔥 Cada vez que cambia la búsqueda, vuelve a la primera página
    }, [busqueda]);

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

  async function handleAgregarCliente(e) {
    e.preventDefault();
    try {
        let clienteAEnviar = { ...nuevoCliente };

        if (nuevoCliente.tipo === "Particular") {
            delete clienteAEnviar.ruc;
            delete clienteAEnviar.representante_legal;
            delete clienteAEnviar.dni_representante;
            delete clienteAEnviar.domicilio_fiscal;
        } else {
            delete clienteAEnviar.dni;
        }

        const res = await api.post("/clientes", clienteAEnviar);
        
        if (!res.data || !res.data.cliente) {
            throw new Error("La respuesta del servidor no contiene los datos esperados.");
        }

        // 🔥 Aseguramos que el nuevo cliente tiene `razon_social`
        const nuevoClienteGuardado = res.data.cliente;
        if (!nuevoClienteGuardado.razon_social) {
            throw new Error("El cliente guardado no tiene una razón social válida.");
        }

        setClientes((prevClientes) => [...prevClientes, nuevoClienteGuardado]);

        setNuevoCliente({
            razon_social: "",
            tipo: "Empresa",
            ruc: "",
            dni: "",
            telefono: "",
            email: "",
            domicilio_fiscal: "",
            representante_legal: "",
            dni_representante: "",
            creado_por: user.id,
        });

        alert("✅ Cliente agregado con éxito");
    } catch (error) {
        console.error("❌ Error al agregar cliente:", error);
        alert("❌ Error al agregar cliente: " + (error.response?.data?.mensaje || "Error desconocido"));
    }
}

  async function handleGuardarEdicion() {
    if (!clienteEditando) return;
    try {
      await api.put(`/clientes/${clienteEditando.id}`, clienteEditando);
      setClientes(clientes.map((c) => (c.id === clienteEditando.id ? clienteEditando : c)));
      alert("✅ Cliente actualizado correctamente");
      setClienteEditando(null);
      setMostrarModal(false);
    } catch (error) {
      console.error("❌ Error al editar cliente:", error);
      alert("❌ No se pudo actualizar el cliente.");
    }
  }

  function handleAbrirModal(cliente) {
    setClienteEditando({ ...cliente });
    setMostrarModal(true);
  }

  function handleCerrarModal() {
    setClienteEditando(null);
    setMostrarModal(false);
  }

  const clientesFiltrados = clientes.filter(
    (c) =>
        c.razon_social?.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.ruc?.includes(busqueda) ||
        c.dni?.includes(busqueda)  // 🔥 Ahora permite buscar por DNI también
    );


  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);
  const clientesPaginados = clientesFiltrados.slice((paginaActual - 1) * clientesPorPagina, paginaActual * clientesPorPagina);

  return (
    <div className="dashboard-main">
      <h2>Gestión de Clientes</h2>

      <div className="top-actions">
        <button className="add-button" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? "✖ Cerrar Formulario" : "➕ Agregar Cliente"}
        </button>
        <input type="text" placeholder="Buscar cliente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="busqueda-input" />
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleAgregarCliente} className="gestion-clientes-form">
          <label>Tipo de Cliente:</label>
          <select value={nuevoCliente.tipo} onChange={(e) => setNuevoCliente({ ...nuevoCliente, tipo: e.target.value })}>
            <option value="Empresa">Empresa</option>
            <option value="Particular">Particular</option>
          </select>

          <input type="text" placeholder="Razón Social / Nombre" value={nuevoCliente.razon_social} onChange={(e) => setNuevoCliente({ ...nuevoCliente, razon_social: e.target.value })} required />

          {nuevoCliente.tipo === "Empresa" ? (
            <>
              <input type="text" placeholder="RUC" value={nuevoCliente.ruc} onChange={(e) => setNuevoCliente({ ...nuevoCliente, ruc: e.target.value })} required />
              <input type="text" placeholder="Representante Legal" value={nuevoCliente.representante_legal} onChange={(e) => setNuevoCliente({ ...nuevoCliente, representante_legal: e.target.value })} required />
              <input type="text" placeholder="DNI Representante" value={nuevoCliente.dni_representante} onChange={(e) => setNuevoCliente({ ...nuevoCliente, dni_representante: e.target.value })} required />
              <input type="text" placeholder="Domicilio Fiscal" value={nuevoCliente.domicilio_fiscal} onChange={(e) => setNuevoCliente({ ...nuevoCliente, domicilio_fiscal: e.target.value })} required />
            </>
          ) : (
            <input type="text" placeholder="DNI" value={nuevoCliente.dni} onChange={(e) => setNuevoCliente({ ...nuevoCliente, dni: e.target.value })} required />
          )}

          <input type="text" placeholder="Teléfono" value={nuevoCliente.telefono} onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })} />
          <input type="email" placeholder="Email" value={nuevoCliente.email} onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })} />

          <button type="submit">Guardar Cliente</button>
        </form>
      )}

      <div className="table-responsive">
      <table className="custom-table">
          <thead>
              <tr>
                  <th>ID</th>
                  <th>Razón Social</th>
                  <th>Tipo</th>
                  <th>RUC/DNI</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Domicilio Fiscal</th>
                  <th>Representante Legal</th>
                  <th>DNI Representante</th>
                  <th>Acciones</th>
              </tr>
          </thead>
          <tbody>
              {clientesPaginados.map((cliente) => (
                  <tr key={cliente.id}>
                      <td>{cliente.id}</td>
                      <td>{cliente.razon_social}</td>
                      <td>{cliente.tipo}</td>
                      <td>{cliente.ruc || cliente.dni || "—"}</td> {/* 🔥 Muestra "—" si no hay dato */}
                      <td>{cliente.telefono || "—"}</td>
                      <td>{cliente.email || "—"}</td>
                      <td>{cliente.domicilio_fiscal || "—"}</td>
                      <td>{cliente.representante_legal || "—"}</td>
                      <td>{cliente.dni_representante || "—"}</td>
                      <td>
                          <button onClick={() => handleAbrirModal(cliente)} className="edit-button">✏️</button>
                          <button onClick={() => handleEliminar(cliente.id)} className="delete-button">🗑</button>
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
        {mostrarModal && clienteEditando && (
            <div className="modal">
                <div className="modal-content">
                    <h3>Editar Cliente</h3>

                    <label>Tipo de Cliente:</label>
                    <select value={clienteEditando.tipo} onChange={(e) => setClienteEditando({ ...clienteEditando, tipo: e.target.value })}>
                        <option value="Empresa">Empresa</option>
                        <option value="Particular">Particular</option>
                    </select>

                    <input 
                        type="text" 
                        value={clienteEditando.razon_social || ""} 
                        placeholder="Razón Social / Nombre"
                        onChange={(e) => setClienteEditando({ ...clienteEditando, razon_social: e.target.value })}
                    />

                    {clienteEditando.tipo === "Empresa" ? (
                        <>
                            <input 
                                type="text" 
                                value={clienteEditando.ruc || ""} 
                                placeholder="RUC"
                                onChange={(e) => setClienteEditando({ ...clienteEditando, ruc: e.target.value })}
                            />
                            <input 
                                type="text" 
                                value={clienteEditando.representante_legal || ""} 
                                placeholder="Representante Legal"
                                onChange={(e) => setClienteEditando({ ...clienteEditando, representante_legal: e.target.value })}
                            />
                            <input 
                                type="text" 
                                value={clienteEditando.dni_representante || ""} 
                                placeholder="DNI Representante"
                                maxLength="15"  // 🔥 Evita que el usuario escriba más de 15 caracteres
                                onChange={(e) => setClienteEditando({ ...clienteEditando, dni_representante: e.target.value })}
                            />
                            <input 
                                type="text" 
                                value={clienteEditando.domicilio_fiscal || ""} 
                                placeholder="Domicilio Fiscal"
                                onChange={(e) => setClienteEditando({ ...clienteEditando, domicilio_fiscal: e.target.value })}
                            />
                        </>
                    ) : (
                        <input 
                            type="text" 
                            value={clienteEditando.dni || ""} 
                            placeholder="DNI"
                            onChange={(e) => setClienteEditando({ ...clienteEditando, dni: e.target.value })}
                        />
                    )}

                    <input 
                        type="text" 
                        value={clienteEditando.telefono || ""} 
                        placeholder="Teléfono"
                        onChange={(e) => setClienteEditando({ ...clienteEditando, telefono: e.target.value })}
                    />
                    <input 
                        type="email" 
                        value={clienteEditando.email || ""} 
                        placeholder="Email"
                        onChange={(e) => setClienteEditando({ ...clienteEditando, email: e.target.value })}
                    />

                    <button onClick={handleGuardarEdicion}>Guardar</button>
                    <button onClick={handleCerrarModal}>Cancelar</button>
                </div>
            </div>
        )}

    </div>
  );
}