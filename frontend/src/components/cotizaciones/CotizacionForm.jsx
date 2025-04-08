
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "../../styles/cotizacionForm.css";

export default function CotizacionForm() {
  const { user } = useAuth();
  const [contactos, setContactos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [obras, setObras] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);
  
  const [contacto, setContacto] = useState("");
  const [cliente, setCliente] = useState("");
  const [obra, setObra] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [motivo, setMotivo] = useState("ALQUILER");
  const [observaciones, setObservaciones] = useState("");

  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [totalSinDescuento, setTotalSinDescuento] = useState(0);
  const [totalConDescuento, setTotalConDescuento] = useState(0);
  const [empresaFiltro, setEmpresaFiltro] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Obtener contactos desde la API
        const contactosRes = await api.get("/contactos");
        setContactos(contactosRes.data || []);

        // Obtener filiales de innova
        const empresasRes = await api.get("/empresas_proveedoras");
        setEmpresas(empresasRes.data || []);

        // Obtener cotizaciones
        const cotizacionesRes = await api.get("/cotizaciones");
        setCotizaciones(cotizacionesRes.data.cotizaciones || []);

      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
      }
    }
    fetchData();
  }, []);


  // Filtrar obras y clientes según el contacto seleccionado
  useEffect(() => {
    if (contacto) {
      const contactoSeleccionado = contactos.find(c => c.id === parseInt(contacto));
  
      if (contactoSeleccionado && contactoSeleccionado.clientes_asociados) {
        
        // Asignar los clientes correctamente
        setClientesFiltrados(contactoSeleccionado.clientes_asociados);
      } else {
        setClientesFiltrados([]);
      }
    } else {
      setClientesFiltrados([]);
    }
  }, [contacto, contactos]);  
  
  
  useEffect(() => {
    if (contacto) {
      const contactoSeleccionado = contactos.find(c => c.id === parseInt(contacto));
  
      if (contactoSeleccionado && contactoSeleccionado.obras_asociadas) {
        
        // Asignar las obras correctamente
        setObras(contactoSeleccionado.obras_asociadas);
      } else {
        setObras([]);
      }
    } else {
      setObras([]);
    }
  }, [contacto, contactos]);  

  // Obtener productos de la filiales de innova seleccionada
  useEffect(() => {
    if (empresa) {
      async function fetchProductos() {
        try {

          const productosRes = await api.get(`/productos-servicios?empresa=${empresa}`);
          
          setProductos(
            productosRes.data.map(producto => ({
              ...producto,
              atributos: producto.atributos ? JSON.parse(producto.atributos) : [] // Convierte a JSON si no es nulo
            }))
          );
          
          
        } catch (error) {
          console.error("❌ Error al obtener productos:", error);
        }
      }
      fetchProductos();
    } else {
      setProductos([]); // Si no hay filial seleccionada, limpiar productos
    }
  }, [empresa]);  

  // Calcular totales
  useEffect(() => {
    let total = productosSeleccionados.reduce((sum, prod) => sum + (prod.precio_unitario * prod.cantidad), 0);
    setTotalSinDescuento(total);
    setTotalConDescuento(total - descuento);
  }, [productosSeleccionados, descuento]);

  function handleProductoSeleccionado(event, producto) {
    const cantidad = parseFloat(event.target.value);
    setProductosSeleccionados(prev =>
      prev.map(p => p.id === producto.id ? { ...p, cantidad } : p)
    );
  }

  function handleParametroCambio(productoId, parametro, valor) {
    setProductosSeleccionados((prev) =>
      prev.map((p) =>
        p.id === productoId
          ? {
              ...p,
              atributos: p.atributos.map(attr =>
                attr.key === parametro ? { ...attr, values: [valor] } : attr
              )
            }
          : p
      )
    );
  }   

  async function handleSubmit(e) {
    e.preventDefault();

    if (!contacto || !cliente || !obra || !empresa || productosSeleccionados.length === 0) {
      alert("❌ Todos los campos son obligatorios.");
      return;
    }

    const nuevaCotizacion = {
      empresa_proveedora_id: empresa,
      contacto_id: contacto,
      usuario_id: user.id,
      motivo,
      observaciones,
      productos: productosSeleccionados,
      descuento,
      total_sin_descuento: totalSinDescuento,
      total_con_descuento: totalConDescuento,
    };

    try {
      const response = await api.post("/cotizaciones", nuevaCotizacion);
      alert("✅ Cotización creada con éxito");
      setCotizaciones([...cotizaciones, response.data.cotizacion]);
    } catch (error) {
      console.error("❌ Error al crear cotización:", error);
      alert("❌ Error al guardar la cotización.");
    }
  }

  async function handleEliminarCotizacion(id) {
    try {
      await api.delete(`/cotizaciones/${id}`);
      setCotizaciones(cotizaciones.filter(cot => cot.id !== id));
      alert("✅ Cotización eliminada con éxito");
    } catch (error) {
      console.error("❌ Error al eliminar cotización:", error);
      alert("❌ No se pudo eliminar la cotización.");
    }
  }

  return (
    <div className="cotizacion-container">
      <h2>Gestión de Cotizaciones</h2>

      <form onSubmit={handleSubmit}>
        {/* SELECCIÓN DE CONTACTO */}
        <select onChange={(e) => setContacto(e.target.value)} required>
          <option value="">Selecciona un contacto</option>
          {contactos.length > 0 ? (
            contactos.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))
          ) : (
            <option disabled>No hay contactos disponibles</option>
          )}
        </select>


        {/* SELECCIÓN DE CLIENTE (DINÁMICO) */}
        <select onChange={(e) => setCliente(e.target.value)} required disabled={!contacto}>
          <option value="">Selecciona un cliente</option>
          {clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>{cliente.razon_social}</option>
            ))
          ) : (
            <option disabled>No hay clientes disponibles</option>
          )}
        </select>

        {/* SELECCIÓN DE OBRA (DINÁMICO) */}
        <select onChange={(e) => setObra(e.target.value)} required disabled={!cliente}>
          <option value="">Selecciona una obra</option>
          {obras.map((o) => (
            <option key={o.id} value={o.id}>{o.nombre}</option>
          ))}
        </select>

        {/* SELECCIÓN DE FILIAL DE INNOVA */}
        <select onChange={(e) => setEmpresa(e.target.value)} required disabled={!obra}>
          <option value="">Selecciona una filial de innova</option>
          {empresas.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.razon_social}</option>
          ))}
        </select>

        {/* SELECCIÓN DE PRODUCTOS */}
        <h3>Seleccionar Productos</h3>
        {productos.map((producto) => (
          <div key={producto.id} className="producto-item">
            <span>{producto.nombre} - S/{producto.precio_unitario}</span>

            {/* Mostrar atributos dinámicos */}
            {producto.atributos && Array.isArray(producto.atributos) && producto.atributos.length > 0 ? (
              producto.atributos.map((atributo, index) => (
                <div key={index} className="parametro-item">
                  <label>{atributo.key}:</label>
                  
                  {/* Si tiene valores predefinidos, muestra un select */}
                  {atributo.values && atributo.values.length > 0 ? (
                    <select onChange={(e) => handleParametroCambio(producto.id, atributo.key, e.target.value)}>
                      <option value="">Selecciona</option>
                      {atributo.values.map((value, idx) => (
                        <option key={idx} value={value}>{value}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={atributo.values?.[0] || ""}
                      onChange={(e) => handleParametroCambio(producto.id, atributo.key, e.target.value)}
                    />
                  )}
                </div>
              ))
            ) : (
              <p>❌ No hay atributos disponibles</p>
            )}


            {/* Input de cantidad */}
            <input
              type="number"
              min="1"
              defaultValue="1"
              onChange={(e) => handleProductoSeleccionado(e, producto)}
            />
          </div>
        ))}


        <h3>Totales</h3>
        <p>Total sin descuento: S/{totalSinDescuento.toFixed(2)}</p>
        <p>Total con descuento: S/{totalConDescuento.toFixed(2)}</p>

        <button type="submit">Guardar Cotización</button>
      </form>

      <h2>Listado de Cotizaciones</h2>
      <select onChange={(e) => setEmpresaFiltro(e.target.value)}>
        <option value="">Filtrar por filial de innova</option>
        {empresas.map(empresa => (
          <option key={empresa.id} value={empresa.id}>
            {empresa.razon_social}
          </option>
        ))}
      </select>

      <ul>
        {cotizaciones
          .filter(cot => empresaFiltro === "" || cot.empresa_proveedora_id === parseInt(empresaFiltro))
          .map(cotizacion => (
            <li key={cotizacion.id}>
              {cotizacion.codigo} - {cotizacion.estado} - Total: S/{cotizacion.total_con_descuento}
              <button onClick={() => handleEliminarCotizacion(cotizacion.id)}>Eliminar</button>
            </li>
          ))}
      </ul>
    </div>
  );
}