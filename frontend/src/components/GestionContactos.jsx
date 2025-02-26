import Select from "react-select";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function GestionContactos() {
  const { user } = useAuth();
  const [contactos, setContactos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [obras, setObras] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const contactosPorPagina = 5;
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [contactoEditando, setContactoEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);

  const [nuevoContacto, setNuevoContacto] = useState({
    nombre: "",
    email: "",
    telefono: "",
    cargo: "",
    clientes: [],
    obras: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const resContactos = await api.get("/contactos");
        const resClientes = await api.get("/clientes");
        const resObras = await api.get("/obras");

        setContactos(resContactos.data || []);
        setClientes(resClientes.data.filter(cliente => cliente.ruc)); // 🔥 Filtra solo clientes con RUC
        setObras(resObras.data || []);
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  function handleAbrirModal(contacto) {
    setContactoEditando({
        ...contacto,
        clientes_asociados: Array.isArray(contacto.clientes_asociados) 
            ? contacto.clientes_asociados.map(c => c.id) 
            : [],
        obras_asociadas: Array.isArray(contacto.obras_asociadas) 
            ? contacto.obras_asociadas.map(o => o.id) 
            : []
    });
    setMostrarModal(true);
}


function handleCerrarModal() {
  setContactoEditando(null);
  setMostrarModal(false);
}


  function handleAbrirModalAgregar() {
    setMostrarModalAgregar(true);
  }

  function handleCerrarModalAgregar() {
    setNuevoContacto({
      nombre: "",
      email: "",
      telefono: "",
      cargo: "",
      clientes: [],
      obras: [],
    });
    setMostrarModalAgregar(false);
  }

  async function handleAgregarContacto(e) {
    e.preventDefault();
    try {
        const nuevoContactoData = {
            nombre: nuevoContacto.nombre,
            email: nuevoContacto.email,
            telefono: nuevoContacto.telefono,
            cargo: nuevoContacto.cargo,
            clientes: nuevoContacto.clientes.map(c => c.id || c), // 🔥 Asegura que sean solo IDs
            obras: nuevoContacto.obras.map(o => o.id || o) // 🔥 Asegura que sean solo IDs
        };

        console.log("🔹 Enviando datos al backend:", nuevoContactoData);

        const res = await api.post("/contactos", nuevoContactoData);
        setContactos([...contactos, res.data.contacto]);
        setNuevoContacto({ nombre: "", email: "", telefono: "", cargo: "", clientes: [], obras: [] });
        alert("✅ Contacto agregado con éxito");
        handleCerrarModalAgregar();
    } catch (error) {
        console.error("❌ Error al agregar contacto:", error);
        alert("❌ Error al agregar contacto.");
    }
}


async function handleGuardarEdicion(e) {
  e.preventDefault();

  if (!contactoEditando) return;

  try {
      await api.put(`/contactos/${contactoEditando.id}`, {
          nombre: contactoEditando.nombre,
          email: contactoEditando.email,
          telefono: contactoEditando.telefono,
          cargo: contactoEditando.cargo,
          clientes: contactoEditando.clientes_asociados,
          obras: contactoEditando.obras_asociadas
      });

      // Obtener la versión actualizada del contacto desde el backend
      const resContactoActualizado = await api.get(`/contactos/${contactoEditando.id}`);

      // 🔹 Reemplazar el contacto en la lista de contactos
      setContactos(prevContactos =>
          prevContactos.map(c =>
              c.id === contactoEditando.id ? resContactoActualizado.data : c
          )
      );

      alert("✅ Contacto actualizado correctamente");  // 💡 Agregar confirmación
      setMostrarModal(false);  // 💡 Cerrar el modal solo después de la actualización

  } catch (error) {
      console.error("❌ Error al editar contacto:", error);
      alert("❌ No se pudo actualizar el contacto.");
  }
}

  async function handleEliminar(id) {
    if (!window.confirm("¿Seguro que quieres eliminar este contacto?")) return;
    try {
      await api.delete(`/contactos/${id}`);
      setContactos(contactos.filter((c) => c.id !== id));
      alert("✅ Contacto eliminado con éxito");
    } catch (error) {
      console.error("❌ Error al eliminar contacto:", error);
    }
  }

  function handleSeleccionClientes(selectedOptions) {
    const clientesSeleccionados = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setContactoEditando(prev => ({
        ...prev,
        clientes_asociados: clientesSeleccionados
    }));
}

function handleSeleccionObras(selectedOptions) {
  const obrasSeleccionadas = selectedOptions ? selectedOptions.map(option => option.value) : [];
  setContactoEditando(prev => ({
      ...prev,
      obras_asociadas: obrasSeleccionadas
  }));
}

  const contactosFiltrados = contactos.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.telefono?.includes(busqueda)
  );

  const totalPaginas = Math.ceil(contactosFiltrados.length / contactosPorPagina);
  const contactosPaginados = contactosFiltrados.slice(
    (paginaActual - 1) * contactosPorPagina,
    paginaActual * contactosPorPagina
  );

  return (
    <div className="dashboard-main">
      <h2>Gestión de Contactos</h2>

      <div className="top-actions">
        <button className="add-button" onClick={handleAbrirModalAgregar}>
          ➕ Agregar Contacto
        </button>
        <input type="text" placeholder="Buscar contacto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="busqueda-input" />
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Cargo</th>
            <th>Clientes</th>
            <th>Obras</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contactosPaginados.map((contacto) => (
            <tr key={contacto.id}>
              <td>{contacto.nombre}</td>
              <td>{contacto.email}</td>
              <td>{contacto.telefono}</td>
              <td>{contacto.cargo}</td>
              <td>
                  {contacto.clientes_asociados?.length > 0 
                      ? contacto.clientes_asociados.map(c => c.razon_social).join(", ") 
                      : "—"}
              </td>
              <td>
                  {contacto.obras_asociadas?.length > 0 
                      ? contacto.obras_asociadas.map(o => o.nombre).join(", ") 
                      : "—"}
              </td>

              <td>
                <button onClick={() => handleAbrirModal(contacto)}>✏️</button>
                <button onClick={() => handleEliminar(contacto.id)}>🗑️</button>
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

      {mostrarModalAgregar && (
        <div className="modal">
            <div className="modal-content">
                <h3>Agregar Contacto</h3>
                    <form onSubmit={handleAgregarContacto} className="gestion-contactos-form">
                        <input type="text" placeholder="Nombre" value={nuevoContacto.nombre} onChange={(e) => setNuevoContacto({ ...nuevoContacto, nombre: e.target.value })} required />
                        <input type="email" placeholder="Email" value={nuevoContacto.email} onChange={(e) => setNuevoContacto({ ...nuevoContacto, email: e.target.value })} required />
                        <input type="text" placeholder="Teléfono" value={nuevoContacto.telefono} onChange={(e) => setNuevoContacto({ ...nuevoContacto, telefono: e.target.value })} />
                        <input type="text" placeholder="Cargo" value={nuevoContacto.cargo} onChange={(e) => setNuevoContacto({ ...nuevoContacto, cargo: e.target.value })} />

                        <label>Asignar Clientes</label>
                            <Select
                                isMulti
                                options={clientes.map((cliente) => ({ value: cliente.id, label: cliente.razon_social }))}
                                onChange={handleSeleccionClientes}
                                placeholder="Selecciona uno o varios clientes..."
                            />

                        <label>Asignar Obras</label>
                            <Select
                                isMulti
                                options={obras.map((obra) => ({ value: obra.id, label: obra.nombre }))}
                                onChange={handleSeleccionObras}
                                placeholder="Selecciona una o varias obras..."
                            />

                        <button type="submit">Guardar Contacto</button>
                    </form>
                    <button onClick={handleCerrarModalAgregar}>Cancelar</button>
                </div>
            </div>
      )}

{mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Contacto</h3>
            <form onSubmit={handleGuardarEdicion} className="gestion-contactos-form">
              <input type="text" placeholder="Nombre" value={contactoEditando?.nombre || ""} onChange={(e) => setContactoEditando({ ...contactoEditando, nombre: e.target.value })} required />
              <input type="email" placeholder="Email" value={contactoEditando?.email || ""} onChange={(e) => setContactoEditando({ ...contactoEditando, email: e.target.value })} required />
              <input type="text" placeholder="Teléfono" value={contactoEditando?.telefono || ""} onChange={(e) => setContactoEditando({ ...contactoEditando, telefono: e.target.value })} />
              <input type="text" placeholder="Cargo" value={contactoEditando?.cargo || ""} onChange={(e) => setContactoEditando({ ...contactoEditando, cargo: e.target.value })} />

              <label>Asignar Clientes</label>
              <Select
                  isMulti
                  options={clientes.map((cliente) => ({ value: cliente.id, label: cliente.razon_social }))}
                  value={clientes.filter(cliente => contactoEditando?.clientes_asociados?.includes(cliente.id)).map(cliente => ({ value: cliente.id, label: cliente.razon_social }))}
                  onChange={(selected) => setContactoEditando({ ...contactoEditando, clientes_asociados: selected.map(s => s.value) })}
                  placeholder="Selecciona uno o varios clientes..."
              />

              <label>Asignar Obras</label>
              <Select
                  isMulti
                  options={obras.map((obra) => ({ value: obra.id, label: obra.nombre }))}
                  value={obras.filter(obra => contactoEditando?.obras_asociadas?.includes(obra.id)).map(obra => ({ value: obra.id, label: obra.nombre }))}
                  onChange={(selected) => setContactoEditando({ ...contactoEditando, obras_asociadas: selected.map(s => s.value) })}
                  placeholder="Selecciona una o varias obras..."
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