import CheckATTrabajo from "./checklists/CheckATTrabajo";
import CheckAFFachada from "./checklists/CheckAFFachada";
import CheckEscaleraAcceso from "./checklists/CheckEscaleraAcceso";
import CheckEscuadras from "./checklists/CheckEscuadras";
import CheckEncofrado from "./checklists/CheckEncofrado";
import CheckElevador from "./checklists/CheckElevador";

export default function DetallesApoyoTecnico({ detalles, onChange }) {
  const { tipoEquipo } = detalles;

  const renderChecklist = () => {
    switch (tipoEquipo) {
      case "AT - And. TRABAJO":
        return <CheckATTrabajo detalles={detalles} onChange={onChange} />;
      case "AF - And. FACHADA":
        return <CheckAFFachada detalles={detalles} onChange={onChange} />;
      case "EA - Escalera Acceso":
        return <CheckEscaleraAcceso detalles={detalles} onChange={onChange} />;
      case "EC - Escuadras":
        return <CheckEscuadras detalles={detalles} onChange={onChange} />;
      case "EN - Encofrado":
        return <CheckEncofrado detalles={detalles} onChange={onChange} />;
      case "EV - Elevador":
        return <CheckElevador detalles={detalles} onChange={onChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="tarea-detalles">
      <h3>Detalles de Apoyo Técnico</h3>

      <label>Requiere apoyo técnico con:</label>
      <select
        value={detalles.apoyoTecnico || ""}
        onChange={(e) => onChange("apoyoTecnico", e.target.value)}
      >
        <option value="">Seleccione...</option>
        <option value="Modulación">Modulación</option>
        <option value="Despiece">Despiece</option>
        <option value="Memoria de cálculo">Memoria de cálculo</option>
        <option value="Certificado de operatividad">Certificado de operatividad</option>
        <option value="Otro">Otro</option>
      </select>

      {detalles.apoyoTecnico === "Modulación" && (
        <>
          <label>Tipo de Modulación:</label>
          <select
            value={detalles.tipoModulacion || ""}
            onChange={(e) => onChange("tipoModulacion", e.target.value)}
          >
            <option value="">Seleccione...</option>
            <option value="Básica">Básica</option>
            <option value="Detallada">Detallada</option>
          </select>
        </>
      )}

      <label>Tipo de Equipo:</label>
      <select
        value={tipoEquipo || ""}
        onChange={(e) => onChange("tipoEquipo", e.target.value)}
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

      {renderChecklist()}

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