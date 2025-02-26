import { useEffect, useState } from "react";
import productosServiciosService from "../services/productosServicios";
import api from "../services/api";
import Select from "react-select";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function GestionProductosServicios() {
  const { user } = useAuth();
  if (!["Gerencia", "Oficina Técnica"].includes(user.rol)) return <p>No tienes acceso a este módulo.</p>;

  const [productos, setProductos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 5;
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  
  const [nuevaData, setNuevaData] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    atributos: [],
    empresas: [],
  });
  

  useEffect(() => {
    async function fetchData() {
      try {
        const resProductos = await productosServiciosService.obtenerTodos();
        const resEmpresas = await api.get("/empresas_proveedoras");
  
        setProductos(resProductos.data || []);
        setEmpresas(resEmpresas.data.map(e => ({ id: e.id, razon_social: e.razon_social })));
    } catch (error) {
        console.error("❌ Error al obtener datos:", error);
      }
    }
    fetchData();
  }, []);

  function handleAbrirModalAgregar() {
    setNuevaData({
      nombre: "",
      descripcion: "",
      tipo: "",
      atributos: [],
      empresas: []
    });
    setMostrarModalAgregar(true);
  }
  
  function handleCerrarModalAgregar() {
    setMostrarModalAgregar(false);
  }
  

  function handleAbrirModal(producto) {
    setProductoEditando({
      ...producto,
      atributos: Array.isArray(producto.atributos) ? producto.atributos : JSON.parse(producto.atributos || "[]"),
      empresas: Array.isArray(producto.empresas) ? producto.empresas.map((e) => e.id) : []
    });
    setMostrarModal(true);
  }

  function handleCerrarModal() {
    setProductoEditando(null);
    setMostrarModal(false);
  }
  
  async function handleCrearProducto(e) {
    e.preventDefault();
    try {
      if (!nuevaData.nombre || !nuevaData.tipo || !nuevaData.empresas.length) {
        alert("⚠️ Debes completar todos los campos obligatorios.");
        return;
      }

      const productoData = {
        ...nuevaData,
        atributos: JSON.stringify(nuevaData.atributos)
      };

      await productosServiciosService.crear(productoData);
      alert("✅ Producto/Servicio creado con éxito");

      const resProductos = await productosServiciosService.obtenerTodos();
      setProductos(resProductos.data);
      handleCerrarModalAgregar();
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      alert("❌ No se pudo guardar.");
    }
  }

  async function handleActualizarProducto(e) {
    e.preventDefault();
    try {
      if (!productoEditando || !productoEditando.id) {
        alert("❌ Error: No se ha seleccionado un producto válido para actualizar.");
        return;
      }

      const productoData = {
        nombre: productoEditando.nombre,
        descripcion: productoEditando.descripcion,
        tipo: productoEditando.tipo,
        atributos: JSON.stringify(productoEditando.atributos), // 🔥 Asegurar que los atributos sean actualizados correctamente
        empresas: productoEditando.empresas
      };      

      await productosServiciosService.actualizar(productoEditando.id, productoData);
      alert("✅ Producto/Servicio actualizado con éxito");

      const resProductos = await productosServiciosService.obtenerTodos();
      setProductos(resProductos.data);
      handleCerrarModal();
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      alert("❌ No se pudo actualizar.");
    }
  }

  function handleAgregarAtributo() {
    if (mostrarModalAgregar) {
      // 🔥 Agregar atributo en `nuevaData` cuando estamos en el modal de agregar
      setNuevaData((prev) => ({
        ...prev,
        atributos: [...(prev.atributos || []), { key: "", values: [] }]
      }));
    } else if (mostrarModal) {
      // 🔥 Agregar atributo en `productoEditando` cuando estamos en el modal de edición
      setProductoEditando((prev) => ({
        ...prev,
        atributos: [...(prev.atributos || []), { key: "", values: [] }]
      }));
    }
  }  

  function handleEliminarAtributo(index) {
    if (mostrarModalAgregar) {
      setNuevaData((prev) => ({
        ...prev,
        atributos: prev.atributos.filter((_, i) => i !== index)
      }));
    } else if (mostrarModal) {
      setProductoEditando((prev) => ({
        ...prev,
        atributos: prev.atributos.filter((_, i) => i !== index)
      }));
    }
  }
  
   
  async function handleEliminar(id) {
    if (!window.confirm("¿Seguro que quieres eliminar este producto/servicio?")) return;
    try {
      await productosServiciosService.eliminar(id);
      setProductos(productos.filter((p) => p.id !== id));
      alert("✅ Producto/Servicio eliminado con éxito");
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
    }
  }

  function cambiarPagina(nuevaPagina) {
    setPaginaActual(nuevaPagina);
  }

  const productosPaginados = productos.slice((paginaActual - 1) * productosPorPagina, paginaActual * productosPorPagina);


  return (
    <div className="dashboard-main">
      <h2>Gestión de Productos y Servicios</h2>

      <div className="top-actions">
        <button className="add-button" onClick={handleAbrirModalAgregar}>
          ➕ Agregar Producto/Servicio
        </button>
        <input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="busqueda-input" />
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Empresas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosPaginados
            .filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
            .map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.tipo}</td>
                <td>{producto.empresas?.map((e) => e.razon_social).join(", ") || "—"}</td>
                <td>
                  <button onClick={() => handleAbrirModal(producto)}>✏️</button>
                  <button onClick={() => handleEliminar(producto.id)}>🗑️</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      
      {/* Paginación Mejorada */}
    <div className="pagination">
    <button 
        className="" 
        onClick={() => cambiarPagina(paginaActual - 1)} 
        disabled={paginaActual === 1}
    >
        ◀ Anterior
    </button>

    {Array.from({ length: Math.ceil(productos.length / productosPorPagina) }, (_, i) => (
        <button 
        key={i} 
        className={` ${paginaActual === i + 1 ? "active" : ""}`} 
        onClick={() => cambiarPagina(i + 1)}
        >
        {i + 1}
        </button>
    ))}

    <button 
        className="" 
        onClick={() => cambiarPagina(paginaActual + 1)} 
        disabled={paginaActual === Math.ceil(productos.length / productosPorPagina)}
    >
        Siguiente ▶
    </button>
    </div>


    {mostrarModalAgregar && (
        <div className="modal">
            <div className="modal-content">
                <h3>Agregar Producto/Servicio</h3>
                <form onSubmit={handleCrearProducto} className="gestion-productos-form">
                    
                    {/* Nombre */}
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={nuevaData.nombre}
                        onChange={(e) => setNuevaData({ ...nuevaData, nombre: e.target.value })}
                        required
                    />

                    {/* Descripción */}
                    <label>Descripción</label>
                    <textarea
                        value={nuevaData.descripcion}
                        onChange={(e) => setNuevaData({ ...nuevaData, descripcion: e.target.value })}
                    />

                    {/* Tipo */}
                    <label>Tipo</label>
                    <select
                        value={nuevaData.tipo}
                        onChange={(e) => setNuevaData({ ...nuevaData, tipo: e.target.value })}
                        required
                    >
                        <option value="">Seleccionar Tipo</option>
                        <option value="Equipo">Equipo</option>
                        <option value="Servicio">Servicio</option>
                    </select>

                    {/* Atributos Personalizados */}
                    <h4>Atributos Personalizados</h4>
                    <div className="atributos-container">
                        <table className="atributos-table">
                            <thead>
                                <tr>
                                    <th>Nombre del Atributo</th>
                                    <th>Valores Permitidos</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nuevaData.atributos.map((atributo, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="text"
                                                value={atributo.key}
                                                onChange={(e) => {
                                                    const nuevosAtributos = [...nuevaData.atributos];
                                                    nuevosAtributos[index].key = e.target.value;
                                                    setNuevaData({ ...nuevaData, atributos: nuevosAtributos });
                                                }}
                                                placeholder="Ej: Capacidad, Tamaño, Color"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={atributo.values?.join(", ") || ""}
                                                onChange={(e) => {
                                                    const nuevosAtributos = [...nuevaData.atributos];
                                                    nuevosAtributos[index].values = e.target.value.split(",").map((v) => v.trim());
                                                    setNuevaData({ ...nuevaData, atributos: nuevosAtributos });
                                                }}
                                                placeholder="Ej: 1.5tn, 2tn, 3tn"
                                            />
                                        </td>
                                        <td>
                                            <button 
                                                className="btn-eliminar"
                                                type="button" 
                                                onClick={() => handleEliminarAtributo(index)}
                                            >
                                                ❌
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Botón para agregar atributos */}
                    <button className="btn-agregar" type="button" onClick={handleAgregarAtributo}>➕ Agregar Atributo</button>

                    {/* Empresas Proveedoras */}
                    <label>Empresas Proveedoras</label>
                    <Select
                        isMulti
                        options={empresas.map((empresa) => ({ value: empresa.id, label: empresa.razon_social }))}
                        value={empresas
                            .filter((e) => nuevaData.empresas.includes(e.id))
                            .map((e) => ({ value: e.id, label: e.razon_social }))}  
                        onChange={(selected) =>
                            setNuevaData({ ...nuevaData, empresas: selected.map((s) => s.value) })
                        }
                        placeholder="Selecciona empresas..."
                    />

                    {/* Botones de acción */}
                    <div className="botones-modal">
                        <button type="submit" className="btn-guardar">Guardar</button>
                        <button type="button" className="btn-cancelar" onClick={handleCerrarModalAgregar}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    )}

    {/* Modal de Edición */}
    {mostrarModal && (
        <div className="modal">
            <div className="modal-content">
                <h3>Editar Producto/Servicio</h3>
                <form onSubmit={handleActualizarProducto} className="gestion-productos-form">
                    
                    {/* Nombre */}
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={productoEditando?.nombre || ""}
                        onChange={(e) => setProductoEditando({ ...productoEditando, nombre: e.target.value })}
                        required
                    />

                    {/* Descripción */}
                    <label>Descripción</label>
                    <textarea
                        value={productoEditando?.descripcion || ""}
                        onChange={(e) => setProductoEditando({ ...productoEditando, descripcion: e.target.value })}
                    />

                    {/* Tipo */}
                    <label>Tipo</label>
                    <select
                        value={productoEditando?.tipo || ""}
                        onChange={(e) => setProductoEditando({ ...productoEditando, tipo: e.target.value })}
                        required
                    >
                        <option value="">Seleccionar Tipo</option>
                        <option value="Equipo">Equipo</option>
                        <option value="Servicio">Servicio</option>
                    </select>

                    {/* Atributos Personalizados */}
                    <h4>Atributos Personalizados</h4>
                    <div className="atributos-container">
                        <table className="atributos-table">
                            <thead>
                                <tr>
                                    <th>Nombre del Atributo</th>
                                    <th>Valores Permitidos</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productoEditando?.atributos.map((atributo, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="text"
                                                value={atributo.key}
                                                onChange={(e) => {
                                                    const nuevosAtributos = [...productoEditando.atributos];
                                                    nuevosAtributos[index].key = e.target.value;
                                                    setProductoEditando({ ...productoEditando, atributos: nuevosAtributos });
                                                }}
                                                placeholder="Ej: Capacidad, Tamaño, Color"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={atributo.values?.join(", ") || ""}
                                                onChange={(e) => {
                                                    const nuevosAtributos = [...productoEditando.atributos];
                                                    nuevosAtributos[index].values = e.target.value.split(",").map((v) => v.trim());
                                                    setProductoEditando({ ...productoEditando, atributos: nuevosAtributos });
                                                }}
                                                placeholder="Ej: 1.5tn, 2tn, 3tn"
                                            />
                                        </td>
                                        <td>
                                            <button 
                                                className="btn-eliminar"
                                                type="button" 
                                                onClick={() => handleEliminarAtributo(index)}
                                            >
                                                ❌
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Botón para agregar atributos */}
                    <button className="btn-agregar" type="button" onClick={handleAgregarAtributo}>➕ Agregar Atributo</button>

                    {/* Empresas Proveedoras */}
                    <label>Empresas Proveedoras</label>
                    <Select
                        isMulti
                        options={empresas.map((empresa) => ({ value: empresa.id, label: empresa.razon_social }))}
                        value={empresas
                            .filter((e) => Array.isArray(productoEditando?.empresas) && productoEditando.empresas.includes(e.id))
                            .map((e) => ({ value: e.id, label: e.razon_social }))}  
                        onChange={(selected) =>
                            setProductoEditando({ ...productoEditando, empresas: selected.map((s) => s.value) })
                        }
                        placeholder="Selecciona empresas..."
                    />

                    {/* Botones de acción */}
                    <div className="botones-modal">
                        <button type="submit" className="btn-guardar">Guardar</button>
                        <button type="button" className="btn-cancelar" onClick={handleCerrarModal}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    )}

    </div>
    );
}