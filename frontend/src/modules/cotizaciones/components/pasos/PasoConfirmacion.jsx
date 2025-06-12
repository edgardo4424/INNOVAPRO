import { useEffect } from "react";
import { useWizardContext } from "../../hooks/useWizardCotizacion";
import { generarDespiece, calcularCostoTransporte } from "../../services/cotizacionesService";
import Loader from "../../../../shared/components/Loader";

export default function PasoConfirmacion() {
  const { formData, setFormData } = useWizardContext();
  console.log(formData)
  useEffect(() => {
    const cargarDespiece = async () => {
      try {
        const data = await generarDespiece(formData.zonas, formData.uso_id);
    
        if (!data?.despiece || !Array.isArray(data.despiece)) {
          throw new Error("La respuesta del backend no contiene un despiece válido");
        }

        const hayPernos = data.despiece.some(p => {
          const desc = p.descripcion?.toUpperCase() || "";
          return (
            desc.includes("PERNO DE EXPANSIÓN") || // forma genérica
            desc.includes("PERNOS DE EXPANSION") || // sin tilde
            desc.includes("M12 X 80") ||
            desc.includes("M16 X 145")
          );
        });

        setFormData((prev) => ({
          ...prev,
          despiece: data.despiece,
          resumenDespiece: {
            total_piezas: data.total_piezas,
            peso_total_kg: data.peso_total_kg,
            peso_total_ton: data.peso_total_ton,
            precio_subtotal_venta_dolares: data.precio_subtotal_venta_dolares,
            precio_subtotal_venta_soles: data.precio_subtotal_venta_soles,
            precio_subtotal_alquiler_soles: data.precio_subtotal_alquiler_soles
          },
          requiereAprobacion: false,
          tiene_transporte: false,
          tiene_instalacion: false,
          tiene_pernos: false,
          tiene_pernos_disponibles: hayPernos,
        }));
      } catch (error) {
        console.error("Error generando despiece:", error.message);
      }
    };

    cargarDespiece();
  }, []);

  function extraerDistrito(direccion) {
        if (!direccion) return "";
        const partes = direccion.split(",").map(p => p.trim());
        const posibles = partes.slice().reverse(); // empezamos desde el final
        for (let parte of posibles) {
          const sinNumeros = parte.replace(/[0-9]/g, "").trim();
          if (sinNumeros.length > 1 && !sinNumeros.includes("PERÚ")) {
            return sinNumeros.toUpperCase();
          }
        }
        return "";
  }

  useEffect(() => {
    const calcularTransporte = async () => {
      if (!formData.tiene_transporte) return;

      const pesoTn = formData.resumenDespiece?.peso_total_ton;
      const direccion = formData.obra_direccion || "";
      const distrito = extraerDistrito(direccion);



      if (!distrito || !pesoTn) return;

      console.log(extraerDistrito(formData.obra_direccion))

      try {
        
        let atributos_para_calcular_transporte = {
          uso_id: formData.uso_id,
          peso_total_tn: String(pesoTn),
          distrito_transporte: distrito,
          tipo_transporte: formData.tipo_transporte || "Desconocido"
        }
        
        switch (formData.uso_id) {
          case 1:
            break;
          case 2: // Andamios de Trabajo
            break;
          case 3:
            console.log(formData)
            let numero_tramos = formData.atributos[0].alturaTotal / 2;
            if (formData.atributos[0].alturaTotal % 2 !== 0) {
              numero_tramos = numero_tramos + 0.5;
            }
            console.log("Número de tramos calculado:", numero_tramos);
            atributos_para_calcular_transporte.numero_tramos = numero_tramos;
            break;
          case 4:
            break;
          case 5: // Puntales
            atributos_para_calcular_transporte.tipo_puntal = formData.atributos[0].tipoPuntal;
            break;
          default:
            console.warn("⚠️ Uso no soportado para transporte:", formData.uso_id);
            return;
        }
        console.log("🚚 Atributos para calcular transporte:", atributos_para_calcular_transporte);
        const respuesta = await calcularCostoTransporte(atributos_para_calcular_transporte);
        console.log("respuesta de la API TRANSPORTE:", respuesta)
        const costo = respuesta?.costosTransporte || 0;

        setFormData((prev) => ({
          ...prev,
          costo_tarifas_transporte: costo.costo_tarifas_transporte || 0,
          costo_distrito_transporte: costo.costo_distrito_transporte || 0,
          costo_pernocte_transporte: costo.costo_pernocte_transporte || 0,
          tipo_transporte: formData.tipo_transporte || "Desconocido",

        }));

      } catch (err) {
        console.error("❌ Error calculando transporte:", err.message);
        console.error("❌ Error crudo de transporte:", err.response?.data || err.message);
      }
    };

    calcularTransporte();
  }, [formData.tipo_transporte]);
  console.log("🚀 FormData en PasoConfirmacion:", formData);

  const resumen = formData.resumenDespiece;
  const tipo = formData.tipo_cotizacion;

  if (!formData.despiece.length || !resumen) return <Loader texto="Generando despiece..." />;

  const subtotal = parseFloat(
    tipo === "Alquiler"
      ? resumen.precio_subtotal_alquiler_soles
      : resumen.precio_subtotal_venta_soles
  );

  const descuento = formData.descuento || 0;
  const totalConDescuento = (subtotal * (1 - descuento / 100)).toFixed(2);

  const handleDescuento = (valor) => {
    const num = parseFloat(valor) || 0;
    const requiereAprobacion = num > 10;
    setFormData((prev) => ({
      ...prev,
      descuento: num,
      requiereAprobacion,
    }));
  };
 
  const usosInstalables = [
    "ANDAMIO DE TRABAJO",
    "ANDAMIO DE FACHADA",
    "ESCUADRAS",
    "ESCALERAS DE ACCESO",
    "ELEVADOR DE CARGA",
    "ANDAMIOS ELECTRICOS COLGANTES"
  ];

  const usoNombre = formData.uso_nombre || "";
  const esInstalable = usosInstalables.includes(usoNombre);
 

  return (
    <div className="paso-formulario">
      <h3>Paso 5: Confirmación Final</h3>

      <h4 style={{ color: "#004aad", marginBottom: "1rem" }}>Resumen del Despiece:</h4>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
        <thead>
          <tr style={{ background: "#f3f6f9", color: "#333" }}>
            <th style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>#</th>
            <th style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Descripción</th>
            <th style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Cantidad</th>
            <th style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Precio Unitario (S/)</th>
            <th style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Subtotal (S/)</th>
          </tr>
        </thead>
        <tbody>
          {formData.despiece.map((pieza, i) => {
            const precioUnitario =
              tipo === "Alquiler" ? pieza.precio_u_alquiler_soles : pieza.precio_u_venta_soles;
            const precioTotal =
              tipo === "Alquiler" ? pieza.precio_alquiler_soles : pieza.precio_venta_soles;
            return (
              <tr key={pieza.pieza_id}>
                <td style={{ padding: "0.4rem", borderBottom: "1px solid #eee" }}>{i + 1}</td>
                <td style={{ padding: "0.4rem", borderBottom: "1px solid #eee" }}>{pieza.descripcion}</td>
                <td style={{ padding: "0.4rem", textAlign: "center" }}>{pieza.total}</td>
                <td style={{ padding: "0.4rem", textAlign: "right" }}>{precioUnitario}</td>
                <td style={{ padding: "0.4rem", textAlign: "right" }}>{precioTotal}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="wizard-section" style={{ marginTop: "2rem" }}>
        <div className="wizard-key-value"><strong>🧱 Total de piezas:</strong> {resumen.total_piezas}</div>
        <div className="wizard-key-value"><strong>⚖️ Peso total (kg):</strong> {resumen.peso_total_kg}</div>
        <div className="wizard-key-value"><strong>🚚 Peso total (ton):</strong> {resumen.peso_total_ton}</div>
        {/* <div className="wizard-key-value"><strong>💵 Subtotal venta (USD):</strong> ${resumen.precio_subtotal_venta_dolares}</div> */}
        <div className="wizard-key-value"><strong>💰 Subtotal venta (S/):</strong> S/ {resumen.precio_subtotal_venta_soles}</div>
        <div className="wizard-key-value"><strong>🛠️ Subtotal alquiler (S/):</strong> S/ {resumen.precio_subtotal_alquiler_soles}</div>
      </div>
      
      {formData.tiene_pernos_disponibles && (
        <div className="wizard-section">
          <label>¿Desea incluir a la cotización los PERNOS DE EXPANSIÓN?</label>
          <select
            value={formData.tiene_pernos ? "TRUE" : "FALSE"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tiene_pernos: e.target.value === "TRUE",
              }))
            }
          >
            <option value="FALSE">No</option>
            <option value="TRUE">Sí</option>
          </select>
        </div>
      )}


      <div className="wizard-section">
        <label>¿Requiere servicio de transporte para el siguiente distrito?</label>
        <p style={{ fontSize: "0.85rem", color: "#666" }}>
          📍 Distrito detectado: {extraerDistrito(formData.obra_direccion)}
        </p>

        <select
          value={formData.tiene_transporte ? "TRUE" : "FALSE"}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              tiene_transporte: e.target.value === "TRUE",
              costo_transporte: 0
            }))
          }
        >
          <option value="FALSE">No</option>
          <option value="TRUE">Sí</option>
        </select>
      </div>

      {formData.tiene_transporte && (
        <div className="wizard-section">

          {/* <div style={{ marginTop: "1rem" }}>
            <label>🛻 Tipo de transporte</label>
            <input
              type="select"
              value={formData.tipo_transporte || "Desconocido"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tipo_transporte: e.target.value,
                }))
              }
            />
          </div> */}

          <div style={{ marginTop: "1rem" }}>
          <label>🛻 Tipo de transporte</label>
          <select
            value={formData.tipo_transporte || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tipo_transporte: e.target.value,
              }))
            }
          >
            <option value="">Seleccionar tipo de transporte</option>
            <option value="Camión">Camión</option>
            <option value="Camioneta">Camioneta</option>
            <option value="Semi camión">Semi camión</option>
          </select>
        </div>


          <div style={{ marginTop: "1rem" }}>
            <label>💸 Precio de envío/devolución (S/)</label>
            <input
              type="text"
              min="0"
              value={formData.costo_tarifas_transporte || 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  costo_tarifas_transporte: parseFloat(e.target.value),
                }))
              }
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label>💸 Precio en base al distrito (S/)</label>
            <input
              type="text"
              min="0"
              value={formData.costo_distrito_transporte || 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  costo_distrito_transporte: parseFloat(e.target.value),
                }))
              }
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label>💸 Precio del pernocte (S/)</label>
            <input
              type="text"
              min="0"
              value={formData.costo_pernocte_transporte || 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  costo_pernocte_transporte: parseFloat(e.target.value),
                }))
              }
            />
          </div>
          
          <div style={{ marginTop: "1rem" }}>
            <strong>🚛 Costo Transporte:</strong> S/ {
              (Number(formData.costo_tarifas_transporte || 0) +
              Number(formData.costo_distrito_transporte || 0) +
              Number(formData.costo_pernocte_transporte || 0)).toFixed(2)
            }
          </div>
        </div>
      )}

      {esInstalable && (
      <div className="wizard-section">
        <label>¿Desea incluir el servicio de instalación?</label>
        <select
          value={formData.tipo_instalacion || "NINGUNA"}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              tipo_instalacion: e.target.value,
            }))
          }
        >
          <option value="NINGUNA">No incluir</option>
          <option value="COMPLETA">Instalación completa</option>
          <option value="PARCIAL">Instalación parcial</option>
        </select>

        {formData.tipo_instalacion === "COMPLETA" && (
          <div style={{ marginTop: "1rem" }}>
            <label>💸 Precio de instalación completa (S/)</label>
            <input
              type="number"
              min="0"
              value={formData.precio_instalacion_completa || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tiene_instalacion: true,
                  precio_instalacion_completa: parseFloat(e.target.value),
                  precio_instalacion_parcial: null,
                  nota_instalacion: "",
                }))
              }
            />
          </div>
        )}

        {formData.tipo_instalacion === "PARCIAL" && (
          <div style={{ marginTop: "1rem" }}>
            <label>💰 Precio de instalación completa (S/)</label>
            <input
              type="number"
              min="0"
              value={formData.precio_instalacion_completa || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tiene_instalacion: true,
                  precio_instalacion_completa: parseFloat(e.target.value),
                }))
              }
            />

            <label style={{ marginTop: "1rem", display: "block" }}>💵 Precio de instalación parcial (S/)</label>
            <input
              type="number"
              min="0"
              value={formData.precio_instalacion_parcial || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  precio_instalacion_parcial: parseFloat(e.target.value),
                }))
              }
            />

            <label style={{ marginTop: "1rem", display: "block" }}>📝 Nota sobre instalación parcial</label>
            <textarea
              rows="3"
              placeholder="Ej: El precio de la instalación parcial es hasta 3 cuerpos de andamio."
              value={formData.nota_instalacion || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nota_instalacion: e.target.value,
                }))
              }
            />
          </div>
        )}
      </div>
    )}



      <div className="bloque-descuento">
        <label>🎯 Descuento (%):</label>
        <input
          type="text"
          value={formData.descuento || ""}
          onChange={(e) => handleDescuento(e.target.value)}
          placeholder="Ej: 5"
          min="0"
          max="100"
        />
        {formData.requiereAprobacion && (
          <p className="warning-text">
            ⚠️ Recuerde informar a Gerencia sobre éste descuento.
          </p>
        )}

        <p className="total-final">
          💰 Total final:
          <span>S/ {totalConDescuento}</span>
        </p>
      </div>
    </div>
  );
}