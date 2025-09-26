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

// 1. Datos de ejemplo para el Select de Transportista (basados en tu estructura anterior)
const transportistas = [
  { id: 1, ruc: "20123456789", razon_social: "Transportes Rápidos S.A.C." },
  { id: 2, ruc: "20987654321", razon_social: "Logística Segura E.I.R.L." },
  { id: 3, ruc: "10112233445", razon_social: "Distribuidora Andina E.I.R.L." },
];

const VehiculoForm = () => {
  return (
    <div className="">
      {/* Contenedor principal con grid para disposición de campos */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
        {/* //* Campo: Nro Placa */}
        <div className="space-y-2">
          <Label htmlFor="nro_placa">Nro Placa</Label>
          <Input id="nro_placa" placeholder="Ej: A1B234" required />
        </div>

        {/* //* Campo: Marca */}
        <div className="space-y-2">
          <Label htmlFor="marca">Marca</Label>
          <Input id="marca" placeholder="Ej: Volvo" required />
        </div>

        {/* //* Campo: Modelo */}
        <div className="space-y-2">
          <Label htmlFor="modelo">Modelo</Label>
          <Input id="modelo" placeholder="Ej: FH 540" required />
        </div>

        {/* //* Campo: Color */}
        <div className="space-y-2">
          <Label htmlFor="modelo">Color</Label>
          <Input id="color" placeholder="Ej: FH 540" required />
        </div>

        {/* //* Campo: Capacidad  */}
        <div className="space-y-2">
          <Label htmlFor="capacidad">Capacidad</Label>
          <Input id="capacidad" type="number" placeholder="Ej: 30" required />
        </div>

        {/* //* Campo: Año */}
        <div className="space-y-2">
          <Label htmlFor="anio">Año</Label>
          <Input
            id="anio"
            type="string"
            maxLength={4}
            placeholder="Ej: 2022"
            required
          />
        </div>

        {/* //* Campo: Certificado Vehicular */}
        <div className="space-y-2">
          <Label htmlFor="certificado_vehicular">Certificado Vehicular</Label>
          <Input
            id="certificado_vehicular"
            placeholder="Ej: CV-987654"
            required
          />
        </div>

        {/* Campo: TRANSPORTISTA (SELECT) - Ocupa toda la fila en móvil, dos columnas en desktop */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="transportista">Transportista</Label>
          <Select required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un transportista" />
            </SelectTrigger>
            <SelectContent>
              {transportistas.map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>
                  {t.razon_social} ({t.ruc})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Botón de envío */}
      <div className="mt-6 flex justify-end">
        <Button type="submit">Guardar Vehículo</Button>
      </div>

      {/* </Form> */}
    </div>
  );
};

export default VehiculoForm;
