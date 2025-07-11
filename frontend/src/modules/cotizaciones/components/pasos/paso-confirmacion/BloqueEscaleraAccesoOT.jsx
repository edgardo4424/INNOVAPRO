import { useEffect, useState } from "react";

export default function BloqueEscaleraAcceso({ formData, setFormData }) {
  const [errorTramos, setErrorTramos] = useState(false);

  const alturaTotal = formData.detalles_escaleras?.altura_total_general || 0;
  const tramos2m = parseInt(formData.detalles_escaleras?.tramos_2m || 0);
  const tramos1m = parseInt(formData.detalles_escaleras?.tramos_1m || 0);
  const totalCalculado = isNaN(tramos2m * 2 + tramos1m) ? "—" : tramos2m * 2 + tramos1m;

  useEffect(() => {
    const alturaEsperada = parseInt(alturaTotal);
    const alturaTramos = parseInt(totalCalculado);
    setErrorTramos(alturaTramos !== alturaEsperada);
  }, [tramos2m, tramos1m, alturaTotal]);

  return (
    <div className="wizard-section">
      <h4 style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#004aad" }}>
        🪜 <span>Detalles Escalera de Acceso Generado Desde OT</span>
      </h4>

      <div style={{ marginBottom: "1rem", fontSize: "14px", color: "#444" }}>
        Revisa el <strong>despiece</strong> generado por Oficina Técnica cuidadosamente e indica lo siguiente: <br />
        <strong>Precio por tramo</strong> de alquiler de la escalera.<br />
        <strong>Altura total general</strong> de la(s) escalera(s) de acceso.
        <br />
        Para que el cálculo sea válido, la suma de tramos de 2.00m y 1.00m debe coincidir con la altura total.
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        <div>
          <label style={{ fontWeight: "bold", color: "#ff7a00" }}>Precio por tramo (alquiler):</label>
          <input
            type="number"
            onWheel={(e) => e.target.blur()}
            value={formData.detalles_escaleras?.precio_tramo || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                detalles_escaleras: {
                  ...prev.detalles_escaleras,
                  precio_tramo: parseFloat(e.target.value) || 0,
                },
              }))
            }
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold", color: "#ff7a00" }}>Altura total general (m):</label>
          <input
            type="number"
            onWheel={(e) => e.target.blur()}
            value={formData.detalles_escaleras?.altura_total_general || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                detalles_escaleras: {
                  ...prev.detalles_escaleras,
                  altura_total_general: e.target.value || 0,
                },
              }))
            }
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold", color: "#ff7a00" }}>Tramos de 2.00 (m):</label>
          <input
            type="number"
            onWheel={(e) => e.target.blur()}
            min={0}
            value={formData.detalles_escaleras?.tramos_2m ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                detalles_escaleras: {
                  ...prev.detalles_escaleras,
                  tramos_2m: e.target.value === "" ? "" : parseInt(e.target.value),
                },
              }))
            }
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold", color: "#ff7a00" }}>Tramos de 1.00 (m):</label>
          <input
            type="number"
            onWheel={(e) => e.target.blur()}
            min={0}
            value={formData.detalles_escaleras?.tramos_1m ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                detalles_escaleras: {
                  ...prev.detalles_escaleras,
                  tramos_1m: e.target.value === "" ? "" : parseInt(e.target.value),
                },
              }))
            }
          />
        </div>

        {errorTramos ? (
          <div style={{ color: "#b10000", fontWeight: "bold", fontSize: "14px" }}>
            ⚠️ La suma de tramos ({tramos2m * 2 + tramos1m} m) no coincide con la altura total de {alturaTotal} m.
            <br />
            Por favor, ajusta los tramos para que coincidan.
          </div>
        ) : (
          <div style={{ color: "#187b00", fontWeight: "bold", fontSize: "14px" }}>
            ✅ Altura total validada: {tramos2m} tramo(s) de 2m + {tramos1m} tramo(s) de 1m = {alturaTotal} m.
          </div>
        )}
      </div>
    </div>
  );
}