import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useCondicionesComercial from "../../contratos/hooks/useCondicionesComercial";
import { Checkbox } from "@/components/ui/checkbox";

export default function CondicionesCard({ cotizacionId, onCumplidas, onClose, onActualizarCotizaciones}) {
  const {
    loading,
    condicion,
    cumplidas,
    toggleCondicion,
    guardar,
  } = useCondicionesComercial(cotizacionId);

  if (loading) return <p className="text-sm text-muted">Cargando condiciones...</p>;
  if (!condicion || !condicion.condiciones) return null;
  
  const condicionesRaw = condicion.condiciones.split("CONDICIONES AUTORIZADAS:")[1] || "";

  const lineas = condicionesRaw.split("•").map((c) => c.trim()).filter(Boolean);

  let definidas = [];
  let observacion = null;

  lineas.forEach((linea) => {
    if (/OBSERVACIÓN:/i.test(linea)) {
      const partes = linea.split(/OBSERVACIÓN:/i);
      if (partes[0].trim()) definidas.push(partes[0].trim()); // parte de la condición
      observacion = partes[1].trim(); // parte de la observación
    } else {
      definidas.push(linea);
    }
  });

  const todasCumplidas = definidas.every((c) => cumplidas.includes(c));

  return (
    <Card className="mt-0 border rounded-2xl shadow-sm bg-white">
      <CardContent className="space-y-8 p-8">
        <p className="text-sm text-muted-foreground">
            Valida las condiciones de alquiler que el cliente ya ha cumplido. 
            Puede ser parcial o totalmente. Recuerda guardar los cambios para que se reflejen en la cotización.
        </p>
        
        {observacion && (
          <div className="px-3 py-1 bg-yellow-50 text-yellow-800 rounded-md border text-sm">
            <strong>📝 Observación:</strong> {observacion}
          </div>
        )}

        <div className="space-y-1">
          {definidas.map((cond, i) => (
            <div key={i} className="flex items-center gap-2">
              <Checkbox
                checked={cumplidas.includes(cond)}
                onCheckedChange={() => toggleCondicion(cond)}
              />
              <span className="text-sm">{cond}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={async () => {
            const exito = await guardar();
            if (exito && onActualizarCotizaciones) {
              onActualizarCotizaciones(); // Para actualizar la lista de cotizaciones
              onClose?.(); // Cierra el modal automáticamente
            }
          }}
          disabled={!cumplidas.length}
          className="mt-0 w-full"
        >
          Guardar condiciones cumplidas
        </Button>


        {todasCumplidas && (
          <div className="mt-0 px-3 py-1 bg-green-50 text-green-800 rounded-md border text-sm font-medium">
            Todas las condiciones han sido cumplidas. Puedes generar el pase de pedido.
          </div>
        )}
      </CardContent>
    </Card>
  );
}