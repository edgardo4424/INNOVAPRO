import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/registroTarea.css";
import Select from "react-select";

export default function RegistrarTarea() {
  // Obtiene información del usuario autenticado
  const { user } = useAuth();

  // Estados para manejar datos de empresas, 
  // clientes, obras y tareas
  const [empresas, setEmpresas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [obras, setObras] = useState([]);
  const [obraSeleccionada, setObraSeleccionada] = useState(null);
  const [tipoTarea, setTipoTarea] = useState("");

  // Estado para manejar datos de la nueva tarea
  const [formData, setFormData] = useState({
    empresaProveedoraId: "",
    clienteId: "",
    obraId: "",
    urgencia: "",
    detalles: {},
  });


  // Efecto para cargar las empresas y clientes al montar el componente
  useEffect(() => {
    async function fetchData() {
      try {
        const resEmpresas = await api.get("/empresas_proveedoras");
        const resClientes = await api.get("/clientes");
        setEmpresas(resEmpresas.data || []);
        setClientes(resClientes.data || []);
      } catch (error) {
        console.error("❌ Error al obtener datos:", error);
      }
    }
    fetchData();
  }, []);

  // Efecto para cargar las obras
  useEffect(() => {
    async function fetchObras() {
      try {
        const res = await api.get("/obras");
        setObras(res.data);
      } catch (error) {
        console.error("❌ Error al obtener obras:", error);
      }
    }
    fetchObras();
  }, []);

  // Efecto para manejar la obra seleccionada
  useEffect(() => {
    if (formData.obraId) {
      const obra = obras.find(o => o.id === Number(formData.obraId));
      if (obra) setObraSeleccionada(obra);
    }
  }, [formData.obraId, obras]);

  // Función para manejar los tipos de tareas
  function handleTipoTareaChange(e) {
    setTipoTarea(e.target.value);
    setFormData({ ...formData, detalles: {} });
  }

  // Función para agregar una nueva tarea
  async function handleSubmit(e) {
    e.preventDefault();
    try {
        await api.post("/tareas", {
            ...formData,
            tipoTarea, // ✅ Asegura que tipoTarea se envía correctamente
            detalles: formData.detalles || {},
            ubicacion: obraSeleccionada ? obraSeleccionada.ubicacion : "",
        }, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        alert("✅ Tarea registrada con éxito");
        setFormData({ empresaProveedoraId: "", clienteId: "", obraId: "", urgencia: "", detalles: {} });
        setTipoTarea("");
    } catch (error) {
        console.error("❌ Error al registrar la tarea:", error.response?.data || error);
        alert("❌ No se pudo registrar la tarea.");
    }
}

  return (
    <div className="registro-tarea-container">
      <h2 className="registro-tarea-titulo">📌 Registrar Nueva Tarea</h2>
      {/* Mensaje de aclaración para los comerciales */}
      <div className="registro-tarea-mensaje">
        <p>🛠️ <strong>Estimado compañero comercial</strong>, brinde toda la información necesaria para completar su tarea en los tiempos que lo necesite.</p>
      </div>
    {/* Formulario para el registro de tareas */}
      <form onSubmit={handleSubmit} className="registro-tarea-form">
        
        {/* Selección de filial */}
        <div className="form-group">
        <label>Filial de Innova:</label>
        <Select
            value={formData.empresaProveedoraId 
            ? { value: formData.empresaProveedoraId, label: empresas.find(emp => emp.id === formData.empresaProveedoraId)?.razon_social || "Seleccione..." } 
            : null}
            onChange={(selected) => setFormData({ ...formData, empresaProveedoraId: selected ? selected.value : "" })}
            options={empresas.map(emp => ({ value: emp.id, label: emp.razon_social }))}
            placeholder="Seleccione..."
            isSearchable
        />
        </div>

        {/* Selección de cliente */}
        <div className="form-group">
        <label>Cliente:</label>
        <Select
            value={formData.clienteId 
            ? { value: formData.clienteId, label: clientes.find(cli => cli.id === formData.clienteId)?.razon_social || "Seleccione..." } 
            : null}
            onChange={(selected) => setFormData({ ...formData, clienteId: selected ? selected.value : "" })}
            options={clientes.map(cli => ({ value: cli.id, label: cli.razon_social }))}
            placeholder="Seleccione..."
            isSearchable
        />
        </div>

        {/* Selección de obra */}
        <div className="form-group">
        <label>Obra:</label>
        <Select
            value={formData.obraId 
            ? { value: formData.obraId, label: obras.find(obra => obra.id === formData.obraId)?.nombre || "Seleccione..." } 
            : null}
            onChange={(selected) => setFormData({ ...formData, obraId: selected ? selected.value : "" })}
            options={obras.map(obra => ({ value: obra.id, label: obra.nombre }))}
            placeholder="Seleccione..."
            isSearchable
        />
        </div>


        {/* Selección del nivel de urgencia */}
        <div className="form-group">
          <label>Nivel de Urgencia:</label>
          <select value={formData.urgencia} onChange={(e) => setFormData({ ...formData, urgencia: e.target.value })} required>
            <option value="">Seleccione...</option>
            <option value="Prioridad">Prioridad</option>
            <option value="Normal">Normal</option>
            <option value="Baja prioridad">Baja prioridad</option>
          </select>
        </div>
        
        {/* Selección del tipo de tarea */}
        <div className="form-group">
          <label>Tipo de Tarea:</label>
          <select value={tipoTarea} onChange={handleTipoTareaChange} required>
            <option value="">Seleccione...</option>
            <option value="Apoyo Técnico">Apoyo Técnico</option>
            <option value="Apoyo Administrativo">Apoyo Administrativo</option>
            <option value="Pase de Pedido">Pase de Pedido</option>
            <option value="Servicios Adicionales">Servicios Adicionales</option>
            <option value="Tarea Interna">Tarea Interna</option>
          </select>
        </div>

        {/* Tipo de tarea Apoyo Técnico */}
        {tipoTarea === "Apoyo Técnico" && (
        <div className="tarea-detalles">
            <h3>Detalles de Apoyo Técnico</h3>

            {/* Requiere apoyo técnico con */}  
            <label>Requiere apoyo técnico con:</label>
            <select
            value={formData.detalles.apoyoTecnico || ""}
            onChange={(e) =>
                setFormData({
                ...formData,
                detalles: { ...formData.detalles, apoyoTecnico: e.target.value },
                })
            }
            >
            <option value="">Seleccione...</option>
            <option value="Modulación">Modulación</option>
            <option value="Despiece">Despiece</option>
            <option value="Memoria de cálculo">Memoria de cálculo</option>
            <option value="Certificado de operatividad">Certificado de operatividad</option>
            <option value="Otro">Otro</option>
            </select>

            {/* Tipo de Modulación */}
            {formData.detalles.apoyoTecnico === "Modulación" && (
            <>
                <label>Tipo de Modulación:</label>
                <select
                value={formData.detalles.tipoModulacion || ""}
                onChange={(e) =>
                    setFormData({
                    ...formData,
                    detalles: { ...formData.detalles, tipoModulacion: e.target.value },
                    })
                }
                >
                <option value="">Seleccione...</option>
                <option value="Básica">Básica</option>
                <option value="Detallada">Detallada</option>
                </select>
            </>
            )}

            {/* Tipo de Equipo */}
            <label>Tipo de Equipo:</label>
            <select
            value={formData.detalles.tipoEquipo || ""}
            onChange={(e) =>
                setFormData({
                ...formData,
                detalles: { ...formData.detalles, tipoEquipo: e.target.value },
                })
            }
            >
            <option value="">Seleccione...</option>
            <option value="AT - And. TRABAJO">AT - And. TRABAJO</option>
            <option value="AF - And. FACHADA">AF - And. FACHADA</option>
            <option value="EA - Escalera Acceso">EA - Escalera Acceso</option>
            <option value="EC - Escuadras">EC - Escuadras</option>
            <option value="PU - Puntales">PU - Puntales</option>
            <option value="EN - Encofrado">EN - Encofrado</option>
            <option value="EV - Elevador">EV - Elevador</option>
            </select>

            {/* Aquí van los checklists dinámicos según la opción elegida */}
            {formData.detalles.tipoEquipo === "AT - And. TRABAJO" && (
            <div className="sub-options">
                <label className="sub-options-title">Info. And. TRABAJO:</label>
                <div className="checkbox-grid">

                <div className="checkbox-group">
                    <span>Plataformado:</span>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Plataformado Superior"
                            checked={formData.detalles.plataformado?.includes("Plataformado Superior") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    plataformado: formData.detalles.plataformado
                                    ? formData.detalles.plataformado.includes(value)
                                        ? formData.detalles.plataformado.filter(v => v !== value)
                                        : [...formData.detalles.plataformado, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Superior</span>
                    </label>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Plataformado Completo"
                            checked={formData.detalles.plataformado?.includes("Plataformado Completo") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    plataformado: formData.detalles.plataformado
                                    ? formData.detalles.plataformado.includes(value)
                                        ? formData.detalles.plataformado.filter(v => v !== value)
                                        : [...formData.detalles.plataformado, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Completo</span>
                    </label>
                </div>

                <div className="checkbox-group">
                    <span>Anclajes:</span>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Con Anclajes"
                            checked={formData.detalles.anclajes?.includes("Con Anclajes") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    anclajes: formData.detalles.anclajes
                                    ? formData.detalles.anclajes.includes(value)
                                        ? formData.detalles.anclajes.filter(v => v !== value)
                                        : [...formData.detalles.anclajes, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Con</span>
                    </label>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Sin Anclajes"
                            checked={formData.detalles.anclajes?.includes("Sin Anclajes") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    anclajes: formData.detalles.anclajes
                                    ? formData.detalles.anclajes.includes(value)
                                        ? formData.detalles.anclajes.filter(v => v !== value)
                                        : [...formData.detalles.anclajes, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Sin</span>
                    </label>
                </div>

                <div className="checkbox-group">
                    <span>Uso en:</span>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Uso en Interiores"
                            checked={formData.detalles.uso?.includes("Uso en Interiores") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    uso: formData.detalles.uso
                                    ? formData.detalles.uso.includes(value)
                                        ? formData.detalles.uso.filter(v => v !== value)
                                        : [...formData.detalles.uso, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Interiores</span>
                    </label>
                    <label className="checkbox-item">
                        <input 
                        type="checkbox" 
                        value="Uso en Exteriores"
                        checked={formData.detalles.uso?.includes("Uso en Exteriores") || false}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFormData({
                            ...formData,
                            detalles: {
                                ...formData.detalles,
                                uso: formData.detalles.uso
                                ? formData.detalles.uso.includes(value)
                                    ? formData.detalles.uso.filter(v => v !== value)
                                    : [...formData.detalles.uso, value]
                                : [value]
                            }
                            });
                        }}
                        />
                        <span>Exteriores</span>
                    </label>
                </div>
                </div>
            </div>
            )}

            {formData.detalles.tipoEquipo === "AF - And. FACHADA" && (
            <div className="sub-options">
                <label className="sub-options-title">Detalles And. FACHADA:</label>
                <div className="checkbox-grid">

                <div className="checkbox-group">
                    <span>Apoyado a:</span>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Piso"
                            checked={formData.detalles.apoyadoA?.includes("Piso") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    apoyadoA: formData.detalles.apoyadoA
                                    ? formData.detalles.apoyadoA.includes(value)
                                        ? formData.detalles.apoyadoA.filter(v => v !== value)
                                        : [...formData.detalles.apoyadoA, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Piso</span>
                    </label>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Volado"
                            checked={formData.detalles.apoyadoA?.includes("Volado") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    apoyadoA: formData.detalles.apoyadoA
                                    ? formData.detalles.apoyadoA.includes(value)
                                        ? formData.detalles.apoyadoA.filter(v => v !== value)
                                        : [...formData.detalles.apoyadoA, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Volado</span>
                    </label>
                </div>

                <div className="checkbox-group">
                    <span>Rotaciones:</span>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Con Rotaciones"
                            checked={formData.detalles.rotaciones?.includes("Con Rotaciones") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    rotaciones: formData.detalles.rotaciones
                                    ? formData.detalles.rotaciones.includes(value)
                                        ? formData.detalles.rotaciones.filter(v => v !== value)
                                        : [...formData.detalles.rotaciones, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Con</span>
                    </label>
                    <label className="checkbox-item">
                        <input type="checkbox" value="Sin Rotaciones" />
                        <input 
                            type="checkbox" 
                            value="Sin Rotaciones"
                            checked={formData.detalles.rotaciones?.includes("Sin Rotaciones") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    rotaciones: formData.detalles.rotaciones
                                    ? formData.detalles.rotaciones.includes(value)
                                        ? formData.detalles.rotaciones.filter(v => v !== value)
                                        : [...formData.detalles.rotaciones, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Sin</span>
                    </label>
                </div>

                <div className="checkbox-group">
                    <span>Ménsulas:</span>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Con Ménsulas"
                            checked={formData.detalles.mensulas?.includes("Con Ménsulas") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    mensulas: formData.detalles.mensulas
                                    ? formData.detalles.mensulas.includes(value)
                                        ? formData.detalles.mensulas.filter(v => v !== value)
                                        : [...formData.detalles.mensulas, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Con</span>
                    </label>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Sin Ménsulas"
                            checked={formData.detalles.mensulas?.includes("Sin Ménsulas") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    mensulas: formData.detalles.mensulas
                                    ? formData.detalles.mensulas.includes(value)
                                        ? formData.detalles.mensulas.filter(v => v !== value)
                                        : [...formData.detalles.mensulas, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Sin</span>
                    </label>
                </div>
                </div>
            </div>
            )}

            {formData.detalles.tipoEquipo === "EA - Escalera Acceso" && (
            <div className="sub-options">
                <label className="sub-options-title">Detalles Escalera Acceso:</label>
                <div className="checkbox-grid">

                <div className="checkbox-group">
                    <span>Apoyado a:</span>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Piso"
                            checked={formData.detalles.apoyadoA?.includes("Piso") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    apoyadoA: formData.detalles.apoyadoA
                                    ? formData.detalles.apoyadoA.includes(value)
                                        ? formData.detalles.apoyadoA.filter(v => v !== value)
                                        : [...formData.detalles.apoyadoA, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Piso</span>
                    </label>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Volado"
                            checked={formData.detalles.apoyadoA?.includes("Volado") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    apoyadoA: formData.detalles.apoyadoA
                                    ? formData.detalles.apoyadoA.includes(value)
                                        ? formData.detalles.apoyadoA.filter(v => v !== value)
                                        : [...formData.detalles.apoyadoA, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Volado</span>
                    </label>
                </div>

                <div className="checkbox-group">
                    <span>Ingreso:</span>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Lado LARGO - 3.07m"
                            checked={formData.detalles.ingreso?.includes("Lado LARGO - 3.07m") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    ingreso: formData.detalles.ingreso
                                    ? formData.detalles.ingreso.includes(value)
                                        ? formData.detalles.ingreso.filter(v => v !== value)
                                        : [...formData.detalles.ingreso, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Lado LARGO - 3.07m</span>
                    </label>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Lado ANCHO - 1.57m"
                            checked={formData.detalles.ingreso?.includes("Lado ANCHO - 1.57m") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    ingreso: formData.detalles.ingreso
                                    ? formData.detalles.ingreso.includes(value)
                                        ? formData.detalles.ingreso.filter(v => v !== value)
                                        : [...formData.detalles.ingreso, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Lado ANCHO - 1.57m</span>
                    </label>
                </div>

                <div className="checkbox-group">
                    <span>Habilitar Pasadizo/Balcón:</span>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Con pasadizo"
                            checked={formData.detalles.pasadizo?.includes("Con pasadizo") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    pasadizo: formData.detalles.pasadizo
                                    ? formData.detalles.pasadizo.includes(value)
                                        ? formData.detalles.pasadizo.filter(v => v !== value)
                                        : [...formData.detalles.pasadizo, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Con</span>
                    </label>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Sin pasadizo"
                            checked={formData.detalles.pasadizo?.includes("Sin pasadizo") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    pasadizo: formData.detalles.pasadizo
                                    ? formData.detalles.pasadizo.includes(value)
                                        ? formData.detalles.pasadizo.filter(v => v !== value)
                                        : [...formData.detalles.pasadizo, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Sin</span>
                    </label>
                </div>
                </div>
            </div>
            )}

            {formData.detalles.tipoEquipo === "EC - Escuadras" && (
            <div className="sub-options">
                <label className="sub-options-title">Detalles Escuadras:</label>
                <div className="checkbox-grid">

                <div className="checkbox-group">
                    <span>Escuadras de:</span>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Escuadras de 1.00m"
                            checked={formData.detalles.escuadras?.includes("Escuadras de 1.00m") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    escuadras: formData.detalles.escuadras
                                    ? formData.detalles.escuadras.includes(value)
                                        ? formData.detalles.escuadras.filter(v => v !== value)
                                        : [...formData.detalles.escuadras, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>1.00m</span>
                    </label>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Escuadras de 3.00m"
                            checked={formData.detalles.escuadras?.includes("Escuadras de 3.00m") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    escuadras: formData.detalles.escuadras
                                    ? formData.detalles.escuadras.includes(value)
                                        ? formData.detalles.escuadras.filter(v => v !== value)
                                        : [...formData.detalles.escuadras, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>3.00m</span>
                    </label>
                </div>

                <div className="checkbox-group">
                    <span>Sobrecarga por:</span>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Sobrecarga Innova"
                            checked={formData.detalles.sobrecarga?.includes("Sobrecarga Innova") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    sobrecarga: formData.detalles.sobrecarga
                                    ? formData.detalles.sobrecarga.includes(value)
                                        ? formData.detalles.sobrecarga.filter(v => v !== value)
                                        : [...formData.detalles.sobrecarga, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Innova</span>
                    </label>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Sobrecarga Cliente"
                            checked={formData.detalles.sobrecarga?.includes("Sobrecarga Cliente") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    sobrecarga: formData.detalles.sobrecarga
                                    ? formData.detalles.sobrecarga.includes(value)
                                        ? formData.detalles.sobrecarga.filter(v => v !== value)
                                        : [...formData.detalles.sobrecarga, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Cliente</span>
                    </label>
                </div>

                <div className="checkbox-group">
                    <span>Plataformas:</span>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Con Plataformas"
                            checked={formData.detalles.plataformas?.includes("Con Plataformas") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    plataformas: formData.detalles.plataformas
                                    ? formData.detalles.plataformas.includes(value)
                                        ? formData.detalles.plataformas.filter(v => v !== value)
                                        : [...formData.detalles.plataformas, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Con</span>
                    </label>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Sin Plataformas"
                            checked={formData.detalles.plataformas?.includes("Sin Plataformas") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    plataformas: formData.detalles.plataformas
                                    ? formData.detalles.plataformas.includes(value)
                                        ? formData.detalles.plataformas.filter(v => v !== value)
                                        : [...formData.detalles.plataformas, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Sin</span>
                    </label>
                </div>
                </div>
            </div>
            )}

            {formData.detalles.tipoEquipo === "EN - Encofrado" && (
            <div className="sub-options">
                <label className="sub-options-title">Info ENCOFRADO:</label>
                <div className="checkbox-grid">

                <div className="checkbox-group">
                    <label className="checkbox-item">
                        <input type="checkbox" value="Placas y columnas" /> 
                        <input 
                        type="checkbox" 
                        value="Placas y columnas"
                        checked={formData.detalles.encofrados?.includes("Placas y columnas") || false}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFormData({
                            ...formData,
                            detalles: {
                                ...formData.detalles,
                                encofrados: formData.detalles.encofrados
                                ? formData.detalles.encofrados.includes(value)
                                    ? formData.detalles.encofrados.filter(v => v !== value)
                                    : [...formData.detalles.encofrados, value]
                                : [value]
                            }
                            });
                        }}
                        />
                        <span>Placas y columnas</span>
                    </label>
                    <label className="checkbox-item">
                    <input type="checkbox" value="Cisterna" /> 
                        <input 
                        type="checkbox" 
                        value="Cisterna"
                        checked={formData.detalles.encofrados?.includes("Cisterna") || false}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFormData({
                            ...formData,
                            detalles: {
                                ...formData.detalles,
                                encofrados: formData.detalles.encofrados
                                ? formData.detalles.encofrados.includes(value)
                                    ? formData.detalles.encofrados.filter(v => v !== value)
                                    : [...formData.detalles.encofrados, value]
                                : [value]
                            }
                            });
                        }}
                        />
                        <span>Cisterna</span>
                    </label>
                    <label className="checkbox-item">
                    <input 
                        type="checkbox" 
                        value="Vigas"
                        checked={formData.detalles.encofrados?.includes("Vigas") || false}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFormData({
                            ...formData,
                            detalles: {
                                ...formData.detalles,
                                encofrados: formData.detalles.encofrados
                                ? formData.detalles.encofrados.includes(value)
                                    ? formData.detalles.encofrados.filter(v => v !== value)
                                    : [...formData.detalles.encofrados, value]
                                : [value]
                            }
                            });
                        }}
                        />
                        <span>Vigas</span>
                    </label>
                    <label className="checkbox-item">
                    <input 
                        type="checkbox" 
                        value="Losa"
                        checked={formData.detalles.encofrados?.includes("Losa") || false}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFormData({
                            ...formData,
                            detalles: {
                                ...formData.detalles,
                                encofrados: formData.detalles.encofrados
                                ? formData.detalles.encofrados.includes(value)
                                    ? formData.detalles.encofrados.filter(v => v !== value)
                                    : [...formData.detalles.encofrados, value]
                                : [value]
                            }
                            });
                        }}
                        />
                        <span>Losa</span>
                    </label>
                </div>
                </div>
            </div>
            )}

            {formData.detalles.tipoEquipo === "EV - Elevador" && (
            <div className="sub-options">
                <label className="sub-options-title">Info Elevador:</label>
                <div className="checkbox-grid">

                <div className="checkbox-group">
                    <label className="checkbox-item">
                        <input 
                        type="checkbox" 
                        value="Plano"
                        checked={formData.detalles.elevador?.includes("Plano") || false}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFormData({
                            ...formData,
                            detalles: {
                                ...formData.detalles,
                                elevador: formData.detalles.elevador
                                ? formData.detalles.elevador.includes(value)
                                    ? formData.detalles.elevador.filter(v => v !== value)
                                    : [...formData.detalles.elevador, value]
                                : [value]
                            }
                            });
                        }}
                        />
                        <span>Plano</span>
                    </label>
                </div>
                </div>
            </div>
            )}



            {/* Información adicional */}
            <div className="sub-options">
            <label className="sub-options-title">He dejado información adicional por:</label>
            <div className="checkbox-grid">
                <div className="checkbox-group">
                    <label className="checkbox-item">
                        <input 
                        type="checkbox" 
                        value="Correo"
                        checked={formData.detalles.infoAdicional?.includes("Correo") || false}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFormData({
                            ...formData,
                            detalles: {
                                ...formData.detalles,
                                infoAdicional: formData.detalles.infoAdicional
                                ? formData.detalles.infoAdicional.includes(value)
                                    ? formData.detalles.infoAdicional.filter(v => v !== value)
                                    : [...formData.detalles.infoAdicional, value]
                                : [value]
                            }
                            });
                        }}
                        />
                        <span>Correo</span>
                    </label>
                </div>
                <div className="checkbox-group">
                    <label className="checkbox-item">
                        <input 
                        type="checkbox" 
                        value="Whatsapp"
                        checked={formData.detalles.infoAdicional?.includes("Whatsapp") || false}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFormData({
                            ...formData,
                            detalles: {
                                ...formData.detalles,
                                infoAdicional: formData.detalles.infoAdicional
                                ? formData.detalles.infoAdicional.includes(value)
                                    ? formData.detalles.infoAdicional.filter(v => v !== value)
                                    : [...formData.detalles.infoAdicional, value]
                                : [value]
                            }
                            });
                        }}
                        />
                        <span>Whatsapp</span>
                    </label>
                </div>
                <div className="checkbox-group">
                    <label className="checkbox-item">
                        <input 
                        type="checkbox" 
                        value="N/A"
                        checked={formData.detalles.infoAdicional?.includes("N/A") || false}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFormData({
                            ...formData,
                            detalles: {
                                ...formData.detalles,
                                infoAdicional: formData.detalles.infoAdicional
                                ? formData.detalles.infoAdicional.includes(value)
                                    ? formData.detalles.infoAdicional.filter(v => v !== value)
                                    : [...formData.detalles.infoAdicional, value]
                                : [value]
                            }
                            });
                        }}
                        />
                        <span>N/A</span>
                    </label>
                </div>
            </div>
            </div>

            {/* Nota adicional */}
            <div className="nota-container">
            <label className="nota-label">📝 Nota:</label>
            <textarea
                className="nota-textarea"
                value={formData.detalles.nota || ""}
                onChange={(e) =>
                setFormData({
                    ...formData,
                    detalles: { ...formData.detalles, nota: e.target.value },
                })
                }
                placeholder="Escribe aquí los detalles adicionales..."
            />
            </div>

        </div>
        )}

        {/* Tipo de tarea Apoyo Administrativo */}
        {tipoTarea === "Apoyo Administrativo" && (
        <div className="tarea-detalles">
            <h3>Detalles de Apoyo Administrativo</h3>

            {/* Requiere apoyo administrativo con */}  
            <label>Requiere apoyo administrativo con:</label>
            <select
            value={formData.detalles.apoyoAdministrativo || ""}
            onChange={(e) =>
                setFormData({
                ...formData,
                detalles: { ...formData.detalles, apoyoAdministrativo: e.target.value },
                })
            }
            >
            <option value="">Seleccione...</option>
            <option value="Valorización">Valorización</option>
            <option value="Liquidación">Liquidación</option>
            <option value="Info Acuerdo Comercial">Info Acuerdo Comercial</option>
            </select>

            {/* Aquí van los checklists dinámicos según la opción elegida */}
            {formData.detalles.apoyoAdministrativo === "Valorización" && (
            <div className="sub-options">
                <label className="sub-options-title">Con respecto a:</label>
                <div className="checkbox-grid">
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                            <input 
                                type="checkbox" 
                                value="Renovación adelantada"
                                checked={formData.detalles.valorizacion?.includes("Renovación adelantada") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        valorizacion: formData.detalles.valorizacion
                                        ? formData.detalles.valorizacion.includes(value)
                                            ? formData.detalles.valorizacion.filter(v => v !== value)
                                            : [...formData.detalles.valorizacion, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Renovación adelantada</span>
                        </label>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Actualizar valorización"
                                checked={formData.detalles.valorizacion?.includes("Actualizar valorización") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        valorizacion: formData.detalles.valorizacion
                                        ? formData.detalles.valorizacion.includes(value)
                                            ? formData.detalles.valorizacion.filter(v => v !== value)
                                            : [...formData.detalles.valorizacion, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Actualizar valorización</span>
                        </label>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Stock de piezas en obra"
                                checked={formData.detalles.valorizacion?.includes("Stock de piezas en obra") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        valorizacion: formData.detalles.valorizacion
                                        ? formData.detalles.valorizacion.includes(value)
                                            ? formData.detalles.valorizacion.filter(v => v !== value)
                                            : [...formData.detalles.valorizacion, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Stock de piezas en obra</span>
                        </label>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Resumen valorizado de faltantes"
                                checked={formData.detalles.valorizacion?.includes("Resumen valorizado de faltantes") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        valorizacion: formData.detalles.valorizacion
                                        ? formData.detalles.valorizacion.includes(value)
                                            ? formData.detalles.valorizacion.filter(v => v !== value)
                                            : [...formData.detalles.valorizacion, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Resumen valorizado de faltantes</span>
                        </label>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Resumen valorizado de irreparables"
                                checked={formData.detalles.valorizacion?.includes("Resumen valorizado de irreparables") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        valorizacion: formData.detalles.valorizacion
                                        ? formData.detalles.valorizacion.includes(value)
                                            ? formData.detalles.valorizacion.filter(v => v !== value)
                                            : [...formData.detalles.valorizacion, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Resumen valorizado de irreparables</span>
                        </label>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Sustento"
                                checked={formData.detalles.valorizacion?.includes("Sustento") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        valorizacion: formData.detalles.valorizacion
                                        ? formData.detalles.valorizacion.includes(value)
                                            ? formData.detalles.valorizacion.filter(v => v !== value)
                                            : [...formData.detalles.valorizacion, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Sustento</span>
                        </label>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Stock por pedido"
                                checked={formData.detalles.valorizacion?.includes("Stock por pedido") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        valorizacion: formData.detalles.valorizacion
                                        ? formData.detalles.valorizacion.includes(value)
                                            ? formData.detalles.valorizacion.filter(v => v !== value)
                                            : [...formData.detalles.valorizacion, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Stock por pedido</span>
                        </label>
                    </div>
                </div>
            </div>
            )}

            {formData.detalles.apoyoAdministrativo === "Liquidación" && (
            <div className="sub-options">
                <label className="sub-options-title">Con respecto a:</label>
                <div className="checkbox-grid">
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Liquidar"
                                checked={formData.detalles.liquidacion?.includes("Liquidar") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        liquidacion: formData.detalles.liquidacion
                                        ? formData.detalles.liquidacion.includes(value)
                                            ? formData.detalles.liquidacion.filter(v => v !== value)
                                            : [...formData.detalles.liquidacion, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Liquidar</span>
                        </label>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Actualizar liquidación"
                                checked={formData.detalles.liquidacion?.includes("Actualizar liquidación") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        liquidacion: formData.detalles.liquidacion
                                        ? formData.detalles.liquidacion.includes(value)
                                            ? formData.detalles.liquidacion.filter(v => v !== value)
                                            : [...formData.detalles.liquidacion, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Actualizar liquidación</span>
                        </label>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Stock de piezas en obra"
                                checked={formData.detalles.liquidacion?.includes("Stock de piezas en obra") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        liquidacion: formData.detalles.liquidacion
                                        ? formData.detalles.liquidacion.includes(value)
                                            ? formData.detalles.liquidacion.filter(v => v !== value)
                                            : [...formData.detalles.liquidacion, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Stock de piezas en obra</span>
                        </label>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Resumen valorizado de faltantes"
                                checked={formData.detalles.liquidacion?.includes("Resumen valorizado de faltantes") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        liquidacion: formData.detalles.liquidacion
                                        ? formData.detalles.liquidacion.includes(value)
                                            ? formData.detalles.liquidacion.filter(v => v !== value)
                                            : [...formData.detalles.liquidacion, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Resumen valorizado de faltantes</span>
                        </label>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Resumen valorizado de irreparables"
                                checked={formData.detalles.liquidacion?.includes("Resumen valorizado de irreparables") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        liquidacion: formData.detalles.liquidacion
                                        ? formData.detalles.liquidacion.includes(value)
                                            ? formData.detalles.liquidacion.filter(v => v !== value)
                                            : [...formData.detalles.liquidacion, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Resumen valorizado de irreparables</span>
                        </label>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Sustento"
                                checked={formData.detalles.liquidacion?.includes("Sustento") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        liquidacion: formData.detalles.liquidacion
                                        ? formData.detalles.liquidacion.includes(value)
                                            ? formData.detalles.liquidacion.filter(v => v !== value)
                                            : [...formData.detalles.liquidacion, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Sustento</span>
                        </label>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Stock por pedido"
                                checked={formData.detalles.liquidacion?.includes("Stock por pedido") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        liquidacion: formData.detalles.liquidacion
                                        ? formData.detalles.liquidacion.includes(value)
                                            ? formData.detalles.liquidacion.filter(v => v !== value)
                                            : [...formData.detalles.liquidacion, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Stock por pedido</span>
                        </label>
                    </div>
                </div>
            </div>
            )}

            {formData.detalles.apoyoAdministrativo === "Info Acuerdo Comercial" && (
            <div className="sub-options">
                <label className="sub-options-title">Con respecto a:</label>
                <div className="checkbox-grid">
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                            <input 
                                type="checkbox" 
                                value="Descuento en irreparables"
                                checked={formData.detalles.acuerdoComercial?.includes("Descuento en irreparables") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        acuerdoComercial: formData.detalles.acuerdoComercial
                                        ? formData.detalles.acuerdoComercial.includes(value)
                                            ? formData.detalles.acuerdoComercial.filter(v => v !== value)
                                            : [...formData.detalles.acuerdoComercial, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Descuento en irreparables</span>
                        </label>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Descuento en faltantes"
                                checked={formData.detalles.acuerdoComercial?.includes("Descuento en faltantes") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        acuerdoComercial: formData.detalles.acuerdoComercial
                                        ? formData.detalles.acuerdoComercial.includes(value)
                                            ? formData.detalles.acuerdoComercial.filter(v => v !== value)
                                            : [...formData.detalles.acuerdoComercial, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Descuento en faltantes</span>
                        </label>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Descontar fecha de alquiler"
                                checked={formData.detalles.acuerdoComercial?.includes("Descontar fecha de alquiler") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        acuerdoComercial: formData.detalles.acuerdoComercial
                                        ? formData.detalles.acuerdoComercial.includes(value)
                                            ? formData.detalles.acuerdoComercial.filter(v => v !== value)
                                            : [...formData.detalles.acuerdoComercial, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Descontar fecha de alquiler</span>
                        </label>
                    </div>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                        <input 
                                type="checkbox" 
                                value="Costo por reparación"
                                checked={formData.detalles.acuerdoComercial?.includes("Costo por reparación") || false}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData({
                                    ...formData,
                                    detalles: {
                                        ...formData.detalles,
                                        acuerdoComercial: formData.detalles.acuerdoComercial
                                        ? formData.detalles.acuerdoComercial.includes(value)
                                            ? formData.detalles.acuerdoComercial.filter(v => v !== value)
                                            : [...formData.detalles.acuerdoComercial, value]
                                        : [value]
                                    }
                                    });
                                }}
                                />
                            <span>Costo por reparación</span>
                        </label>
                    </div>
                </div>
            </div>
            )}

            {/* Nota adicional */}
            <div className="nota-container">
            <label className="nota-label">📝 Nota:</label>
            <textarea
                className="nota-textarea"
                value={formData.detalles.nota || ""}
                onChange={(e) =>
                setFormData({
                    ...formData,
                    detalles: { ...formData.detalles, nota: e.target.value },
                })
                }
                placeholder="Escribe aquí los detalles adicionales..."
            />
            </div>

            {/* Información adicional */}
            <div className="sub-options">
            <label className="sub-options-title">¿Enviar al cliente?</label>
            <div className="checkbox-grid">
                <div className="checkbox-group">
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Enviar al cliente"
                            checked={formData.detalles.envioCliente?.includes("Enviar al cliente") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    envioCliente: formData.detalles.envioCliente
                                    ? formData.detalles.envioCliente.includes(value)
                                        ? formData.detalles.envioCliente.filter(v => v !== value)
                                        : [...formData.detalles.envioCliente, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Si</span>
                    </label>
                </div>
                <div className="checkbox-group">
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="No enviar al cliente"
                            checked={formData.detalles.envioCliente?.includes("No enviar al cliente") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    envioCliente: formData.detalles.envioCliente
                                    ? formData.detalles.envioCliente.includes(value)
                                        ? formData.detalles.envioCliente.filter(v => v !== value)
                                        : [...formData.detalles.envioCliente, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>No</span>
                    </label>
                </div>
            </div>
            </div>
        </div>
        )}

        {/* Tipo de tarea Pase de Pedido */}
        {tipoTarea === "Pase de Pedido" && (
        <div className="tarea-detalles">
            <h3>Detalles del Pase de Pedido</h3>

            {/* Estado del pedido */}  
            <label>Estado del pedido:</label>
            <select
            value={formData.detalles.estadoPasePedido || ""}
            onChange={(e) =>
                setFormData({
                ...formData,
                detalles: { ...formData.detalles, estadoPasePedido: e.target.value },
                })
            }
            >
            <option value="">Seleccione...</option>
            <option value="Confirmado">Confirmado</option>
            <option value="Pre Confirmado">Pre Confirmado</option>
            <option value="Por Confirmar">Por Confirmar</option>
            </select>

            {/* Número y versión de contrato */}
            <label>Número y versión de contrato:</label>
            <input
            type="text"
            value={formData.detalles.numeroVersionContrato || ""}
            onChange={(e) => {
                let value = e.target.value.toUpperCase(); // Convertir a mayúsculas automáticamente
                if (value === "" || /^[0-9_]*$/.test(value)) { // Permite escribir números y guion bajo
                setFormData({
                    ...formData,
                    detalles: { ...formData.detalles, numeroVersionContrato: value },
                });
                }
            }}
            onBlur={(e) => {
                const regex = /^\d{4}_\d{1,2}$/;
                if (!regex.test(e.target.value)) {
                alert("Formato incorrecto. Debe ser 0000_0 (Ejemplo: 0025_1)");
                setFormData({
                    ...formData,
                    detalles: { ...formData.detalles, numeroVersionContrato: "" }, // Borra si es incorrecto
                });
                }
            }}
            placeholder="Ejemplo: 0025_1"
            maxLength="7"
            className="input-contrato"
            />
            <small className="hint-text">Debe seguir el formato 0000_0 (Ejemplo: 0025_1)</small>

            {/* Despacho */}
            <div className="sub-options">
            <label className="sub-options-title">Despacho</label>
            <div className="checkbox-grid">
                <div className="checkbox-group">
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Completo"
                            checked={formData.detalles.despacho?.includes("Completo") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    despacho: formData.detalles.despacho
                                    ? formData.detalles.despacho.includes(value)
                                        ? formData.detalles.despacho.filter(v => v !== value)
                                        : [...formData.detalles.despacho, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Completo</span>
                    </label>
                </div>
                <div className="checkbox-group">
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Parcial"
                            checked={formData.detalles.despacho?.includes("Parcial") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    despacho: formData.detalles.despacho
                                    ? formData.detalles.despacho.includes(value)
                                        ? formData.detalles.despacho.filter(v => v !== value)
                                        : [...formData.detalles.despacho, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Parcial</span>
                    </label>
                </div>
            </div>
            </div>

            {/* Tipo de operación */}  
            <label>Tipo de operación:</label>
            <select
            value={formData.detalles.tipoOperacion || ""}
            onChange={(e) =>
                setFormData({
                ...formData,
                detalles: { ...formData.detalles, tipoOperacion: e.target.value },
                })
            }
            >
            <option value="">Seleccione...</option>
            <option value="Alquiler">Alquiler</option>
            <option value="Venta">Venta</option>
            <option value="Prestamo">Prestamo</option>
            <option value="Intercambio">Intercambio</option>
            <option value="Movimiento de Stock">Movimiento de Stock</option>
            <option value="Venta por reposición">Venta por reposición</option>
            <option value="Cambio de Razón Social">Cambio de Razón Social</option>
            </select>

            {/* Estado de habilitación */}  
            <label>Estado de habilitación:</label>
            <small className="hint-text">URGENTE (sucio) - BASICO (limpio) - EXCELENTE (pintado)</small>
            <select
            value={formData.detalles.estadoHabilitacion || ""}
            onChange={(e) =>
                setFormData({
                ...formData,
                detalles: { ...formData.detalles, estadoHabilitacion: e.target.value },
                })
            }
            >
            <option value="">Seleccione...</option>
            <option value="Urgente">Urgente</option>
            <option value="Básico">Básico</option>
            <option value="Excelente">Excelente</option>
            </select>

            {/* Obra nueva */}  
            <label>¿Obra nueva?</label>
            <select
            value={formData.detalles.obraNueva || ""}
            onChange={(e) =>
                setFormData({
                ...formData,
                detalles: { ...formData.detalles, obraNueva: e.target.value },
                })
            }
            >
            <option value="">Seleccione...</option>
            <option value="Si">Si</option>
            <option value="No">No</option>
            </select>

            {/* ¿Requiere valorización adelantada? */}  
            <label>¿Requiere valorización adelantada?</label>
            <select
            value={formData.detalles.valorizacionAdelantada || ""}
            onChange={(e) =>
                setFormData({
                ...formData,
                detalles: { ...formData.detalles, valorizacionAdelantada: e.target.value },
                })
            }
            >
            <option value="">Seleccione...</option>
            <option value="Si">Si</option>
            <option value="No">No</option>
            </select>

            {/* Transporte */}
            <label>Transporte</label>
            <select
            value={formData.detalles.transporte || ""}
            onChange={(e) =>
                setFormData({
                ...formData,
                detalles: { ...formData.detalles, transporte: e.target.value },
                })
            }
            >
            <option value="">Seleccione...</option>
            <option value="Ellos">Ellos</option>
            <option value="Nosotros">Nosotros</option>
            </select>

            {/* Fecha y Hora de Entrega */}
            
            <div className="entrega-container">
                <label>Fecha de entrega en obra:</label>
                <input
                type="date"
                value={formData.detalles.fechaEntrega || ""}
                onChange={(e) => {
                    setFormData({
                    ...formData,
                    detalles: { ...formData.detalles, fechaEntrega: e.target.value },
                    });
                }}
                min={new Date().toISOString().split("T")[0]} // Restringe fechas pasadas
                required
                />

                <label>Hora de entrega en obra:</label>
                <input
                type="time"
                value={formData.detalles.horaEntrega || ""}
                onChange={(e) => {
                    setFormData({
                    ...formData,
                    detalles: { ...formData.detalles, horaEntrega: e.target.value },
                    });
                }}
                required
                />
            </div>
            

            {/* Nota */}
            <div className="sub-options">
            <label className="sub-options-title">¿Adaptar motor para energía trifásica 380?</label>
            <div className="checkbox-grid">
                <div className="checkbox-group">
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Adaptar"
                            checked={formData.detalles.adaptarMotor?.includes("Adaptar") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    adaptarMotor: formData.detalles.adaptarMotor
                                    ? formData.detalles.adaptarMotor.includes(value)
                                        ? formData.detalles.adaptarMotor.filter(v => v !== value)
                                        : [...formData.detalles.adaptarMotor, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Adaptar</span>
                    </label>
                </div>
                <div className="checkbox-group">
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="No adaptar"
                            checked={formData.detalles.adaptarMotor?.includes("No adaptar") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    adaptarMotor: formData.detalles.adaptarMotor
                                    ? formData.detalles.adaptarMotor.includes(value)
                                        ? formData.detalles.adaptarMotor.filter(v => v !== value)
                                        : [...formData.detalles.adaptarMotor, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>No adaptar</span>
                    </label>
                </div>
            </div>
            </div>

            {/* Info And. TRABAJO */}
            <div className="sub-options">
            <label className="sub-options-title">Info And.TRABAJO</label>
                <div className="checkbox-group">
                    <span>Plataformado:</span>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Plataformado Superior"
                            checked={formData.detalles.plataformado?.includes("Plataformado Superior") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    plataformado: formData.detalles.plataformado
                                    ? formData.detalles.plataformado.includes(value)
                                        ? formData.detalles.plataformado.filter(v => v !== value)
                                        : [...formData.detalles.plataformado, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Superior</span>
                    </label>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Completo"
                            checked={formData.detalles.plataformado?.includes("Completo") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    plataformado: formData.detalles.plataformado
                                    ? formData.detalles.plataformado.includes(value)
                                        ? formData.detalles.plataformado.filter(v => v !== value)
                                        : [...formData.detalles.plataformado, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Completo</span>
                    </label>
                </div>
            </div>

            {/* Info Escaleras */}
            <div className="sub-options">
            <label className="sub-options-title">Info ESCALERAS</label>
                <div className="checkbox-group">
                    <span>Ingreso:</span>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Lado LARGO - 3.07m"
                            checked={formData.detalles.ingreso?.includes("Lado LARGO - 3.07m") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    ingreso: formData.detalles.ingreso
                                    ? formData.detalles.ingreso.includes(value)
                                        ? formData.detalles.ingreso.filter(v => v !== value)
                                        : [...formData.detalles.ingreso, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Lado LARGO - 3.07m</span>
                    </label>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Lado ANCHO - 1.57m"
                            checked={formData.detalles.ingreso?.includes("Lado ANCHO - 1.57m") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    ingreso: formData.detalles.ingreso
                                    ? formData.detalles.ingreso.includes(value)
                                        ? formData.detalles.ingreso.filter(v => v !== value)
                                        : [...formData.detalles.ingreso, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Lado ANCHO - 1.57m</span>
                    </label>
                </div>
                <div className="checkbox-group">
                    <span>Habilitar pasadizo/balcón:</span>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Con pasadizo"
                            checked={formData.detalles.pasadizo?.includes("Con pasadizo") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    pasadizo: formData.detalles.pasadizo
                                    ? formData.detalles.pasadizo.includes(value)
                                        ? formData.detalles.pasadizo.filter(v => v !== value)
                                        : [...formData.detalles.pasadizo, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Con</span>
                    </label>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Sin pasadizo"
                            checked={formData.detalles.pasadizo?.includes("Sin pasadizo") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    pasadizo: formData.detalles.pasadizo
                                    ? formData.detalles.pasadizo.includes(value)
                                        ? formData.detalles.pasadizo.filter(v => v !== value)
                                        : [...formData.detalles.pasadizo, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Sin</span>
                    </label>
                </div>
                <div className="checkbox-group">
                    <span>Tipo de escalera:</span>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Tipo FERMIN"
                            checked={formData.detalles.tipoEscalera?.includes("Tipo FERMIN") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    tipoEscalera: formData.detalles.tipoEscalera
                                    ? formData.detalles.tipoEscalera.includes(value)
                                        ? formData.detalles.tipoEscalera.filter(v => v !== value)
                                        : [...formData.detalles.tipoEscalera, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Tipo FERMIN</span>
                    </label>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Tipo GURSAM 60"
                            checked={formData.detalles.tipoEscalera?.includes("Tipo GURSAM 60") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    tipoEscalera: formData.detalles.tipoEscalera
                                    ? formData.detalles.tipoEscalera.includes(value)
                                        ? formData.detalles.tipoEscalera.filter(v => v !== value)
                                        : [...formData.detalles.tipoEscalera, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Tipo GURSAM 60</span>
                    </label>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Según STOCK"
                            checked={formData.detalles.tipoEscalera?.includes("Según STOCK") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    tipoEscalera: formData.detalles.tipoEscalera
                                    ? formData.detalles.tipoEscalera.includes(value)
                                        ? formData.detalles.tipoEscalera.filter(v => v !== value)
                                        : [...formData.detalles.tipoEscalera, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Según STOCK</span>
                    </label>
                </div>
            </div>

            {/* Info ANDAMIO ELÉCTRICO */}
            <div className="sub-options">
            <label className="sub-options-title">Info ANDAMIO ELÉCTRICO</label>
                <div className="checkbox-group">
                    <span>Tipo de servicio:</span>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Básico"
                            checked={formData.detalles.tipoServicioColgante?.includes("Básico") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    tipoServicioColgante: formData.detalles.tipoServicioColgante
                                    ? formData.detalles.tipoServicioColgante.includes(value)
                                        ? formData.detalles.tipoServicioColgante.filter(v => v !== value)
                                        : [...formData.detalles.tipoServicioColgante, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Básico</span>
                    </label>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Intermedio"
                            checked={formData.detalles.tipoServicioColgante?.includes("Intermedio") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    tipoServicioColgante: formData.detalles.tipoServicioColgante
                                    ? formData.detalles.tipoServicioColgante.includes(value)
                                        ? formData.detalles.tipoServicioColgante.filter(v => v !== value)
                                        : [...formData.detalles.tipoServicioColgante, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Intermedio</span>
                    </label>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Integral"
                            checked={formData.detalles.tipoServicioColgante?.includes("Integral") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    tipoServicioColgante: formData.detalles.tipoServicioColgante
                                    ? formData.detalles.tipoServicioColgante.includes(value)
                                        ? formData.detalles.tipoServicioColgante.filter(v => v !== value)
                                        : [...formData.detalles.tipoServicioColgante, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Integral</span>
                    </label>
                </div>
            </div>

            {/* OTROS */}
            <div className="sub-options">
            <label className="sub-options-title">Otros</label>
                <div className="checkbox-group">
                    <span>Venta:</span>
                    <label className="checkbox-item">
                        <input 
                            type="checkbox" 
                            value="Perno c/ argolla - M12x80"
                            checked={formData.detalles.venta?.includes("Perno c/ argolla - M12x80") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    venta: formData.detalles.venta
                                    ? formData.detalles.venta.includes(value)
                                        ? formData.detalles.venta.filter(v => v !== value)
                                        : [...formData.detalles.venta, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Perno c/ argolla - M12x80</span>
                    </label>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Perno Expansion - M16x145"
                            checked={formData.detalles.venta?.includes("Perno Expansion - M16x145") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    venta: formData.detalles.venta
                                    ? formData.detalles.venta.includes(value)
                                        ? formData.detalles.venta.filter(v => v !== value)
                                        : [...formData.detalles.venta, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Perno Expansion - M16x145</span>
                    </label>
                </div>
                <div className="checkbox-group">
                    <span>¿Pedido incluye puntales?</span>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Con Puntales"
                            checked={formData.detalles.puntales?.includes("Con Puntales") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    puntales: formData.detalles.puntales
                                    ? formData.detalles.puntales.includes(value)
                                        ? formData.detalles.puntales.filter(v => v !== value)
                                        : [...formData.detalles.puntales, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Con</span>
                    </label>
                    <label className="checkbox-item">
                    <input 
                            type="checkbox" 
                            value="Sin Puntales"
                            checked={formData.detalles.puntales?.includes("Sin Puntales") || false}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData({
                                ...formData,
                                detalles: {
                                    ...formData.detalles,
                                    puntales: formData.detalles.puntales
                                    ? formData.detalles.puntales.includes(value)
                                        ? formData.detalles.puntales.filter(v => v !== value)
                                        : [...formData.detalles.puntales, value]
                                    : [value]
                                }
                                });
                            }}
                            />
                        <span>Sin</span>
                    </label>
                </div>
            </div>

            {/* Nota adicional */}
            <div className="nota-container">
            <label className="nota-label">📝 Nota:</label>
            <textarea
                className="nota-textarea"
                value={formData.detalles.nota || ""}
                onChange={(e) =>
                setFormData({
                    ...formData,
                    detalles: { ...formData.detalles, nota: e.target.value },
                })
                }
                placeholder="Escribe aquí los detalles adicionales..."
            />
            </div>
        </div>
        )}

        {/* Tipo de tarea Servicios Adicionales */}
        {tipoTarea === "Servicios Adicionales" && (
        <div className="tarea-detalles">
            <h3>Detalles de Servicios Adicionales</h3>

            {/* Tipo de servicio */}  
            <label>Indique el servicio:</label>
            <select
            value={formData.detalles.tipoServicio || ""}
            onChange={(e) =>
                setFormData({
                ...formData,
                detalles: { ...formData.detalles, tipoServicio: e.target.value },
                })
            }
            >
            <option value="">Seleccione...</option>
            <option value="Visita técnica">Visita técnica</option>
            <option value="Capacitación">Capacitación</option>
            <option value="Montaje">Montaje</option>
            <option value="Desmontaje">Desmontaje</option>
            <option value="Transporte">Transporte</option>
            </select>

            {/* Fecha y Hora */}
            {formData.detalles.tipoServicio && (
            <div className="entrega-container">
                <label>Fecha en obra:</label>
                <input
                type="date"
                value={formData.detalles.fechaEntrega || ""}
                onChange={(e) => {
                    setFormData({
                    ...formData,
                    detalles: { ...formData.detalles, fechaEntrega: e.target.value },
                    });
                }}
                min={new Date().toISOString().split("T")[0]} // Restringe fechas pasadas
                required
                />

                <label>Hora en obra:</label>
                <input
                type="time"
                value={formData.detalles.horaEntrega || ""}
                onChange={(e) => {
                    setFormData({
                    ...formData,
                    detalles: { ...formData.detalles, horaEntrega: e.target.value },
                    });
                }}
                required
                />
            </div>
            )}

            {/* Número y versión de contrato */}
            <label>Número y versión de contrato:</label>
            <input
            type="text"
            value={formData.detalles.numeroVersionContrato || ""}
            onChange={(e) => {
                let value = e.target.value.toUpperCase(); // Convertir a mayúsculas automáticamente
                if (value === "" || /^[0-9_]*$/.test(value)) { // Permite escribir números y guion bajo
                setFormData({
                    ...formData,
                    detalles: { ...formData.detalles, numeroVersionContrato: value },
                });
                }
            }}
            onBlur={(e) => {
                const regex = /^\d{4}_\d{1,2}$/;
                if (!regex.test(e.target.value)) {
                alert("Formato incorrecto. Debe ser 0000_0 (Ejemplo: 0025_1)");
                setFormData({
                    ...formData,
                    detalles: { ...formData.detalles, numeroVersionContrato: "" }, // Borra si es incorrecto
                });
                }
            }}
            placeholder="Ejemplo: 0025_1"
            maxLength="7"
            className="input-contrato"
            />
            <small className="hint-text">Debe seguir el formato 0000_0 (Ejemplo: 0025_1)</small>

            {/* Nota adicional */}
            <div className="nota-container">
            <label className="nota-label">📝 Nota:</label>
            <textarea
                className="nota-textarea"
                value={formData.detalles.nota || ""}
                onChange={(e) =>
                setFormData({
                    ...formData,
                    detalles: { ...formData.detalles, nota: e.target.value },
                })
                }
                placeholder="Escribe aquí los detalles adicionales..."
            />
            </div>
        </div>
        )}

        <button type="submit" className="btn-registrar">Registrar Tarea</button>
      </form>

    </div>
  );
}