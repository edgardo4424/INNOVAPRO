import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const OPCIONES_CONDICIONES = [
  "Pago adelantado",
  "Contrato firmado",
  "Letra",
  "Cheque",
  "Efectivo",
];

export default function ResponderCondicionModal({ condicion, onGuardar }) {
  const [open, setOpen] = useState(false);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [nota, setNota] = useState("");

  const toggleSeleccion = (condicion) => {
    setSeleccionadas((prev) =>
      prev.includes(condicion)
        ? prev.filter((c) => c !== condicion)
        : [...prev, condicion]
    );
  };
  console.log("CONDICION A ENVIAR: ", condicion)

  const handleGuardar = () => {
    if (seleccionadas.length === 0) return;

    const mensaje = `CONDICIONES AUTORIZADAS:\n\n${seleccionadas
      .map((c) => "• " + c)
      .join("\n")}${nota.trim() ? `\n\n OBSERVACIÓN:\n${nota}` : ""}`;

    onGuardar(condicion.contrato_id, mensaje);
    setOpen(false);
    setSeleccionadas([]);
    setNota("");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">Responder</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Responder condiciones</AlertDialogTitle>
          <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
            Por favor selecciona las condiciones que el cliente deberá cumplir antes de generar el pase de pedido. Puedes agregar una nota adicional si lo consideras necesario.
          </p>
        </AlertDialogHeader>

        <div className="flex flex-col gap-0">
          {OPCIONES_CONDICIONES.map((cond, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Checkbox
                id={`cond-${i}`}
                checked={seleccionadas.includes(cond)}
                onCheckedChange={() => toggleSeleccion(cond)}
              />
              <Label htmlFor={`cond-${i}`} className="text-sm font-medium">
                {cond}
              </Label>
            </div>
          ))}

          <Textarea
            placeholder="Ej: Cliente debe firmar contrato físico en oficina..."
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            rows={3}
            className="mt-4"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleGuardar} disabled={seleccionadas.length === 0}>
            Guardar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}