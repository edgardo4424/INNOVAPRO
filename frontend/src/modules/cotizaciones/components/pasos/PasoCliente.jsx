// INNOVA PRO+ v1.2.0
import { useWizardContext } from "../../hooks/useWizardCotizacion";

const PasoCliente = () => {
  const { formData, setFormData, errores } = useWizardContext();

  return (
    <div className="paso-formulario">
      <h3>Paso 1: Selección del Cliente</h3>

      <label>Cliente:</label>
      <input
        type="text"
        value={formData.cliente || ""}
        onChange={(e) =>
          setFormData({ ...formData, cliente: e.target.value })
        }
        placeholder="Ej: Inversiones ABC SAC"
      />
      {errores.cliente && <p className="error-text">{errores.cliente}</p>}

      <label>Obra:</label>
      <input
        type="text"
        value={formData.obra || ""}
        onChange={(e) => setFormData({ ...formData, obra: e.target.value })}
        placeholder="Ej: Obra Plaza Norte"
      />
      {errores.obra && <p className="error-text">{errores.obra}</p>}

      <label>Contacto:</label>
      <input
        type="text"
        value={formData.contacto || ""}
        onChange={(e) =>
          setFormData({ ...formData, contacto: e.target.value })
        }
        placeholder="Ej: Juan Pérez"
      />
      {errores.contacto && <p className="error-text">{errores.contacto}</p>}
    </div>
  );
};

export default PasoCliente;