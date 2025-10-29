import { useEscaleraAcceso } from "../../../hooks/paso-confirmacion/useEscaleraAcceso";

// Este componente maneja el detalle técnico de las escaleras de acceso en alquiler
// Su propósito es permitir que el comercial indique cuántos tramos de escalera de 2m y 1m necesita, 
// y que el sistema verifique automáticamente que la suma de estos tramos coincida con la altura total requerida. 
// Aquí es donde se asegura que el número de módulos de escalera coincida con lo que se necesita montar en obra, 
// y donde también se define el precio unitario por cada tramo, lo que influye directamente en el cálculo final del costo.

export default function BloqueEscaleraAcceso({ formData, setFormData }) {
  const {
    detalles_escaleras,
    alturaFija,
    precioTramo,
    tramos_2m,
    tramos_1m,
    subtotal,
    inconsistencias,
    actualizarCambioEnTramo,
    actualizarTramo,
  } = useEscaleraAcceso(formData, setFormData);

  if (!detalles_escaleras) return null;

  const fmt = new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  // usar:  fmt.format(subtotal)

  return (
    <div className="wizard-section">
      <h4 className="text-blue-700 font-semibold text-[15px] md:text-base flex items-center gap-2 mb-3">
        🪜 Escalera de Acceso — Detalle por Zonas y Equipos
      </h4>

      <div style={{ marginBottom: "1rem", fontSize: "14px", color: "#444" }}>
        Este bloque te permite ajustar el <strong>precio por tramo</strong> de alquiler de la escalera.
        La <strong>altura total general</strong> se calcula automáticamente alturaTotal partir de los atributos ingresados (incluyendo todas las zonas).
        <br />
        Para que el cálculo sea válido, la suma de tramos de 2m y 1m debe coincidir con la altura total.
      </div>

      {/* Tarjetas compactas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        {/* Precio por tramo */}
        <div className="rounded-xl border bg-white shadow-sm p-3 flex flex-col justify-between h-24">
          <span className="text-[11px] text-center text-gray-500 mb-1">Precio por tramo (S/)</span>
          <div className="relative">
            <span className="absolute left-2 top-1.5 text-xs text-gray-500">S/</span>
            <input
              type="number"
              step="0.01"
              min={0}
              placeholder="0.00"
              onWheel={(e) => e.currentTarget.blur()}
              className="w-full pl-6 pr-2 py-1.5 text-sm text-center font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={detalles_escaleras.precio_tramo ?? ""}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  uso: {
                    ...prev.uso,
                    detalles_escaleras: {
                      ...prev.uso.detalles_escaleras,
                      precio_tramo: parseFloat(e.target.value) || 0,
                    },
                  },
                }))
              }
            />
          </div>
          <span className="text-[10px] text-center text-gray-400 mt-1">Se aplica a todos los equipos</span>
        </div>

        {/* Altura total general */}
        <div className="rounded-xl border bg-white shadow-sm p-3 flex flex-col justify-between h-24">
          <span className="text-[11px] text-center text-gray-500">Altura total general (m)</span>
          <div className="text-center">
            <span className="text-xl font-bold leading-tight">{alturaFija}</span>
          </div>
          <span className="text-[10px] text-center text-gray-400">Valor fijo desde backend</span>
        </div>

        {/* Tramos totales */}
        <div className="rounded-xl border bg-white shadow-sm p-3 flex flex-col justify-between h-24">
          <span className="text-[11px] text-center text-gray-500">Tramos totales</span>
          <div className="text-center">
            <span className="text-sm font-semibold">{tramos_2m}×2m + {tramos_1m}×1m = {tramos_2m+tramos_1m}</span>
          </div>
          <span className="text-[10px] text-center text-gray-400">Suma de todos los equipos</span>
        </div>

        {/* Subtotal general */}
        <div className="rounded-xl border bg-white shadow-sm p-3 flex flex-col justify-between h-24">
          <span className="text-[11px] text-center text-gray-500">Subtotal general</span>
          <div className="text-center">
            <span className="text-lg font-bold">S/ {subtotal.toFixed(2)}</span>
          </div>
          <span className="text-[10px] text-center text-gray-400">Antes de IGV y descuentos</span>
        </div>
      </div>


      {/* Alerta compacta si hay inconsistencias */}
      {inconsistencias.length > 0 && (
        <div className="mb-3 text-[12px] px-3 py-2 rounded-lg border border-red-300 bg-red-50 text-red-700">
          Hay equipos con altura que no coinciden. Ajusta los tramos hasta igualar su altura.
        </div>
      )}

      {/* Tabla por zona — UI mejorada */}
      {(detalles_escaleras.escaleras || []).map((zona, zonaIndex) => {
        const totalesZona = (zona.equipos || []).reduce(
          (acc, e) => {
            const totalesTramos_2m = Number(e.tramos_2m || 0);
            const totalesTramos_1m = Number(e.tramos_1m || 0);
            const numeroTotalTramos  = totalesTramos_2m + totalesTramos_1m;
            const sub_total  = Number(e.precio_subtotal_alquiler_soles ?? (numeroTotalTramos * precioTramo));
            return { totalesTramos_2m: acc.totalesTramos_2m + totalesTramos_2m, totalesTramos_1m: acc.totalesTramos_1m + totalesTramos_1m, numeroTotalTramos: acc.numeroTotalTramos + numeroTotalTramos, sub_total: acc.sub_total + sub_total };
          }, { totalesTramos_2m:0, totalesTramos_1m:0, numeroTotalTramos:0, sub_total:0 }
        );

        return (
          <section key={zonaIndex} className="rounded-sm border shadow-sm mb-5 overflow-hidden">
            {/* Header zona */}
            <header className="px-4 py-2 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h5 className="font-semibold text-[13px]">Zona {zona.zona}</h5>
              </div>
              <div className="text-[11px] text-gray-500">
                Equipos: <span className="font-medium text-gray-700">{zona.equipos?.length || 0}</span>
              </div>
            </header>

            {/* Tabla */}
            <div className="overflow-x-auto p-2">
              <table className="w-full text-[12px] leading-tight border-separate border-spacing-0">
                <colgroup>
                  <col className="w-15" />
                  <col className="w-16" />
                  <col className="w-23" />
                  <col className="w-23" />
                  <col className="w-19" />
                  <col className="w-24" />
                  <col className="w-18" />
                </colgroup>

                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-100 text-gray-700 text-[11px] uppercase">
                    <th className="border-y border-l p-2 font-medium text-left"># Esc</th>
                    <th className="border-y p-2 font-medium text-center">Alt (m)</th>
                    <th className="border-y p-2 font-medium text-center">Tramos 2m</th>
                    <th className="border-y p-2 font-medium text-center">Tramos 1m</th>
                    <th className="border-y p-2 font-medium text-center"># Tramos</th>
                    <th className="border-y p-2 font-medium text-right">Subtotal (S/)</th>
                    <th className="border-y border-r p-2 font-medium text-center">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {zona.equipos.map((equipo, equipoIndex) => {
                    const totalesTramos_2m = Number(equipo.tramos_2m || 0);
                    const totalesTramos_1m = Number(equipo.tramos_1m || 0);
                    const numeroTotalTramos  = totalesTramos_2m + totalesTramos_1m;
                    const alturaTotalMetros = totalesTramos_2m * 2 + totalesTramos_1m;
                    const ok = alturaTotalMetros === Number(equipo.alturaTotal || 0);
                    const sub_total_equipo = Number(equipo.precio_subtotal_alquiler_soles ?? (numeroTotalTramos * precioTramo));

                    return (
                      <tr key={equipoIndex} className="hover:bg-gray-50">
                        <td className="border-y border-l p-2 text-left">{equipoIndex + 1}</td>
                        <td className="border-y p-2 text-center font-medium text-gray-800">{equipo.alturaTotal}</td>

                        <td className="border-y p-2 text-center">
                          <input
                            type="number"
                            min={0}
                            className="w-18 md:w-20 text-center border rounded-md px-1 py-1"
                            value={equipo.__tmp?.tramos_2m ?? (equipo.tramos_2m ?? "")}
                            onChange={(e) => actualizarCambioEnTramo(zonaIndex, equipoIndex, "tramos_2m", e.target.value)}
                            onBlur={() => actualizarTramo(zonaIndex, equipoIndex, "tramos_2m")}
                            onWheel={(e) => e.currentTarget.blur()}
                          />
                        </td>

                        <td className="border-y p-2 text-center">
                          <input
                            type="number"
                            min={0}
                            className="w-18 md:w-20 text-center border rounded-md px-1 py-1"
                            value={equipo.__tmp?.tramos_1m ?? (equipo.tramos_1m ?? "")}
                            onChange={(e) => actualizarCambioEnTramo(zonaIndex, equipoIndex, "tramos_1m", e.target.value)}
                            onBlur={() => actualizarTramo(zonaIndex, equipoIndex, "tramos_1m")}
                            onWheel={(e) => e.currentTarget.blur()}
                          />
                        </td>

                        <td className="border-y p-2 text-center font-medium">{numeroTotalTramos}</td>

                        <td className="border-y p-2 text-right font-semibold">
                          S/ {fmt.format(sub_total_equipo)}
                        </td>

                        <td className="border-y border-r p-2 text-center">
                          {ok ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[11px] font-semibold">OK</span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-[11px] font-semibold">
                              {alturaTotalMetros} ≠ {equipo.alturaTotal}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Footer por zona */}
                  <tr className="bg-gray-50 text-gray-700">
                    <td className="border-y border-l p-2 text-left text-[11px] uppercase font-medium" colSpan={2}>
                      Totales zona {zona.zona}
                    </td>
                    <td className="border-y p-2 text-center font-medium">{totalesZona.totalesTramos_2m}</td>
                    <td className="border-y p-2 text-center font-medium">{totalesZona.totalesTramos_1m}</td>
                    <td className="border-y p-2 text-center font-semibold">{totalesZona.numeroTotalTramos}</td>
                    <td className="border-y p-2 text-right font-bold">S/ {fmt.format(totalesZona.sub_total)}</td>
                    <td className="border-y border-r p-2" />
                  </tr>
                </tbody>
              </table>

              <p className="text-[11px] text-gray-500 mt-2">
                * La altura total general <strong>({alturaFija} m)</strong> es fija. Ajusta cada equipo hasta que <b>2m×tramos_2m + 1m×tramos_1m = altura</b>.
              </p>
            </div>
          </section>
        );
      })}
    </div>
  );
}