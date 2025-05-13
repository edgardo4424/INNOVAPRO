import { useEffect, useState } from "react";
import { useWizardContext } from "../../hooks/useWizardCotizacion";
import api from "@/shared/services/api";
import Loader from "@/shared/components/Loader";

export default function PasoContacto() {
  const { formData, setFormData, errores } = useWizardContext();

  const [contactos, setContactos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [obras, setObras] = useState([]);
  const [filiales, setFiliales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [contactosRes, clientesRes, obrasRes, filialesRes] = await Promise.all([
          api.get("/contactos"),
          api.get("/clientes"),
          api.get("/obras"),
          api.get("/filiales")
        ]);
        setContactos(contactosRes.data);
        setClientes(clientesRes.data);
        setObras(obrasRes.data);
        setFiliales(filialesRes.data);
      } catch (error) {
        console.error("Error cargando datos del paso 1", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  if (loading) return <Loader texto="Cargando datos del paso 1..." />;

  return (
    <div className="paso-formulario">
      <h3>Paso 1: Selección del Contacto y Datos Relacionados</h3>

      <label>Contacto:</label>
      <select
        value={formData.contacto_id || ""}
        onChange={(e) => handleChange("contacto_id", parseInt(e.target.value))}
      >
        <option value="">Seleccione un contacto...</option>
        {contactos.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre} — {c.email}
          </option>
        ))}
      </select>

      <label>Cliente:</label>
      <select
        value={formData.cliente_id || ""}
        onChange={(e) => handleChange("cliente_id", parseInt(e.target.value))}
      >
        <option value="">Seleccione un cliente...</option>
        {clientes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.razon_social}
          </option>
        ))}
      </select>

      <label>Obra:</label>
      <select
        value={formData.obra_id || ""}
        onChange={(e) => handleChange("obra_id", parseInt(e.target.value))}
      >
        <option value="">Seleccione una obra...</option>
        {obras.map((o) => (
          <option key={o.id} value={o.id}>
            {o.nombre}
          </option>
        ))}
      </select>

      <label>Filial (Empresa Proveedora):</label>
      <select
        value={formData.filial_id || ""}
        onChange={(e) => handleChange("filial_id", parseInt(e.target.value))}
      >
        <option value="">Seleccione una filial...</option>
        {filiales.map((f) => (
          <option key={f.id} value={f.id}>
            {f.razon_social}
          </option>
        ))}
      </select>
    </div>
  );
}