import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import ModalNuevoChofer from "../modal/ModalNuevoChofer";
import TablaChoferes from "../tabla/TablaChoferes";

const ListaChoferes = [
  {
    nombres: "Ana",
    apellidos: "Gómez Pérez",
    nro_licencia: "L-12345678",
    nro_documento: "100200300",
    tipo_documento: "DNI"
  },
  {
    nombres: "Luis",
    apellidos: "Rodríguez López",
    nro_licencia: "L-98765432",
    nro_documento: "400500600",
    tipo_documento: "DNI"
  },
  {
    nombres: "María",
    apellidos: "Fernández Sánchez",
    nro_licencia: "L-11223344",
    nro_documento: "700800900",
    tipo_documento: "DNI"
  },
  {
    nombres: "Carlos",
    apellidos: "Martínez Díaz",
    nro_licencia: "L-55667788",
    nro_documento: "121314151",
    tipo_documento: "DNI"
  },
  {
    nombres: "Sofía",
    apellidos: "Herrera Vargas",
    nro_licencia: "L-99001122",
    nro_documento: "161718191",
    tipo_documento: "DNI"
  },
  {
    nombres: "Javier",
    apellidos: "Torres Morales",
    nro_licencia: "L-33445566",
    nro_documento: "202122232",
    tipo_documento: "DNI"
  },
  {
    nombres: "Elena",
    apellidos: "Ruiz Castro",
    nro_licencia: "L-77889900",
    nro_documento: "242526272",
    tipo_documento: "DNI"
  },
  {
    nombres: "Ricardo",
    apellidos: "Silva Núñez",
    nro_licencia: "L-22334455",
    nro_documento: "282930313",
    tipo_documento: "DNI"
  },
];

const ChoferesLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full flex-col">
      {/* // ? HEADER */}
      <div className="mb-6 flex flex-row items-end justify-between px-2">
        {/* //? BUSCADOR */}
        <div className="flex w-1/3 flex-col">
          <Label className="text-sm font-semibold text-gray-700">Buscar</Label>
          <Input placeholder="Buscar..." className="bg-white" />
        </div>
        {/* //? BOTONES */}
        <ModalNuevoChofer open={open} setOpen={setOpen} />
      </div>

      {/* // ? TABLA */}
      <TablaChoferes choferes={ListaChoferes} />
    </div>
  );
};

export default ChoferesLayout;
