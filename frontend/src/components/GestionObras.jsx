import { useEffect, useState} from "react";
import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api";
import Select from "react-select";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";


const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export default function GestionObras() {

  // Obtiene información del usuario autenticado
  const { user } = useAuth();

  // Restringe el acceso a Gerencia y Ventas
  if (!["Gerencia", "Ventas"].includes(user.rol)) return <p>No tienes acceso a este módulo.</p>;

  // Recarga la funcionalidad del mapa
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
  });

  const [direccion, setDireccion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [coordenadas, setCoordenadas] = useState(null);
  const [obraEditando, setObraEditando] = useState(null);

  // Estado para manejar datos de nuevas obras
  const [nuevaObra, setNuevaObra] = useState({
    nombre: "",
    direccion: "",
    ubicacion: "",
    estado: ""
  });

  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);

  // Estados para manejar datos de las obras
  const [obras, setObras] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const estadosObra = [
    { value: "Planificación", label: "Planificación" },
    { value: "Demolición", label: "Demolición" },
    { value: "Excavación", label: "Excavación"},
    { value: "Cimentación y estructura", label: "Cimentación y estructura"},
    { value: "Cerramientos y albañilería", label: "Cerramientos y albañilería"},
    { value: "Acabados", label: "Acabados" },
    { value: "Entrega y postventa", label: "Entrega y postventa" },
  ];
  const [paginaActual, setPaginaActual] = useState(1);
  const obrasPorPagina = 5;


  const handleBuscarUbicacion = async (e) => {
    e.preventDefault(); // 🔥 Evita que se envíe el formulario al hacer clic en el botón

    if (!direccion.trim()) {
      alert("⚠️ Ingresa una dirección válida.");
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(direccion)}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const place = data[0];
        const addressParts = place.address;

        // 🔥 Extraer la dirección de manera óptima
        const direccionFinal = [
          addressParts.road || "", // Calle
          addressParts.house_number || "", // Número
          addressParts.suburb || "", // Barrio
          addressParts.city_district || "", // Distrito
          addressParts.city || addressParts.town || "", // Ciudad
        ]
          .filter(Boolean)
          .join(", ");

        // 🔥 Extraer la ubicación relevante (ciudad, estado, país y código postal)
        const ubicacionFinal = [
          addressParts.state || "", // Departamento/Estado
          addressParts.county || "", // Provincia
          addressParts.postcode || "", // Código Postal
          addressParts.country || "", // País
        ]
          .filter(Boolean)
          .join(", ");

        setDireccion(direccionFinal);
        setUbicacion(ubicacionFinal);
        setCoordenadas({
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
        });

        // 🔥 Almacenar en la nueva obra
        setNuevaObra((prev) => ({
          ...prev,
          direccion: direccionFinal,
          ubicacion: ubicacionFinal,
        }));

        // 🔥 Si se está editando una obra, actualizar los datos
        if (obraEditando) {
          setObraEditando((prev) => ({
            ...prev,
            direccion: direccionFinal,
            ubicacion: ubicacionFinal,
          }));
        }
      } else {
        alert("❌ No se encontró la dirección en OpenStreetMap.");
      }
    } catch (error) {
      console.error("❌ Error obteniendo ubicación:", error);
      alert("❌ Error consultando OpenStreetMap.");
    }
  };


    // Efecto para cargar las obras
  useEffect(() => {
    async function fetchData() {
      try {
        const resObras = await api.get("/obras");
        setObras(resObras.data || []);
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
      }
    }
    fetchData();
  }, []);

  // Función para eliminar una obra
  async function handleEliminar(id) {
    if (!window.confirm("¿Seguro que quieres eliminar esta obra?")) return;
    try {
      await api.delete(`/obras/${id}`);
      setObras(obras.filter((o) => o.id !== id));
      alert("✅ Obra eliminada con éxito");
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
    }
  }

  // Función para agregar un cliente nuevo
  async function handleAgregarObra(e) {
    e.preventDefault();
    try {
      if (!nuevaObra.nombre || !nuevaObra.direccion || !nuevaObra.ubicacion || !nuevaObra.estado) {
        alert("⚠️ Debes completar todos los campos.");
        return;
    }

      await api.post("/obras", nuevaObra);
      alert("✅ Obra creada con éxito");

      cargarObras();
      handleCerrarModalAgregar();
      
    } catch (error) {
      console.error("❌ Error al agregar obra:", error);
      alert("❌ No se pudo agregar la obra.");
    }
  }

  // Función para guardar cambios en un contacto editado
  async function handleGuardarEdicion(e) {
    e.preventDefault();

    if (!obraEditando || !obraEditando.id) {
        alert("❌ No se pudo actualizar la obra. ID no válido.");
        return;
    }

    try {
      await api.put(`/obras/${obraEditando.id}`, obraEditando);
      alert("✅ Obra actualizada correctamente");

      cargarObras();
      handleCerrarModal();
      
    } catch (error) {
      console.error("❌ Error al editar obra:", error);
      alert("❌ No se pudo actualizar la obra.");
    }
  }

  // 🔥 Cargar obras desde la API
  async function cargarObras() {
    try {
      const resObras = await api.get("/obras");
      setObras(resObras.data || []);
    } catch (error) {
      console.error("❌ Error al obtener datos:", error);
    }
  }

  useEffect(() => {
    cargarObras();
  }, []);

  // Funciones para abrir y cerrar modales
  function handleAbrirModal(obra) {
    if (!obra || !obra.id) {
      alert("❌ Error al abrir la edición. Datos de la obra no válidos.");
      return;
  }
    setObraEditando({ ...obra    });

    // 🔥 Cargar datos correctos al abrir la edición
    setDireccion(obra.direccion || "");
    setUbicacion(obra.ubicacion || "");
    setCoordenadas(obra.coordenadas || null);
  }

  function handleCerrarModal() {
    setObraEditando(null);

    // 🔥 Limpiar los estados para evitar persistencia de datos anteriores
    setDireccion("");
    setUbicacion("");
    setCoordenadas(null);
  }

  function handleAbrirModalAgregar() {
    setMostrarModalAgregar(true);

    // 🔥 Asegurar que no se queden datos anteriores
    setNuevaObra({
      nombre: "",
      direccion: "",
      ubicacion: "",
      estado: ""
    });

    setDireccion("");
    setUbicacion("");
    setCoordenadas(null);
  }

  function handleCerrarModalAgregar() {
    // 🔥 Limpiar los estados al cerrar el modal
    setNuevaObra({
      nombre: "",
      direccion: "",
      ubicacion: "",
      estado: ""
      });

      setDireccion("");
      setUbicacion("");
      setCoordenadas(null);
    setMostrarModalAgregar(false);
  }

  // Filtrar obras en base a la búsqueda
  const obrasFiltradas = obras.filter(
    (o) => 
      o.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      o.direccion.toLowerCase().includes(busqueda.toLowerCase()) ||
      o.ubicacion.toLowerCase().includes(busqueda.toLowerCase()) ||
      o.estado.toLowerCase().includes(busqueda.toLowerCase())
  );
  
  // Reiniciar paginación cuando cambia la búsqueda
  useEffect(() => {
    setPaginaActual(1);  // 🔥 Cada vez que cambia la búsqueda, vuelve a la primera página
  }, [busqueda]);
  
  // Configuración de paginación
  const totalPaginas = Math.ceil(obrasFiltradas.length / obrasPorPagina);
  const obrasPaginadas = obrasFiltradas.slice((paginaActual - 1) * obrasPorPagina, paginaActual * obrasPorPagina);  
  
  return (
    <div className="dashboard-main">
      <h2>Gestión de Obras</h2>

      {/* 🔥 Barra superior: Botón de agregar obra + Búsqueda */}
      <div className="top-actions">
          <button className="btn-agregar" onClick={handleAbrirModalAgregar}>
            ➕ Agregar Obra
          </button>
          <input 
            type="text" 
            placeholder="Buscar obra..." 
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
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {obrasPaginadas.map((obra) => (
              <tr key={obra.id}>
                <td>{obra.nombre}</td>
                <td>{obra.direccion}</td>
                <td>{obra.ubicacion}</td>
                <td>{obra.estado}</td>
                <td>
                  <div style={{ display: "flex", gap: "1px", justifyContent: "left" }}>
                    <button onClick={() => handleAbrirModal(obra)} className="edit-button">✏️Editar</button>
                    <button onClick={() => handleEliminar(obra.id)} className="btn-eliminar">🗑Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Agregar Obra */}
      {mostrarModalAgregar && (
          <div className="centro-modal">
            <div className="modal-content">
            <form onSubmit={(e) => handleAgregarObra(e)} className="gestion-form-global">

              <h3>Agregar Obra</h3>
                 
                  {/* Razon Social/Nombre - Solo letras y espacios */}
                  <input 
                      type="text" 
                      placeholder="Nombre del proyecto"
                      value={nuevaObra.nombre} 
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,-\s]/g, ""); // Ahora los espacios son válidos
                        setNuevaObra({ ...nuevaObra, nombre: value });
                      }} 
                    />

                    <h3>Ubicación de la Obra</h3>

                    {/* Input de Dirección */}
                    <input
                      type="text"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Escribe la dirección y presiona buscar..."
                    />
                    <button type="button" onClick={handleBuscarUbicacion}>
                      📍 Buscar Dirección
                    </button>

                    {/* Campos de Dirección y Ubicación Automáticos */}
                    
                      <label>Dirección Completa:</label>
                      <input type="text" value={nuevaObra.direccion} readOnly />

                      <label>Ubicación (Ciudad/Región):</label>
                      <input type="text" value={nuevaObra.ubicacion} readOnly />
                    

                    {/* Mapa con marcador si hay una ubicación encontrada */}
                    
                      {isLoaded && coordenadas && (
                        <GoogleMap mapContainerClassName="map-container" center={coordenadas} zoom={15}>
                          <Marker position={coordenadas} />
                        </GoogleMap>
                      )}
                    
                      
        

                  <div className="form-group">
                      <label>Etapa de la obra</label>
                      <Select
                          options={estadosObra}
                          value={estadosObra.find(e => e.value === nuevaObra.estado) || null}
                          onChange={(selected) => setNuevaObra({ ...nuevaObra, estado: selected ? selected.value : "" })} // 🔥 Estado vacío si no selecciona
                          placeholder="Selecciona una etapa..."
                      />
                  </div>

                  <button type="submit" >Guardar Obra</button>
                  <button type="button" className="btn-cancelar" onClick={handleCerrarModalAgregar}>Cancelar</button>
              </form>
            </div>
          </div>
        )}

      {/* Modal de Editar Obra */}
        {obraEditando && (
          <div className="centro-modal">
            <div className="modal-content">
            <form onSubmit={(e) => handleGuardarEdicion(e)} className="gestion-form-global">

                
                <h3>Editar Obra</h3>
              
                {/* Nombre del proyecto - Solo letras y espacios */}
                <input 
                  type="text"
                  placeholder="Nombre del proyecto" 
                  value={obraEditando.nombre} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,-\s]/g, ""); // Ahora los espacios son válidos
                    setObraEditando({ ...obraEditando, nombre: value });
                  }} 
                />
                
                <h3>Ubicación de la Obra</h3>

                {/* Input de Dirección */}
                <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Escribe la dirección y presiona buscar..."
                />
                <button type="button" onClick={handleBuscarUbicacion}>
                📍 Buscar Dirección
                </button>

                {/* Campos de Dirección y Ubicación Automáticos */}
                
                <label>Dirección Completa:</label>
                <input type="text" value={obraEditando.direccion} readOnly />

                <label>Ubicación (Ciudad/Región):</label>
                <input type="text" value={obraEditando.ubicacion} readOnly />
                

                {/* Mapa con marcador si hay una ubicación encontrada */}
                {isLoaded && coordenadas && (
                <GoogleMap mapContainerClassName="map-container" center={coordenadas} zoom={15}>
                <Marker position={coordenadas} />
                </GoogleMap>
                )}
                
      
                  <label>Etapa de la obra</label>
                  <Select 
                      options={estadosObra} // 🔥 Opciones predefinidas de estados
                      value={estadosObra.find(e => e.value === obraEditando?.estado) || null} // 🔥 Busca el estado actual
                      onChange={(selected) => setObraEditando({ ...obraEditando, estado: selected.value })}
                      placeholder="Selecciona una etapa..."
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