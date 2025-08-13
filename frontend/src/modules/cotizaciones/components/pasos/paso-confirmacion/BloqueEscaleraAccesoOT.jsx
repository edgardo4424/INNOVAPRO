import { useEffect, useState } from "react";

// Este componente es cuando OT ya ha generado el despiece y ha definido cuánta altura debe cubrir la escalera.
// Pero ahora, es el turno del comercial de cerrar el círculo: debe revisar lo generado y confirmar que los tramos (bloques físicos de 2m o 1m) 
// sumen exactamente lo que se necesita.
// Mientras el usuario ajusta estos valores, un sistema silencioso valida todo en tiempo real. Si la suma es incorrecta, aparece una advertencia en rojo. 
// Pero si coincide perfectamente, el sistema aprueba y felicita con un mensaje en verde.

export default function BloqueEscaleraAcceso({ formData, setFormData }) {

  const [errorTramos, setErrorTramos] = useState(false);

  // Almacenamos la altura total de la escalera que viene desde el backend
  const alturaTotal = formData.detalles_escaleras?.altura_total_general || 0;

  // Tramos que permitiremos que el comercial modifique para cuadrar la altura total
  const tramos2m = parseInt(formData.detalles_escaleras?.tramos_2m || 0);
  const tramos1m = parseInt(formData.detalles_escaleras?.tramos_1m || 0);

  // Guardamos el total y si es inválido mostramos "-"
  const totalCalculado = isNaN(tramos2m * 2 + tramos1m) ? "—" : tramos2m * 2 + tramos1m;

  // Cada vez que cambian los tramos o la altura, revisamos si la suma es correcta
  // Si no coincide mostramos el error
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
            value={formData.uso.detalles_escaleras?.precio_tramo || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                uso: {
                  ...prev.uso,
                  detalles_escaleras: {
                    ...prev.uso.detalles_escaleras,
                    precio_tramo: parseFloat(e.target.value) || 0,
                  },
                }
              }))
            }
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold", color: "#ff7a00" }}>Altura total general (m):</label>
          <input
            type="number"
            onWheel={(e) => e.target.blur()}
            value={formData.uso.detalles_escaleras?.altura_total_general || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                uso: {
                  ...prev.uso,
                  detalles_escaleras: {
                    ...prev.uso.detalles_escaleras,
                    altura_total_general: e.target.value || 0,
                  },
                }
              }))
            }
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold", color: "#ff7a00" }}>Tramos de 2 (m):</label>
          <input
            type="number"
            onWheel={(e) => e.target.blur()}
            min={0}
            value={formData.uso.detalles_escaleras?.tramos_2m ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                uso: {
                  ...prev.uso,
                  detalles_escaleras: {
                    ...prev.uso.detalles_escaleras,
                    tramos_2m: e.target.value === "" ? "" : parseInt(e.target.value),
                  },
                }
              }))
            }
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold", color: "#ff7a00" }}>Tramos de 1 (m):</label>
          <input
            type="number"
            onWheel={(e) => e.target.blur()}
            min={0}
            value={formData.uso.detalles_escaleras?.tramos_1m ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                uso: {
                  ...prev.uso,
                  detalles_escaleras: {
                    ...prev.uso.detalles_escaleras,
                    tramos_1m: e.target.value === "" ? "" : parseInt(e.target.value),
                  },
                }
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