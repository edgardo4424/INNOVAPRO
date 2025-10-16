import { usePasoOrigenCotizacion } from "../../hooks/paso-origen-cotizacion/usePasoOrigenCotizacion";

export default function PasoOrigenCotizacion() {
  const {
    formData,
    query,
    setQuery,
    resultados,
    loading,
    seleccionarCotizacion,
    limpiarSeleccion,
  } = usePasoOrigenCotizacion();

  const data = formData?.cotizacion;
  console.log("data: ", data)
  // Si ya hay cotización seleccionada (o precargada)
  if (data?.id) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border p-4 bg-muted/40">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cotización base</p>
              <p className="text-lg font-semibold">
                {data.codigo_documento || data.id}
              </p>
            </div>
            <button
              type="button"
              onClick={limpiarSeleccion}
              className="rounded-lg border px-3 py-2 hover:bg-muted text-sm"
            >
              Cambiar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mt-3">
            <div>
              <p className="font-medium">Cliente</p>
              <p>{data?.entidad?.cliente?.razon_social || "—"}</p>
            </div>
            <div>
              <p className="font-medium">Obra</p>
              <p>{data?.entidad?.obra?.nombre || "—"}</p>
            </div>
            <div>
              <p className="font-medium">Filial</p>
              <p>{data?.entidad?.filial?.razon_social || "—"}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          La cotización seleccionada es la base para generar el contrato.  
          Puedes cambiarla si es necesario.
        </p>
      </div>
    );
  }

  // Si no hay cotización seleccionada, mostrar buscador
  return (
    <div className="space-y-4">
      <div className="rounded-xl border p-4">
        <label className="text-sm font-medium">Buscar cotización</label>
        <div className="mt-2 flex gap-2">
          <input
            className="w-full rounded-lg border px-3 py-2 outline-none"
            placeholder='Buscar por razón social, obra o número...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <p className="text-sm font-medium mb-2">Cotizaciones disponibles</p>
        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : resultados.length ? (
          <ul className="divide-y">
            {resultados.map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-semibold">
                    #{c.codigo_documento} · {c.cliente_razon_social}
                  </p>
                  <p className="text-muted-foreground">
                    {c.obra_nombre} · Total: S/ {c.total_soles}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => seleccionarCotizacion(c.id)}
                  className="rounded-lg border px-3 py-2 hover:bg-muted text-sm"
                >
                  Usar como base
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No hay cotizaciones con estado “Condiciones Cumplidas”.
          </p>
        )}
      </div>
    </div>
  );
}