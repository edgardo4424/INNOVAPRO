// INNOVA PRO+ v1.2.1
import { useEffect, useState } from "react";
import { useWizardContext } from "../../hooks/useWizardCotizacion";
import api from "@/shared/services/api";
import Loader from "@/shared/components/Loader";

export default function PasoContacto() {
  const { formData, setFormData, errores } = useWizardContext();
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarContactos = async () => {
      try {
        const { data } = await api.get("/contactos");
        setContactos(data);
      } catch (error) {
        console.error("Error al cargar contactos", error);
      } finally {
        setLoading(false);
      }
    };
    cargarContactos();
  }, []);

  const handleSeleccion = (contacto) => {
    const cliente = contacto.clientes_asociados?.[0];
    const obra = contacto.obras_asociadas?.[0];

    setFormData((prev) => ({
      ...prev,
      contacto_id: contacto.id,
      cliente_id: cliente?.id || null,
      obra_id: obra?.id || null,
    }));
  };

  if (loading) return <Loader texto="Cargando contactos..." />;

  return (
    <div className="paso-formulario">
      <h3>Paso 1: Selección del Contacto</h3>
      <label>Contacto:</label>
      <select
        value={formData.contacto_id || ""}
        onChange={(e) => {
          const contacto = contactos.find(c => c.id === parseInt(e.target.value));
          handleSeleccion(contacto);
        }}
      >
        <option value="">Seleccione un contacto...</option>
        {contactos.map((c) => {
          const cliente = c.clientes_asociados?.[0]?.razon_social || "--";
          const obra = c.obras_asociadas?.[0]?.nombre || "--";
          return (
            <option key={c.id} value={c.id}>
              {c.nombre} — {cliente} — {obra}
            </option>
          );
        })}
      </select>

      {errores.contacto && <p className="error-text">{errores.contacto}</p>}
    </div>
  );
}