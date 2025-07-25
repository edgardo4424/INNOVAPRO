import { useState, useEffect } from "react";
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
    const contacto = contactos.find(contacto => contacto.id === contactoId);  // Buscamos el contacto seleccionado por su ID
    setFormData((prev) => ({ // Actualizamos el estado del formulario con los datos del contacto seleccionado
      ...prev,
      entidad: {
        contacto: {
          id: contactoId,
          nombre: contacto?.nombre || "",
        },
        cliente: {
          id: null,
          razon_social: "",
        },
        obra: {
          id: null,
          nombre: "",
          direccion: "",
          ubicacion: "",
        },
        filial: {
          id: null,
          nombre: "",
        }
      },
    }));
    setClientesFiltrados(Array.isArray(contacto?.clientes_asociados) ? contacto.clientes_asociados : []); // Filtramos los clientes asociados al contacto seleccionado
    setObrasFiltradas(Array.isArray(contacto?.obras_asociadas) ? contacto.obras_asociadas : []); // Filtramos las obras asociadas al contacto seleccionado
  };

  // En caso de que vengan datos pre cargados de la cotización: Por tarea de Oficina Técnica
  // Se cargarán los datos automáticamente gracias a el siguiente useEffect:
  useEffect(() => {
    const contacto_cargado = formData.entidad.contacto;
    if (contacto_cargado.id) {
      const contacto = contactos.find(contacto => contacto.id === contacto_cargado.id);
      if (contacto) {
        setClientesFiltrados(Array.isArray(contacto.clientes_asociados) ? contacto.clientes_asociados : []);
        setObrasFiltradas(Array.isArray(contacto.obras_asociadas) ? contacto.obras_asociadas : []); 
      }
    }
  }, [contactos, formData.entidad.contacto.id]);

  const handleChange = (campo, valor) => { // Función para manejar los cambios en los campos del formulario
    setFormData((prev) => ({ 
      ...prev, 
      entidad: {
        ...prev.entidad,
        [campo]: valor,
      }
    })); // Actualizamos el estado del formulario con el nuevo valor del campo
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
          options={contactos.map(contacto => ({ label: `${contacto.nombre} — ${contacto.email}`, value: contacto.id }))} 
          value={contactos.find(contacto => contacto.id === formData.entidad.contacto.id)
            ? { label: `${contactos.find(contacto => contacto.id === formData.entidad.contacto.id).nombre}`, value: formData.entidad.contacto.id }
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
          isDisabled={!formData.entidad.contacto.id}
          options={clientesFiltrados.map(cliente => ({ label: cliente.razon_social, value: cliente.id }))}
          value={clientesFiltrados.find(cliente => cliente.id === formData.entidad.cliente.id)
            ? { label: clientesFiltrados.find(cliente => cliente.id === formData.entidad.cliente.id).razon_social, value: formData.entidad.cliente.id }
            : null}
          onChange={(option) => {
            handleChange("cliente", {
              id: option.value,
              razon_social: option.label,
            })
          }}
          placeholder="— Seleccione un cliente relacionado —"
        />
        {errores?.cliente_id && <span className="error-text">⚠ {errores.cliente_id}</span>}
      </div>

      <div className="wizard-section">
        <label>Obra:</label>
        <Select
          isDisabled={!formData.entidad.contacto.id}
          options={obrasFiltradas}
          getOptionLabel={(obra) => obra.nombre}
          getOptionValue={(obra) => obra.id}
          value={obrasFiltradas.find((obra) => obra.id === formData.entidad.obra.id) || null}
          onChange={(obra) => {
            handleChange("obra", {
              id: obra.id,
              nombre: obra.nombre,
              direccion: obra.direccion || "",
              ubicacion: obra.ubicacion || "",
            })
          }}
          placeholder="— Seleccione una obra relacionada —"
        />
        {errores?.obra_id && <span className="error-text">⚠ {errores.obra_id}</span>}
      </div>

      <div className="wizard-section">
        <label>Filial (Empresa Proveedora):</label>
        <Select
          options={filiales.map(filial => ({ label: filial.razon_social, value: filial.id }))}
          value={filiales.find(filial => filial.id === formData.entidad.filial.id)
            ? { label: filiales.find(filial => filial.id === formData.entidad.filial.id).razon_social, value: formData.entidad.filial.id }
            : null}
          onChange={(option) => {
            handleChange("filial", {
              id: option.value,
              razon_social: option.label,
            })
          }}
          placeholder="— Seleccione una filial —"
        />
        {errores?.filial_id && <span className="error-text">⚠ {errores.filial_id}</span>}
      </div>
    </div>
  );
}