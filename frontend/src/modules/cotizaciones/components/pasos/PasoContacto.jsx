import { useEffect, useState } from "react";
import { useWizardContext } from "../../hooks/useWizardCotizacion";
import api from "@/shared/services/api";
import Loader from "@/shared/components/Loader";
import Select from "react-select";

export default function PasoContacto() {
  const { formData, setFormData, errores } = useWizardContext();

  const [contactos, setContactos] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [obrasFiltradas, setObrasFiltradas] = useState([]);
  const [filiales, setFiliales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [contactosRes, filialesRes] = await Promise.all([
          api.get("/contactos"),
          api.get("/filiales")
        ]);
        setContactos(contactosRes.data);
        setFiliales(filialesRes.data);
      } catch (error) {
        console.error("Error cargando datos del paso 1", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleSeleccionContacto = (contactoId) => {
    const contacto = contactos.find(c => c.id === contactoId);
    setFormData((prev) => ({
      ...prev,
      contacto_id: contactoId,
      contacto_nombre: contacto?.nombre || "",
      cliente_id: null,
      cliente_nombre: "",
      obra_id: null,
      obra_nombre: ""
    }));
    setClientesFiltrados(contacto.clientes_asociados || []);
    setObrasFiltradas(contacto.obras_asociadas || []);
  };

  const handleChange = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  if (loading) return <Loader texto="Cargando datos del paso 1..." />;

  return (
    <div className="paso-formulario">
      <h3>Paso 1: Selección del Contacto y Datos Relacionados</h3>

      <div className="wizard-section">
        <label>Contacto:</label>
        <Select
          options={contactos.map(c => ({ label: `${c.nombre} — ${c.email}`, value: c.id }))}
          value={contactos.find(c => c.id === formData.contacto_id)
            ? { label: `${contactos.find(c => c.id === formData.contacto_id).nombre}`, value: formData.contacto_id }
            : null}
          onChange={(option) => handleSeleccionContacto(option.value)}
          placeholder="Seleccione un contacto..."
        />
      </div>

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
          placeholder="Seleccione un cliente relacionado..."
        />
      </div>

      <div className="wizard-section">
        <label>Obra:</label>
        <Select
          isDisabled={!formData.contacto_id}
          options={obrasFiltradas.map(o => ({ label: o.nombre, value: o.id }))}
          value={obrasFiltradas.find(o => o.id === formData.obra_id)
            ? { label: obrasFiltradas.find(o => o.id === formData.obra_id).nombre, value: formData.obra_id }
            : null}
          onChange={(option) => {
            handleChange("obra_id", option.value)
            handleChange("obra_nombre", option.label)
          }}
          placeholder="Seleccione una obra relacionada..."
        />
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
          placeholder="Seleccione una filial..."
        />
      </div>
      
    </div>
  );
}