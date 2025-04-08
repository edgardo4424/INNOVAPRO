import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/dashboard.css";
import {
  validarTextoLetras,
  validarRazonSocial,
  validarRUC,
  validarDNI,
  validarCE,
  validarPasaporte,
  validarDireccion,
  validarTelefono,
  validarEmail,
} from "../../utils/validaciones";
import useValidacionCampo  from "../../hooks/useValidacionCampo";
import useValidacionCampoEdicion from "../../hooks/useValidacionCampoEdicion";
import { buscarDatosPorRUC } from "../../services/api";

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
  const [rucNoEncontrado, setRucNoEncontrado] = useState(false);

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

  const handleBuscarRUC = async () => {
    const rucLimpio = ruc.valor.trim();
    if (!validarRUC(rucLimpio)) return;
  
    const resultado = await buscarDatosPorRUC(rucLimpio);
  
    if (!resultado) {
      setRucNoEncontrado(true);
      razonSocial.setValor("");
      direccion.setValor("");
      return;
    }

    setRucNoEncontrado(false);
  
    // Rellenamos los campos automáticamente
    setNuevoCliente((prev) => ({
      ...prev,
      razon_social: resultado.razon_social,
      domicilio_fiscal: resultado.domicilio_fiscal,
    }));
  
    razonSocial.setValor(resultado.razon_social);
    direccion.setValor(resultado.domicilio_fiscal);
  };
  
  
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
  
  // Hook para campos del formulario de agregar
  const razonSocial = useValidacionCampo("", validarRazonSocial, "Solo letras y espacios");
  const ruc = useValidacionCampo("", validarRUC, "RUC inválido");
  const representante = useValidacionCampo("", validarTextoLetras, "Nombre inválido");
  const dniRep = useValidacionCampo("", () => true, "Documento inválido");
  const direccion = useValidacionCampo("", validarDireccion, "Dirección inválida");
  const dniNatural = useValidacionCampo("", () => true, "Documento inválido");
  const telefono = useValidacionCampo("", validarTelefono, "Teléfono inválido");
  const email = useValidacionCampo("", validarEmail, "Correo inválido");
  
  // Hook para campos del formulario de edición
  const razonSocialEd = useValidacionCampoEdicion(clienteEditando?.razon_social, validarRazonSocial, "Razón Social inválida");
  const rucEd = useValidacionCampoEdicion(clienteEditando?.ruc, validarRUC, "RUC inválido");
  const representanteEd = useValidacionCampoEdicion(clienteEditando?.representante_legal, validarTextoLetras, "Nombre inválido");
  const dniRepEd = useValidacionCampoEdicion(clienteEditando?.dni_representante, () => true, "Documento inválido");
  const direccionEd = useValidacionCampoEdicion(clienteEditando?.domicilio_fiscal, validarDireccion, "Dirección inválida");
  const telefonoEd = useValidacionCampoEdicion(clienteEditando?.telefono, validarTelefono, "Teléfono inválido");
  const emailEd = useValidacionCampoEdicion(clienteEditando?.email, validarEmail, "Correo inválido");
  const dniNaturaled = useValidacionCampoEdicion(clienteEditando?.dni, () => true, "Documento inválido");

  const resetearFormularioCliente = () => {
    setNuevoCliente({
      tipo: "Persona Jurídica",
      tipo_documento: "DNI",
    });
  
    razonSocial.setValor("");
    razonSocial.setError("");
  
    ruc.setValor("");
    ruc.setError("");
  
    representante.setValor("");
    representante.setError("");
  
    dniRep.setValor("");
    dniRep.setError("");
  
    direccion.setValor("");
    direccion.setError("");
  
    dniNatural.setValor("");
    dniNatural.setError("");
  
    telefono.setValor("");
    telefono.setError("");
  
    email.setValor("");
    email.setError("");

    setRucNoEncontrado(false);
  };

  const resetearFormularioClienteEditando = () => {
    setClienteEditando({
      tipo: "Persona Jurídica",
      tipo_documento: "DNI",
    });
  
    razonSocialEd.setValor("");
    razonSocialEd.setError("");
  
    rucEd.setValor("");
    rucEd.setError("");
  
    representanteEd.setValor("");
    representanteEd.setError("");
  
    dniRepEd.setValor("");
    dniRepEd.setError("");
  
    direccionEd.setValor("");
    direccionEd.setError("");
  
    dniNaturaled.setValor("");
    dniNaturaled.setError("");
  
    telefonoEd.setValor("");
    telefonoEd.setError("");
  
    emailEd.setValor("");
    emailEd.setError("");

    setRucNoEncontrado(false);
  };
  
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
                        <td>{cliente.razon_social? cliente.razon_social: <span>&mdash;</span>}</td>
                        <td>{cliente.tipo? cliente.tipo: <span>&mdash;</span>}</td>
                        <td>{cliente.ruc || cliente.dni? (cliente.ruc || cliente.dni): <span>&mdash;</span>}</td>
                        <td>{cliente.telefono? cliente.telefono: <span>&mdash;</span>}</td>
                        <td>{cliente.email? cliente.email : <span>&mdash;</span>}</td>
                        <td>{cliente.domicilio_fiscal? cliente.domicilio_fiscal : <span>&mdash;</span>}</td>
                        <td>{cliente.representante_legal? cliente.representante_legal: <span>&mdash;</span>}</td>
                        <td>{cliente.dni_representante? cliente.dni_representante: <span>&mdash;</span>}</td>
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
        <div className="centro-modal">
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

              {/* RUC - Exactamente 11 dígitos numéricos */}
              {nuevoCliente.tipo === "Persona Jurídica" && (
              <>
                <input 
                      type="text" 
                      placeholder="RUC" 
                      value={ruc.valor} 
                      onChange={(e) => {
                        ruc.onChange(e);
                        setNuevoCliente(prev => ({ ...prev, ruc: e.target.value }));
                        }}
                      onBlur={handleBuscarRUC}
                      required 
                    />
                    <small className="form-text-info">
                      Ingresa el RUC y sal del campo para completar los datos automáticamente desde SUNAT.
                    </small>
                    {ruc.error && <p className="error-message">{ruc.error}</p>}
                    {rucNoEncontrado && (
                      <p className="error-message">
                        Este RUC no se encuentra en el padrón de SUNAT. Por favor completa los datos manualmente.
                      </p>
                    )}
                </>
              )}
              
              {/* Razon Social/Nombre - Solo letras y espacios */}
              <input 
                  type="text" 
                  placeholder={
                    nuevoCliente.tipo === "Persona Jurídica"
                    ? "Razon Social"
                    : "Nombre Completo"
                  }
                  value={razonSocial.valor} 
                  onChange={(e) => {
                    razonSocial.onChange(e);
                    setNuevoCliente(prev => ({ ...prev, razon_social: e.target.value }));
                  }}
                />
                {razonSocial.error && <p className="error-message">{razonSocial.error}</p>}

              {nuevoCliente.tipo === "Persona Jurídica" ? (
                <>
                  {/* Representante Legal - Solo letras y espacios */}
                  <input 
                    type="text" 
                    placeholder="Representante Legal" 
                    value={representante.valor} 
                    onChange={(e) => {
                      representante.onChange(e);
                      setNuevoCliente(prev => ({ ...prev, representante_legal: e.target.value }));
                    }}
                  />
                  {representante.error && <p className="error-message">{representante.error}</p>}

                  {/* Tipo de Documento - Representante */}
                  <select 
                      value={nuevoCliente.tipo_documento || "DNI"} 
                      onChange={(e) => setNuevoCliente({ ...nuevoCliente, tipo_documento: e.target.value })}
                      required
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">CE</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>

                  {/* Número de Documento - Representante */}
                  <input 
                    type="text" 
                    placeholder="Número de Documento" 
                    value={dniRep.valor} 
                    onChange={(e) => {
                      const tipo = nuevoCliente.tipo_documento;
                      let validador;
                      if (tipo === "DNI") validador = validarDNI;
                      else if (tipo === "CE") validador = validarCE;
                      else validador = validarPasaporte;

                      dniRep.onChange(e, validador);
                      setNuevoCliente(prev => ({ ...prev, dni_representante: e.target.value}));
                    }}
                    required 
                  />
                  {dniRep.error && <p className="error-message">{dniRep.error}</p>}

                  {/* Dirección - Permite letras, números y caracteres básicos */}
                  <input 
                    type="text" 
                    placeholder="Domicilio Fiscal" 
                    value={direccion.valor} 
                    onChange={(e) => {
                      direccion.onChange(e);
                      setNuevoCliente(prev => ({ ...prev, domicilio_fiscal: e.target.value }));
                    }} 
                  />
                  {direccion.error && <p className="error-message">{direccion.error}</p>}
                </>
              ) : (
                <>
                  {/* Tipo de Documento - Cliente */}
                  <select 
                    value={nuevoCliente.tipo_documento || "DNI"} 
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, tipo_documento: e.target.value })}
                    required
                  >
                    <option value="DNI">DNI</option>
                    <option value="CE">CE</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>

                  {/* Número de Documento - Cliente */}
                  <input 
                  type="text" 
                  placeholder="Número de Documento" 
                  value={dniNatural.valor} 
                  onChange={(e) => {
                    const tipo = nuevoCliente.tipo_documento;
                    let validador;
                    if (tipo === "DNI") validador = validarDNI;
                    else if (tipo === "CE") validador = validarCE;
                    else validador = validarPasaporte;

                    dniNatural.onChange(e, validador);
                    setNuevoCliente(prev => ({ ...prev, dniNatural: e.target.value}));
                  }}
                  required 
                />
                {dniNatural.error && <p className="error-message">{dniNatural.error}</p>}
                </>
            )}

            {/* Teléfono - Exactamente 9 dígitos numéricos */}
            <input 
                  type="text" 
                  placeholder="Teléfono" 
                  value={telefono.valor} 
                  onChange={(e) => {
                    telefono.onChange(e);
                    setNuevoCliente(prev => ({ ...prev, telefono: e.target.value }));
                  }}  
                />
                {telefono.error && <p className="error-message">{telefono.error}</p>}

              {/* Correo - Formato correo */}
              <input 
                type="email" 
                placeholder="Correo" 
                value={email.valor} 
                onChange={(e) => {
                  email.onChange(e);
                  setNuevoCliente(prev => ({ ...prev, email: e.target.value}));
                }}  
              />
              {email.error && <p className="error-message">{email.error}</p>}

              <button
                type="submit"
                className="btn-guardar"
                disabled={
                  // Validación general
                  !razonSocial.valor ||
                  !!razonSocial.error ||
                  !telefono.valor ||
                  !!telefono.error ||
                  !email.valor ||
                  !!email.error ||

                  // Validación condicional según tipo de cliente
                  (nuevoCliente.tipo === "Persona Jurídica" && (
                    !ruc.valor ||
                    !!ruc.error ||
                    !representante.valor ||
                    !!representante.error ||
                    !dniRep.valor ||
                    !!dniRep.error ||
                    !direccion.valor ||
                    !!direccion.error
                  )) ||

                  (nuevoCliente.tipo === "Persona Natural" && (
                    !dniNatural.valor ||
                    !!dniNatural.error
                  ))
                }
              >
                Guardar Cliente
              </button>
              <button 
                type="button" 
                className="btn-cancelar" 
                onClick={() => {
                  resetearFormularioCliente();
                  handleCerrarModalAgregar();
                }}
              >
                Cancelar
              </button>
            </form>
            </div>
          </div>
      )}

      {/* 🔹 Modal de edición */}
      {clienteEditando && (
        <div className="centro-modal">
          <div className="modal-content">
            <h3>Editar Cliente</h3>
            <form onSubmit={handleGuardarEdicion} className="gestion-form-global">
            <label>Tipo de Cliente:</label>
            <select value={clienteEditando.tipo} onChange={(e) => setClienteEditando({ ...clienteEditando, tipo: e.target.value })}>
              <option value="Persona Jurídica">Persona Jurídica</option>
              <option value="Persona Natural">Persona Natural</option>
            </select>

            {/* RUC - Exactamente 11 dígitos numéricos */}
            {clienteEditando.tipo === "Persona Jurídica" && (
              <>
                <input 
                      type="text" 
                      placeholder="RUC" 
                      value={rucEd.valor} 
                      onChange={(e) => {
                        rucEd.onChange(e);
                        setClienteEditando(prev => ({ ...prev, ruc: e.target.value }));
                        }}
                      onBlur={handleBuscarRUC}
                      required 
                    />
                    <small className="form-text-info">
                      Ingresa el RUC y sal del campo para completar los datos automáticamente desde SUNAT.
                    </small>
                    {rucEd.error && <p className="error-message">{rucEd.error}</p>}
                    {rucNoEncontrado && (
                      <p className="error-message">
                        Este RUC no se encuentra en el padrón de SUNAT. Por favor completa los datos manualmente.
                      </p>
                    )}
                </>
              )}
              
              {/* Razon Social/Nombre - Solo letras y espacios */}
              <input 
                  type="text" 
                  placeholder={
                    clienteEditando.tipo === "Persona Jurídica"
                    ? "Razon Social"
                    : "Nombre Completo"
                  }
                  value={razonSocialEd.valor} 
                  onChange={(e) => {
                    razonSocialEd.onChange(e);
                    setClienteEditando(prev => ({ ...prev, razon_social: e.target.value }));
                  }}
                />
                {razonSocialEd.error && <p className="error-message">{razonSocialEd.error}</p>}

            {clienteEditando.tipo === "Persona Jurídica" ? (
            <>
              {/* Representante Legal - Solo letras y espacios */}
              <input 
                    type="text" 
                    placeholder="Representante Legal" 
                    value={representanteEd.valor} 
                    onChange={(e) => {
                      representanteEd.onChange(e);
                      setClienteEditando(prev => ({ ...prev, representante_legal: e.target.value }));
                    }}
              />
              {representanteEd.error && <p className="error-message">{representanteEd.error}</p>}

               {/* Tipo de Documento - Representante */}
               <select 
                      value={clienteEditando.tipo_documento || "DNI"} 
                      onChange={(e) => setClienteEditando({ ...clienteEditando, tipo_documento: e.target.value })}
                      required
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">CE</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>

                  {/* Número de Documento - Representante */}
                  <input 
                    type="text" 
                    placeholder="Número de Documento" 
                    value={dniRepEd.valor} 
                    onChange={(e) => {
                      const tipo = clienteEditando.tipo_documento;
                      let validador;
                      if (tipo === "DNI") validador = validarDNI;
                      else if (tipo === "CE") validador = validarCE;
                      else validador = validarPasaporte;

                      dniRepEd.onChange(e, validador);
                      setClienteEditando(prev => ({ ...prev, dni_representante: e.target.value}));
                    }}
                    required 
                  />
                  {dniRepEd.error && <p className="error-message">{dniRepEd.error}</p>}

                  {/* Dirección - Permite letras, números y caracteres básicos */}
                  <input 
                    type="text" 
                    placeholder="Domicilio Fiscal" 
                    value={direccionEd.valor} 
                    onChange={(e) => {
                      direccionEd.onChange(e);
                      setClienteEditando(prev => ({ ...prev, domicilio_fiscal: e.target.value }));
                    }} 
                  />
                  {direccionEd.error && <p className="error-message">{direccionEd.error}</p>}
                  </>
              ) : (
                <>
                  {/* Tipo de Documento - Cliente */}
                  <select 
                    value={clienteEditando.tipo_documento || "DNI"} 
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, tipo_documento: e.target.value })}
                    required
                  >
                    <option value="DNI">DNI</option>
                    <option value="CE">CE</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>

                  {/* Número de Documento - Cliente */}
                  <input 
                  type="text" 
                  placeholder="Número de Documento" 
                  value={dniNaturaled.valor} 
                  onChange={(e) => {
                    const tipo = clienteEditando.tipo_documento;
                    let validador;
                    if (tipo === "DNI") validador = validarDNI;
                    else if (tipo === "CE") validador = validarCE;
                    else validador = validarPasaporte;

                    dniNaturaled.onChange(e, validador);
                    setClienteEditando(prev => ({ ...prev, dniNatural: e.target.value}));
                  }}
                  required 
                />
                {dniNaturaled.error && <p className="error-message">{dniNaturaled.error}</p>}
                </>
            )}

            {/* Teléfono - Exactamente 9 dígitos numéricos */}
            <input 
                  type="text" 
                  placeholder="Teléfono" 
                  value={telefonoEd.valor} 
                  onChange={(e) => {
                    telefonoEd.onChange(e);
                    setClienteEditando(prev => ({ ...prev, telefono: e.target.value }));
                  }}  
                />
                {telefonoEd.error && <p className="error-message">{telefonoEd.error}</p>}

              {/* Correo - Formato correo */}
              <input 
                type="email" 
                placeholder="Correo" 
                value={emailEd.valor} 
                onChange={(e) => {
                  emailEd.onChange(e);
                  setClienteEditando(prev => ({ ...prev, email: e.target.value}));
                }}  
              />
              {emailEd.error && <p className="error-message">{emailEd.error}</p>}

              {/* Botones de acción */}
              <button
                type="submit"
                className="btn-guardar"
                disabled={
                  // Validación general
                  !razonSocialEd.valor ||
                  !!razonSocialEd.error ||
                  !telefonoEd.valor ||
                  !!telefonoEd.error ||
                  !email.valor ||
                  !!email.error ||

                  // Validación condicional según tipo de cliente
                  (clienteEditando.tipo === "Persona Jurídica" && (
                    !rucEd.valor ||
                    !!rucEd.error ||
                    !representanteEd.valor ||
                    !!representanteEd.error ||
                    !dniRepEd.valor ||
                    !!dniRepEd.error ||
                    !direccionEd.valor ||
                    !!direccionEd.error
                  )) ||

                  (clienteEditando.tipo === "Persona Natural" && (
                    !dniNaturaled.valor ||
                    !!dniNaturaled.error
                  ))
                }
              >
                Guardar Cliente
              </button>
              <button 
                type="button" 
                className="btn-cancelar" 
                onClick={() => {
                  resetearFormularioClienteEditando();
                  handleCerrarModal();
                }}
              >
                Cancelar
              </button>
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