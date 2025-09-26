import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import ModalNuevoVehiculo from "../modal/ModalNuevoVehiculo";
import TablaVehiculos from "../tabla/TablaVehiculos";

let listaVehiculos = [
  {
    nro_placa: "A1B234",
    marca: "Volvo",
    modelo: "FH 540",
    color: "azul",
    anio: 2022,
    capacidad: 30,
    unidad: "TNE",
    certificado_vehicular: "CV-987654",
    transportista: {
      id: 1,
      ruc: "20123456789",
      razon_social: "Transportes Rápidos S.A.C.",
      nro_mtc: "MTC-0001",
    },
  },
  {
    nro_placa: "XY9876",
    marca: "Freightliner",
    modelo: "Cascadia",
    color: "azul",
    anio: 2021,
    capacidad: 25,
    unidad: "TNE",
    certificado_vehicular: "CV-654321",
    transportista: {
      id: 2,
      ruc: "20987654321",
      razon_social: "Logística Segura E.I.R.L.",
      nro_mtc: "MTC-0002",
    },
  },
  {
    nro_placa: "CDE567",
    marca: "Kenworth",
    modelo: "T680",
    color: "azul",
    anio: 2023,
    capacidad: 35,
    unidad: "TNE",
    certificado_vehicular: "CV-112233",
    transportista: {
      id: 1,
      ruc: "20123456789",
      razon_social: "Transportes Rápidos S.A.C.",
      nro_mtc: "MTC-0001",
    },
  },
  {
    nro_placa: "FGH890",
    marca: "Scania",
    modelo: "R450",
    color: "azul",
    anio: 2020,
    capacidad: 28,
    unidad: "TNE",
    certificado_vehicular: "CV-445566",
    transportista: {
      id: 3,
      ruc: "10112233445",
      razon_social: "Distribuidora Andina E.I.R.L.",
      nro_mtc: "MTC-0003",
    },
  },
  {
    nro_placa: "IJK123",
    marca: "Mercedes-Benz",
    modelo: "Actros",
    color: "azul",
    anio: 2024,
    capacidad: 22,
    unidad: "TNE",
    certificado_vehicular: "CV-778899",
    transportista: {
      id: 2,
      ruc: "20987654321",
      razon_social: "Logística Segura E.I.R.L.",
      nro_mtc: "MTC-0002",
    },
  },
];

const VehiculosLayout = () => {
    const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full flex-col">
      {/* // ? HEADER */}
      <div className="mb-6 flex flex-row  justify-between items-end px-2">
        {/* //? BUSCADOR */}
        <div className="flex w-1/3 flex-col">
          <Label className="text-sm font-semibold text-gray-700">Buscar</Label>
          <Input placeholder="Buscar..." className="bg-white" />
        </div>
        {/* //? BOTONES */}
        <ModalNuevoVehiculo open={open} setOpen={setOpen} />
      </div>

      {/* // ? TABLA */}
      <TablaVehiculos vehiculos={listaVehiculos} />
    </div>
  );
};

export default VehiculosLayout;
