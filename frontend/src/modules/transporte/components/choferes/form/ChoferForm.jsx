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

const ChoferForm = () => {
  return (
    <div className="">
      {/* Contenedor principal con grid para disposición de campos */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
        {/* //* Campo: Tipo Documento (Select) */}
        <div className="space-y-2">
          <Label htmlFor="tipo_documento">Tipo Documento</Label>
          <Select required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">DNI</SelectItem>
              <SelectItem value="7">Carnet de Extranjería (CE)</SelectItem>
              <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

        {/* //* Campo: Nombres */}
        <div className="space-y-2">
          <Label htmlFor="nombres">Nombres</Label>
          <Input id="nombres" placeholder="Ej: LEONEL" required />
        </div>

        {/* //* Campo: Apellidos */}
        <div className="space-y-2">
          <Label htmlFor="apellidos">Apellidos</Label>
          <Input id="apellidos" placeholder="Ej:  CUCCITINI" required />
        </div>

        {/* //* Campo: Nro. Licencia */}
        <div className="space-y-2">
          <Label htmlFor="nro_licencia">Nro. Licencia</Label>
          <Input id="nro_licencia" placeholder="Ej: L-22334455" required />
        </div>

        {/* Campo de espacio vacío para mantener el layout de 3 columnas */}
        <div className="hidden md:block"></div>
      </div>

      {/* Botón de envío */}
      <div className="mt-6 flex justify-end">
        <Button type="submit">Guardar Chofer</Button>
      </div>
    </div>
  );
};

export default ChoferForm;
