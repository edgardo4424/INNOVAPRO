// INNOVA PRO+ v1.2.0 — Contratos: Paso 4 (Firmas)
import { useWizardContratoContext } from "../../context/WizardContratoContext";

export default function PasoFirmas() {
  const { formData, setFormData } = useWizardContratoContext();
  const firmas = formData.firmas || {};
  const emisor = firmas.firmante_emisor || { nombre: "", cargo: "", documento: "" };
  const receptor = firmas.firmante_receptor || { nombre: "", cargo: "", documento: "" };

  const onChange = (path, value) => {
    setFormData((prev) => {
      const next = structuredClone(prev);
      const seg = path.split(".");
      let ref = next;
      for (let i = 0; i < seg.length - 1; i++) ref = ref[seg[i]];
      ref[seg.at(-1)] = value;
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border p-4">
        <h3 className="font-semibold">Firmante Emisor (Filial)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Nombre"
            value={emisor.nombre}
            onChange={(e) => onChange("firmas.firmante_emisor.nombre", e.target.value)}
          />
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Cargo"
            value={emisor.cargo}
            onChange={(e) => onChange("firmas.firmante_emisor.cargo", e.target.value)}
          />
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Documento"
            value={emisor.documento}
            onChange={(e) => onChange("firmas.firmante_emisor.documento", e.target.value)}
          />
        </div>
      </section>

      <section className="rounded-xl border p-4">
        <h3 className="font-semibold">Firmante Receptor (Cliente)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Nombre"
            value={receptor.nombre}
            onChange={(e) => onChange("firmas.firmante_receptor.nombre", e.target.value)}
          />
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Cargo"
            value={receptor.cargo}
            onChange={(e) => onChange("firmas.firmante_receptor.cargo", e.target.value)}
          />
          <input
            className="rounded-lg border px-3 py-2"
            placeholder="Documento"
            value={receptor.documento}
            onChange={(e) => onChange("firmas.firmante_receptor.documento", e.target.value)}
          />
        </div>
      </section>
    </div>
  );
}