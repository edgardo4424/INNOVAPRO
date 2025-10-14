import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Trash } from "lucide-react";
import { useState } from "react";

const VehiculoForm = ({
  vehiculo,
  index,
  handleChange,
  handleDelete,
  handleBuscar,
}) => {
  const [open, setOpen] = useState(false);

  const handleClickDelete = () => {
    if (!vehiculo?.id) {
      handleDelete(index);
    } else {
      setOpen(true);
    }
  };

  const confirmDelete = async () => {
    handleDelete(index); // quita de la lista local
    setOpen(false);
  };

  return (
    <div className="relative rounded-xl bg-gray-100 px-3 py-3">
      {/* Botón de eliminar */}
      <button
        type="button"
        onClick={handleClickDelete}
        className="absolute top-2 right-3 cursor-pointer text-gray-500 hover:text-red-600"
      >
        <Trash />
      </button>

      {/* Modal de confirmación SOLO si el vehiculo tiene id */}
      {vehiculo?.id && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Eliminar vehículo?</DialogTitle>
              <DialogDescription>
                Esta acción eliminará el vehículo de forma permanente. ¿Estás
                seguro de continuar?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Contenedor principal con grid para disposición de campos */}
      <div className="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-4">
        {/* //* Campo: Nro Placa */}
        <div>
          <Label htmlFor={`nro_placa_${index}`}>Nro Placa</Label>
          <div className="flex gap-x-2">
            <Input
              id={`nro_placa_${index}`}
              maxLength={6}
              placeholder="Ej: A1B234"
              type="string"
              value={vehiculo?.nro_placa || ""}
              onChange={(e) => handleChange(index, "nro_placa", e.target.value)}
              className="bg-white"
            />
            <button
              type="button"
              onClick={(e) => handleBuscar(e, vehiculo.nro_placa, index)}
              className="bg-innova-blue hover:bg-innova-blue-hover focus:ring-innova-blue cursor-pointer rounded-md p-2 text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* //* Campo: Marca */}
        <div>
          <Label htmlFor={`marca_${index}`}>Marca</Label>
          <Input
            id={`marca_${index}`}
            placeholder="Ej: Volvo"
            type="string"
            value={vehiculo?.marca || ""}
            onChange={(e) => handleChange(index, "marca", e.target.value)}
            className="bg-white"
          />
        </div>

        {/* //* Campo: Color */}
        <div>
          <Label htmlFor={`color_${index}`}>Color</Label>
          <Input
            id={`color_${index}`}
            placeholder="Ej: Rojo"
            type="string"
            value={vehiculo?.color || ""}
            onChange={(e) => handleChange(index, "color", e.target.value)}
            className="bg-white"
          />
        </div>

        {/* //* Campo: Certificado Vehicular */}
        <div>
          <Label htmlFor={`tuce_certificado_${index}`}>
            Certificado o tuce
          </Label>
          <Input
            id={`tuce_certificado_${index}`}
            type="string"
            value={vehiculo?.tuce_certificado || ""}
            onChange={(e) =>
              handleChange(index, "tuce_certificado", e.target.value)
            }
            placeholder="Ej: C-2024-167-433-001368"
            className="bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default VehiculoForm;
