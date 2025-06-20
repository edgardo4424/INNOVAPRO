import { useState } from "react";
import { useWizardContext } from "../../context/WizardCotizacionContext";
import usePasoContacto from "../../hooks/paso-contacto/usePasoContacto";
import Loader from "@/shared/components/Loader";
import Select from "react-select";

// Este componente representa el primer paso del wizard para registrar una cotización.
// Permite seleccionar un contacto y los datos relacionados como cliente, obra y filial.
// Utiliza el contexto del wizard para manejar el estado del formulario y los errores.
// Carga los contactos y filiales desde el API al iniciar y actualiza el estado del formulario según las selecciones del usuario.
// También maneja la lógica de filtrado de clientes y obras según el contacto seleccionado.
// Muestra un loader mientras se obtienen los datos iniciales y maneja errores de carga.
// Este paso es esencial para establecer la relación entre el contacto, cliente y obra antes de continuar con los siguientes pasos del wizard.

export default function PasoContacto() {
  const { formData, setFormData, errores } = useWizardContext(); // Traemos el contexto del wizard donde se maneja el estado del formulario y los errores
  const { contactos, filiales, loading } = usePasoContacto(); // Usamos el hook personalizado para cargar contactos y filiales

  const [clientesFiltrados, setClientesFiltrados] = useState([]); // Guarda los clientes filtrados por el contacto seleccionado
  const [obrasFiltradas, setObrasFiltradas] = useState([]); // Guarda las obras filtradas por el contacto seleccionado

  const handleSeleccionContacto = (contactoId) => { 
    const contacto = contactos.find(c => c.id === contactoId);  // Buscamos el contacto seleccionado por su ID
    setFormData((prev) => ({ // Actualizamos el estado del formulario con los datos del contacto seleccionado
      ...prev,
      contacto_id: contactoId,
      contacto_nombre: contacto?.nombre || "",
      cliente_id: null,
      cliente_nombre: "",
      obra_id: null,
      obra_nombre: "",
      obra_direccion: "",
      obra_ubicacion: "",
      filial_id: null,
      filial_nombre: ""
    }));
    setClientesFiltrados(Array.isArray(contacto?.clientes_asociados) ? contacto.clientes_asociados : []); // Filtramos los clientes asociados al contacto seleccionado
    setObrasFiltradas(Array.isArray(contacto?.obras_asociadas) ? contacto.obras_asociadas : []); // Filtramos las obras asociadas al contacto seleccionado
  };

  const handleChange = (campo, valor) => { // Función para manejar los cambios en los campos del formulario
    setFormData((prev) => ({ ...prev, [campo]: valor })); // Actualizamos el estado del formulario con el nuevo valor del campo
  };

  if (loading) return <Loader texto="Cargando datos del paso 1..." />;


  return (
    <div className="paso-formulario">
      <h3>Paso 1: Selección del Contacto y Datos Relacionados</h3>

      <p className="paso-info">
        <em>  
          En este paso, selecciona el contacto relacionado con la cotización y los datos asociados.
        </em>
      </p>

      <p className="paso-info">
        <em>
          Recuerda que el contacto debe tener al menos un cliente y una obra asociados.
        </em>
      </p>

      <div className="wizard-section">
        <label>Contacto:</label>
        <Select
          options={contactos.map(c => ({ label: `${c.nombre} — ${c.email}`, value: c.id }))} 
          value={contactos.find(c => c.id === formData.contacto_id)
            ? { label: `${contactos.find(c => c.id === formData.contacto_id).nombre}`, value: formData.contacto_id }
            : null} 
          onChange={(option) => handleSeleccionContacto(option.value)}
          placeholder="— Seleccione un contacto —"
        />
        {errores?.contacto_id && <span className="error-text">⚠ {errores.contacto_id}</span>}
      </div>

      <p className="paso-info">
        <em>
          Si el contacto no tiene clientes u obras asociados, debes crear primero esos registros.
        </em>
      </p>

      <div className="wizard-section">
        <label>Cliente:</label>
        <Select
          isDisabled={!formData.contacto_id}
          options={clientesFiltrados.map(c => ({ label: c.razon_social, value: c.id }))}
          value={clientesFiltrados.find(c => c.id === formData.cliente_id)
            ? { label: clientesFiltrados.find(c => c.id === formData.cliente_id).razon_social, value: formData.cliente_id }
            : null}
          onChange={(option) => {
            handleChange("cliente_id", option.value)
            handleChange("cliente_nombre", option.label)
          }}
          placeholder="— Seleccione un cliente relacionado —"
        />
        {errores?.cliente_id && <span className="error-text">⚠ {errores.cliente_id}</span>}
      </div>

      <div className="wizard-section">
        <label>Obra:</label>
        <Select
          isDisabled={!formData.contacto_id}
          options={obrasFiltradas}
          getOptionLabel={(obra) => obra.nombre}
          getOptionValue={(obra) => obra.id}
          value={obrasFiltradas.find((o) => o.id === formData.obra_id) || null}
          onChange={(obra) => {
            handleChange("obra_id", obra.id)
            handleChange("obra_nombre", obra.nombre)
            handleChange("obra_direccion", obra.direccion || "")
            handleChange("obra_ubicacion", obra.ubicacion || "")
          }}
          placeholder="— Seleccione una obra relacionada —"
        />
        {errores?.obra_id && <span className="error-text">⚠ {errores.obra_id}</span>}
      </div>

      <div className="wizard-section">
        <label>Filial (Empresa Proveedora):</label>
        <Select
          options={filiales.map(f => ({ label: f.razon_social, value: f.id }))}
          value={filiales.find(f => f.id === formData.filial_id)
            ? { label: filiales.find(f => f.id === formData.filial_id).razon_social, value: formData.filial_id }
            : null}
          onChange={(option) => {
            handleChange("filial_id", option.value)
            handleChange("filial_nombre", option.label)
          }}
          placeholder="— Seleccione una filial —"
        />
        {errores?.filial_id && <span className="error-text">⚠ {errores.filial_id}</span>}
      </div>
    </div>
  );
}