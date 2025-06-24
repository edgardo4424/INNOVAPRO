import CheckATTrabajo from "./checklists/CheckATTrabajo";
import CheckAFFachada from "./checklists/CheckAFFachada";
import CheckEscaleraAcceso from "./checklists/CheckEscaleraAcceso";
import CheckEscuadras from "./checklists/CheckEscuadras";
import CheckEncofrado from "./checklists/CheckEncofrado";
import CheckElevador from "./checklists/CheckElevador";
import Select from "react-select";
import { usePasoUso } from "../../cotizaciones/hooks/paso-uso/usePasoUso";

export default function DetallesApoyoTecnico({ detalles, onChange }) {
  const { tipoEquipo } = detalles;
  const { usos, handleChange: handleTipoEquipoChange } = usePasoUso({
    formData: { uso_id: detalles.tipoEquipo }, // uso_id como tipoEquipo
  });


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

  const opcionesApoyoTecnico = [
    { label: "Modulación", value: "Modulación" },
    { label: "Despiece", value: "Despiece" },
    { label: "Memoria de cálculo", value: "Memoria de cálculo" },
    { label: "Certificado de operatividad", value: "Certificado de operatividad" },
    { label: "Otro", value: "Otro" },
  ];

  return (
    <div className="tarea-detalles">
      <h3>Detalles de Apoyo Técnico</h3>

      <label>Requiere apoyo técnico con:</label>
      <Select
        isMulti
        options={opcionesApoyoTecnico}
        value={(detalles.apoyoTecnico || []).map((v) => ({ label: v, value: v }))}
        onChange={(selected) => onChange("apoyoTecnico", selected.map((opt) => opt.value))}
        placeholder="Seleccione uno o más..."
      />

      {(detalles.apoyoTecnico || []).includes("Modulación") && (
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
        value={detalles.usoId || ""}
        onChange={(e) => {
          onChange("usoId", e.target.value)
        }}
      >
        <option value="">Seleccione...</option>
        {usos.map((u) => (
          <option key={u.id} value={u.id}>
            {u.descripcion}
          </option>
        ))}
      </select>


      {renderChecklist()}

      {(detalles.apoyoTecnico || []).includes("Despiece") && (
        <>
          {/* Tipo de cotización */}
          <label>Tipo de Cotización:</label>
          <select
            value={detalles.tipoCotizacion || ""}
            onChange={(e) => onChange("tipoCotizacion", e.target.value)}
          >
            <option value="">Seleccione...</option>
            <option value="Alquiler">Alquiler</option>
            <option value="Venta">Venta</option>
          </select>

          {/* Días de alquiler */}
          {detalles.tipoCotizacion === "Alquiler" && (
            <>
              <label>Días de Alquiler:</label>
              <input
                type="number"
                min="1"
                value={detalles.diasAlquiler || ""}
                onChange={(e) => onChange("diasAlquiler", parseInt(e.target.value))}
              />
            </>
          )}

          {/* Nota */}
          <label>📝 Nota de tarea:</label>
          <textarea
            value={detalles.notaDespiece || ""}
            onChange={(e) => onChange("notaDespiece", e.target.value)}
            placeholder="Escriba detalles relevantes del despiece"
          />
        </>
      )}
    </div>
  );
}