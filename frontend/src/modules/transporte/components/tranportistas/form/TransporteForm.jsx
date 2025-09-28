import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VehiculoForm from "../../vehiculos/form/VehiculoForm";

const TransporteForm = () => {
  return (
    <div className="">
      {/* Contenedor principal con grid para disposición de campos */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
        {/* //* Campo: Nro. Documento */}
        <div className="space-y-2">
          <Label htmlFor="nro_documento">Nro. Documento</Label>
          <Input
            id="nro_documento"
            placeholder="Ej: 282930313"
            type="string"
            required
          />
        </div>

        {/* //* Campo: Razon social */}
        <div className="space-y-2">
          <Label htmlFor="nombres">Razon Social</Label>
          <Input id="nombres" placeholder="Ej: Transporte S.A" required />
        </div>

        {/* //* Campo: Nro. Mtc */}
        <div className="space-y-2">
          <Label htmlFor="nro_licencia">Nro. Mtc</Label>
          <Input id="nro_licencia" placeholder="Ej: 15161734CNG " required />
        </div>

        {/* Campo de espacio vacío para mantener el layout de 3 columnas */}
        <div className="hidden md:block"></div>
      </div>

      {/* //? Vehiculos */}
      <div className="p-3 border-2">
      <VehiculoForm />
      </div>

      {/* Botón de envío */}
      <div className="mt-6 flex justify-end">
        <Button type="submit">Guardar Transporte</Button>
      </div>
    </div>
  );
};

export default TransporteForm;
