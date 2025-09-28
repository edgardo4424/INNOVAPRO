import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const VehiculoForm = () => {
  return (
    <div className="">
      {/* Contenedor principal con grid para disposición de campos */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-4">
        {/* //* Campo: Nro Placa */}
        <div className="">
          <Label htmlFor="nro_placa">Nro Placa</Label>
          <Input id="nro_placa" maxLength={6} placeholder="Ej: A1B234" required />
        </div>

        {/* //* Campo: Marca */}
        <div className="">
          <Label htmlFor="marca">Marca</Label>
          <Input id="marca" placeholder="Ej: Volvo" required />
        </div>

        {/* //* Campo: Color */}
        <div className="">
          <Label htmlFor="modelo">Color</Label>
          <Input id="color" placeholder="Ej: Rojo" required />
        </div>

        {/* //* Campo: Certificado Vehicular */}
        <div className="">
          <div className="flex justify-between">
            <Label htmlFor="certificado_vehicular">Certificado</Label>
            <a
              href="https://rec.mtc.gob.pe/Citv/ArConsultaCitv"
              target="_blank"
              className="text-xs text-blue-600 underline my-auto"
            >
              consultar
            </a>
          </div>
          <Input
            id="certificado_vehicular"
            type="string"
            placeholder="Ej: C-2024-167-433-001368"
            required
          />
        </div>
      </div>

      {/* Botón de envío */}
      {/* <div className="mt-6 flex justify-end">
        <Button type="submit">Guardar Vehículo</Button>
      </div> */}

      {/* </Form> */}
    </div>
  );
};

export default VehiculoForm;
