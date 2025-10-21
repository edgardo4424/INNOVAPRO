import { Tooltip } from "../../utils/helpers";
import { usePasoFirmas } from "../../hooks/paso-firmas/usePasoFirmas";

export default function PasoFirmas() {
  const {
    usarDefault,
    emisor,
    receptor,
    setPath,
    cargarSugeridos,
    toggleUsarDefault
  } = usePasoFirmas();

  return (
    <div className="space-y-6">
      {/* Bloque: cómo se imprimen las firmas en PDF */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <header className="mb-4 flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Instrucciones de firma</h3>
          <Tooltip
            side="right"
            label={
              <span>
                Estos datos <strong>solo se imprimen</strong> en el PDF (bloque de firmas). La firma será manual una vez
                generado el documento.
              </span>
            }
          >
            <span className="h-5 w-5 cursor-help select-none rounded-full border border-gray-300 text-gray-500 text-center text-xs leading-5">
              i
            </span>
          </Tooltip>
        </header>

        {/* Mostrar bloque y defaults */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            {/* DEJARÉ ESTE LABEL PARA MOSTRAR EL DE ABAJO A LA DERECHA */}
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <input
              type="checkbox"
              className="h-4 w-4 accent-emerald-600"
              checked={usarDefault}
              onChange={(e) => toggleUsarDefault(e.target.checked)}
            />
            <span className="text-sm text-gray-800">
              Usar firmantes sugeridos (desde filial/cliente)
            </span>
            <button
              type="button"
              onClick={cargarSugeridos}
              className="ml-auto text-xs rounded-md border px-2 py-1 hover:bg-gray-100"
            >
              Cargar ahora
            </button>
          </label>
        </div>

        {/* Emisor / Receptor */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Emisor */}
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="font-medium text-gray-900">Firmante Emisor (Filial)</h4>
              <Tooltip side="right" label="Persona que firma por ENCOFRADOS INNOVA (o la filial seleccionada).">
                <span className="h-5 w-5 cursor-help select-none rounded-full border border-gray-300 text-gray-500 text-center text-xs leading-5">
                  i
                </span>
              </Tooltip>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <input
                className="rounded-lg border px-3 py-2 text-sm"
                placeholder="Nombre"
                value={emisor.nombre}
                onChange={(e) => setPath("firmas.firmante_emisor.nombre", e.target.value)}
              />
              <input
                className="rounded-lg border px-3 py-2 text-sm"
                placeholder="Cargo"
                value={emisor.cargo}
                onChange={(e) => setPath("firmas.firmante_emisor.cargo", e.target.value)}
              />
              <input
                className="rounded-lg border px-3 py-2 text-sm"
                placeholder="Documento (DNI/RUC)"
                value={emisor.documento}
                onChange={(e) => setPath("firmas.firmante_emisor.documento", e.target.value)}
              />
            </div>
          </div>

          {/* Receptor */}
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="font-medium text-gray-900">Firmante Receptor (Cliente)</h4>
              <Tooltip side="right" label="Persona que firma por el Cliente. Aparecerá impreso en el área de firma.">
                <span className="h-5 w-5 cursor-help select-none rounded-full border border-gray-300 text-gray-500 text-center text-xs leading-5">
                  i
                </span>
              </Tooltip>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <input
                className="rounded-lg border px-3 py-2 text-sm"
                placeholder="Nombre"
                value={receptor.nombre}
                onChange={(e) => setPath("firmas.firmante_receptor.nombre", e.target.value)}
              />
              <input
                className="rounded-lg border px-3 py-2 text-sm"
                placeholder="Cargo"
                value={receptor.cargo}
                onChange={(e) => setPath("firmas.firmante_receptor.cargo", e.target.value)}
              />
              <input
                className="rounded-lg border px-3 py-2 text-sm"
                placeholder="Documento (DNI/RUC)"
                value={receptor.documento}
                onChange={(e) => setPath("firmas.firmante_receptor.documento", e.target.value)}
              />
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}