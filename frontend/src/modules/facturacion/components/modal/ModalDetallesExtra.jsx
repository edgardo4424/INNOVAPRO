import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";
import { ListPlus, X, Trash2 } from "lucide-react";
import { useState } from "react";

// Lista de opciones predefinidas para el detalle
const OPCIONES_DETALLE = [
  "DIRECCION DEL ORIGEN",
  "DIRECCION DEL DESTINO",
  "DESCRIPCION DEL SERVICIO O PRODUCTO",
  "PROYECTO",
  "CONTRATO",
  "VALORIZACION",
  "NIVEL DE RIESGO",
  "TIPO DE EQUIPO",
  "MARCA Y MODELO",
  "COTIZACION",
  "FECHA DE FABRICACION",
  "FECHA DE ENTREGA",
];

export default function ModalDetalleExtra({ open, setOpen }) {
  const { detallesExtra, setDetallesExtra } = useFacturaBoleta();
  const [showError, setShowError] = useState(false); // Nuevo estado para controlar el mensaje de error

  const closeModal = () => {
    setOpen(false);
  };

  const addDetalle = () => {
    setDetallesExtra([...detallesExtra, { detalle: "", valor: "" }]);
    setShowError(false); // Ocultar el error al agregar un nuevo campo
  };

  const removeDetalle = (index) => {
    const nuevaLista = detallesExtra.filter((_, i) => i !== index);
    setDetallesExtra(nuevaLista);
    setShowError(false); // Ocultar el error al eliminar un campo
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const nuevaLista = detallesExtra.map((item, i) =>
      i === index ? { ...item, [name]: value.toUpperCase() } : item,
    );
    setDetallesExtra(nuevaLista);
    setShowError(false); // Ocultar el error al editar un campo
  };

  const handleSelectChange = (value, index) => {
    const nuevaLista = detallesExtra.map((item, i) =>
      i === index ? { ...item, detalle: value } : item,
    );
    setDetallesExtra(nuevaLista);
    setShowError(false); // Ocultar el error al cambiar la opción del select
  };

  const saveChanges = () => {
    // Filtrar los detalles incompletos antes de guardar
    const detallesCompletos = detallesExtra.filter(
      (item) => item.detalle.trim() !== "" && item.valor.trim() !== "",
    );

    // Opcional: mostrar un mensaje de error si hay campos vacíos
    const hayCamposVacios = detallesExtra.some(
      (item) => item.detalle.trim() === "" || item.valor.trim() === "",
    );

    if (hayCamposVacios) {
      setShowError(true);
      return; // No continuar con el guardado si hay campos vacíos
    }

    setDetallesExtra(detallesCompletos);
    closeModal();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-innova-orange hover:bg-innova-orange cursor-pointer hover:scale-105">
          <ListPlus />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="flex flex-col gap-4 p-6 md:min-w-3xl">
        <button
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-600"
          onClick={saveChanges}
          aria-label="Cerrar"
        >
          <X />
        </button>
        <AlertDialogHeader>
          <AlertDialogTitle>Datos Extra</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Detalla más campos específicos para tu factura.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {showError && (
          <div className="text-sm font-medium text-red-600">
            ⚠ Por favor, completa todos los campos o elimínalos para guardar.
          </div>
        )}

        <div className="flex max-h-96 flex-col gap-4 overflow-y-auto pr-2">
          {detallesExtra.map((detalle, i) => (
            <div key={i} className="grid grid-cols-7 items-end gap-4 py-2">
              <div className="col-span-full flex flex-col gap-1 sm:col-span-3">
                <Label htmlFor={`detalle-${i}`}>Nombre</Label>
                <div className="flex gap-2">
                  {/* Input para escribir libremente */}
                  <Input
                    id={`detalle-${i}`}
                    type="text"
                    name="detalle"
                    placeholder="Nombre del campo"
                    value={detalle.detalle}
                    onChange={(e) => handleInputChange(e, i)}
                    className="flex-1"
                  />

                  {/* Select para opciones predefinidas */}
                  <Select
                    onValueChange={(value) => handleSelectChange(value, i)}
                  >
                    <SelectTrigger className="w-10 shrink-0 rounded-md border border-gray-300 shadow-sm"></SelectTrigger>

                    <SelectContent>
                      {OPCIONES_DETALLE.map((opcion, index) => (
                        <SelectItem key={index} value={opcion}>
                          {opcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="col-span-5 flex flex-col gap-2 md:col-span-3">
                <Label htmlFor={`valor-${i}`}>Valor</Label>
                <Input
                  id={`valor-${i}`}
                  type="text"
                  name="valor"
                  placeholder="Valor del campo"
                  value={detalle.valor}
                  onChange={(e) => handleInputChange(e, i)}
                />
              </div>
              <Button
                className="h-10 w-10 cursor-pointer border-2 bg-red-600 p-0 text-white hover:scale-105 hover:bg-red-600 hover:text-white"
                onClick={() => removeDetalle(i)}
                aria-label="Eliminar detalle"
              >
                <Trash2 className="size-6" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-x-4">
          <Button
            className="bg-innova-orange hover:bg-innova-orange mt-2 cursor-pointer hover:scale-105"
            onClick={addDetalle}
          >
            <ListPlus className="mr-2" /> Agregar Campo
          </Button>
          <Button
            className="bg-innova-blue hover:bg-innova-blue mt-2 cursor-pointer hover:scale-105 hover:saturate-105"
            onClick={saveChanges}
          >
            Guardar
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
