import CheckValorizacion from "./checklists/administrativo/CheckValorizacion";
import CheckLiquidacion from "./checklists/administrativo/CheckLiquidacion";
import CheckAcuerdoComercial from "./checklists/administrativo/CheckAcuerdoComercial";

export default function DetallesApoyoAdmin({ detalles, onChange }) {
  const { apoyoAdministrativo } = detalles;

  const renderChecklist = () => {
    switch (apoyoAdministrativo) {
      case "Valorización":
        return <CheckValorizacion detalles={detalles} onChange={onChange} />;
      case "Liquidación":
        return <CheckLiquidacion detalles={detalles} onChange={onChange} />;
      case "Info Acuerdo Comercial":
        return <CheckAcuerdoComercial detalles={detalles} onChange={onChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="tarea-detalles">
      <h3>Detalles de Apoyo Administrativo</h3>

      <label>Requiere apoyo administrativo con:</label>
      <select
        value={apoyoAdministrativo || ""}
        onChange={(e) => onChange("apoyoAdministrativo", e.target.value)}
      >
        <option value="">Seleccione...</option>
        <option value="Valorización">Valorización</option>
        <option value="Liquidación">Liquidación</option>
        <option value="Info Acuerdo Comercial">Info Acuerdo Comercial</option>
      </select>

      {renderChecklist()}

      {/* Información adicional: ¿Enviar al cliente? */}
        <div className="sub-options">
        <label className="sub-options-title">¿Enviar al cliente?</label>
        <div className="checkbox-grid">
            <div className="checkbox-group">
            <label className="checkbox-item">
                <input
                type="checkbox"
                value="Enviar al cliente"
                checked={detalles.envioCliente?.includes("Enviar al cliente") || false}
                onChange={() => {
                    const value = "Enviar al cliente";
                    const actual = detalles.envioCliente || [];
                    const nuevo = actual.includes(value)
                    ? actual.filter((v) => v !== value)
                    : [...actual, value];
                    onChange("envioCliente", nuevo);
                }}
                />
                <span>Sí</span>
            </label>
            </div>
            <div className="checkbox-group">
            <label className="checkbox-item">
                <input
                type="checkbox"
                value="No enviar al cliente"
                checked={detalles.envioCliente?.includes("No enviar al cliente") || false}
                onChange={() => {
                    const value = "No enviar al cliente";
                    const actual = detalles.envioCliente || [];
                    const nuevo = actual.includes(value)
                    ? actual.filter((v) => v !== value)
                    : [...actual, value];
                    onChange("envioCliente", nuevo);
                }}
                />
                <span>No</span>
            </label>
            </div>
        </div>
        </div>


      <label>📝 Nota:</label>
      <textarea
        className="nota-textarea"
        value={detalles.nota || ""}
        onChange={(e) => onChange("nota", e.target.value)}
        placeholder="Escribe aquí los detalles adicionales..."
      />
    </div>
  );
}