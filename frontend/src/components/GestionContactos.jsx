import Select from "react-select";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function GestionContactos() {
    // Obtiene información del usuario autenticado
  const { user } = useAuth();

    // Estados para manejar datos de contactos, 
    // clientes, obras, carga, errores y búsqueda
  const [contactos, setContactos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [obras, setObras] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const contactosPorPagina = 5;

    // Estado para manejar datos de la nueva empresa y edición
    const [nuevoContacto, setNuevoContacto] = useState({
      nombre: "",
      email: "",
      telefono: "",
      cargo: "",
      clientes: [],
      obras: [],
    });

  const [contactoEditando, setContactoEditando] = useState(null);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);

    // Efecto para cargar los contactos, clientes
    // y obras al montar el componente
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

    // Función para eliminar un contacto
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

      // Función para agregar un contacto nuevo
      async function handleAgregarContacto(e) {
        e.preventDefault();
        try {
            // 🔥 Extraer solo los IDs de los clientes y obras (si son objetos, convertirlos a IDs)
            const clientesIDs = Array.isArray(nuevoContacto.clientes) 
                ? nuevoContacto.clientes.map(c => (typeof c === "object" ? c.value : c)) 
                : [];
    
            const obrasIDs = Array.isArray(nuevoContacto.obras) 
                ? nuevoContacto.obras.map(o => (typeof o === "object" ? o.value : o)) 
                : [];
    
            const nuevoContactoData = {
                nombre: nuevoContacto.nombre,
                email: nuevoContacto.email,
                telefono: nuevoContacto.telefono,
                cargo: nuevoContacto.cargo,
                clientes: clientesIDs,
                obras: obrasIDs
            };
    
            console.log("🔹 Enviando datos al backend:", nuevoContactoData);
    
            const res = await api.post("/contactos", nuevoContactoData);
            const contactoCreado = res.data.contacto;
    
            // 🔥 Volvemos a obtener los contactos para incluir los clientes y obras asignados
            const resContactos = await api.get("/contactos");
            setContactos(resContactos.data);
    
            setNuevoContacto({ nombre: "", email: "", telefono: "", cargo: "", clientes: [], obras: [] });
    
            alert("✅ Contacto agregado con éxito");
            handleCerrarModalAgregar();
        } catch (error) {
            console.error("❌ Error al agregar contacto:", error);
            alert("❌ Error al agregar contacto.");
        }
    }

      // Función para guardar cambios en un contacto editado
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
            setContactoEditando(null);  // 💡 Cerrar el modal solo después de la actualización
      
        } catch (error) {
            console.error("❌ Error al editar contacto:", error);
            alert("❌ No se pudo actualizar el contacto.");
        }
      }

      // Funciones para abrir y cerrar modales
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
    }

    function handleCerrarModal() {
      setContactoEditando(null);
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

    // Filtrar contactos en base a la búsqueda
    const contactosFiltrados = contactos.filter(
      (c) =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.email.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.telefono?.includes(busqueda) ||

        // 🔹 Filtrar clientes asociados
        (c.clientes_asociados?.some(cliente => 
          cliente.razon_social.toLowerCase().includes(busqueda.toLowerCase())
        ) || false) ||

        // 🔹 Filtrar obras asociadas
        (c.obras_asociadas?.some(obra => 
          obra.nombre.toLowerCase().includes(busqueda.toLowerCase())
        ) || false)
        
    );
  
    // Reiniciar paginación cuando cambia la búsqueda
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  // Configuración de paginación
  const totalPaginas = Math.ceil(contactosFiltrados.length / contactosPorPagina);
  const contactosPaginados = contactosFiltrados.slice(
    (paginaActual - 1) * contactosPorPagina,
    paginaActual * contactosPorPagina
  );

  return (
    <div className="dashboard-main">
      <h2>Gestión de Contactos</h2>
      
      {/* 🔥 Barra superior: Botón de agregar contacto + Búsqueda */}
      <div className="top-actions">
          <button className="btn-agregar" onClick={handleAbrirModalAgregar}>
            ➕ Agregar Contacto
          </button>
          <input 
            type="text" 
            placeholder="Buscar contacto..." 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            className="busqueda-input" 
          />
        </div>
      
      {/* 🔹 Tabla de contactos */}
        <div className="table-responsive">
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
                <td>{contacto.nombre || "—"}</td>
                <td>{contacto.email || "—"}</td>
                <td>{contacto.telefono || "—"}</td>
                <td>{contacto.cargo || "—"}</td>
                <td>
                  {Array.isArray(contacto.clientes_asociados) && contacto.clientes_asociados.length > 0
                    ? contacto.clientes_asociados.map(c => c.razon_social).join(", ")
                    : "—"}
                </td>
                <td>
                  {Array.isArray(contacto.obras_asociadas) && contacto.obras_asociadas.length > 0
                    ? contacto.obras_asociadas.map(o => o.nombre).join(", ")
                    : "—"}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "1px", justifyContent: "left" }}>
                    <button onClick={() => handleAbrirModal(contacto)} className="edit-button">✏️Editar</button>
                    <button onClick={() => handleEliminar(contacto.id)} className="btn-eliminar">🗑Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Modal de Agregar Contacto */}
      {mostrarModalAgregar && (
        <div className="modal">
          <div className="modal-content">
            <h3>Agregar Contacto</h3>
            <form onSubmit={handleAgregarContacto} className="gestion-form-global">
              
              {/* Nombre - Solo letras y espacios */}
              <input 
                  type="text" 
                  placeholder="Nombre"
                  value={nuevoContacto.nombre} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ. ]/g, "");
                    setNuevoContacto({ ...nuevoContacto, nombre: value });
                  }} 
                />

              {/* Correo - Formato correo */}
              <input 
                type="email" 
                placeholder="Correo" 
                value={nuevoContacto.email} 
                onChange={(e) => setNuevoContacto({ ...nuevoContacto, email: e.target.value })}  
              />
  
              {/* Teléfono del contacto - Exactamente 9 dígitos numéricos */}
              <input 
                  type="text" 
                  placeholder="Teléfono" 
                  value={nuevoContacto.telefono} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);
                    setNuevoContacto({ ...nuevoContacto, telefono: value });
                  }}  
                />
  
              {/* Cargo - Solo letras y espacios */}
              <input 
                  type="text" 
                  placeholder="Cargo"
                  value={nuevoContacto.cargo} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ. ]/g, "");
                    setNuevoContacto({ ...nuevoContacto, cargo: value });
                  }} 
                />

              {/* Clientes - Obtenidos de la DB */}
              <div className="form-group">
                <label>Asignar Clientes</label>
                <Select
                  isMulti
                  options={clientes.map((cliente) => ({ value: cliente.id, label: cliente.razon_social || cliente.nombre }))}
                  value={clientes.filter((c) => nuevoContacto.clientes.includes(c.id)).map((c) => ({ value: c.id, label: c.razon_social || c.nombre }))}
                  onChange={(selected) => setNuevoContacto({ ...nuevoContacto, clientes: selected.map((s) => s.value) })}
                  placeholder="Selecciona clientes..."
                />
              </div>
              
              {/* Obras - Obtenidas de la DB */}
              <div className="form-group">
                <label>Asignar Obras</label>
                <Select
                  isMulti
                  options={obras.map((obra) => ({ value: obra.id, label: obra.nombre }))}
                  value={obras.filter((o) => nuevoContacto.obras.includes(o.id)).map((o) => ({ value: o.id, label: o.nombre }))}
                  onChange={(selected) => setNuevoContacto({ ...nuevoContacto, obras: selected.map((s) => s.value) })}
                  placeholder="Selecciona obras..."
                />
              </div>

              <button type="submit" >Guardar Contacto</button>
              <button type="button" className="btn-cancelar" onClick={handleCerrarModalAgregar}>Cancelar</button>  
            </form>
          </div>
        </div>
      )}
  
      {/* Modal de Editar Contacto */}
      {contactoEditando && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Contacto</h3>
            <form onSubmit={handleGuardarEdicion} className="gestion-form-global">
              {/* Nombre - Solo letras y espacios */}
              <input 
                type="text"
                placeholder="Nombre" 
                value={contactoEditando.nombre} 
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ. ]/g, "");
                  setContactoEditando({ ...contactoEditando, nombre: value });
                }} 
              />

              {/* Correo - Formato Correo */}
              <input 
                type="email" 
                value={contactoEditando.email} 
                onChange={(e) => setContactoEditando({ ...contactoEditando, email: e.target.value })}  
              />

              {/* Teléfono - Exactamente 9 dígitos numéricos */}
              <input 
                type="text" 
                placeholder="Teléfono"
                value={contactoEditando.telefono} 
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);
                  setContactoEditando({ ...contactoEditando, telefono: value });
                }} 
              />

              {/* Cargo - Solo letras y espacios */}
              <input 
                type="text"
                placeholder="Cargo" 
                value={contactoEditando.cargo} 
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ. ]/g, "");
                  setContactoEditando({ ...contactoEditando, cargo: value });
                }} 
              />

              <label>Modificar Clientes</label>
              <Select isMulti options={clientes.map(cliente => ({ value: cliente.id, label: cliente.razon_social }))} value={clientes.filter(cliente => contactoEditando?.clientes_asociados?.includes(cliente.id)).map(cliente => ({ value: cliente.id, label: cliente.razon_social }))} onChange={(selected) => setContactoEditando({ ...contactoEditando, clientes_asociados: selected.map(s => s.value) })} placeholder="Selecciona clientes..." />
  
              <label>Modificar Obras</label>
              <Select isMulti options={obras.map(obra => ({ value: obra.id, label: obra.nombre }))} value={obras.filter(obra => contactoEditando?.obras_asociadas?.includes(obra.id)).map(obra => ({ value: obra.id, label: obra.nombre }))} onChange={(selected) => setContactoEditando({ ...contactoEditando, obras_asociadas: selected.map(s => s.value) })} placeholder="Selecciona obras..." />
  
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