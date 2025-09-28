import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import ModalNuevoTransporte from "../modal/ModalNuevoTransporte";
import TablaTransportistas from "../tabla/TablaTransportistas";

const listTransportistas = [
  {
    nro_doc: "20123456789", // RUC
    razon_social: "Transportes Globales S.A.C.",
    nro_mtc: "MTC-0003",
    vehiculos: [
      {
        nro_placa: "CDE567",
        marca: "Kenworth",
        modelo: "T680",
        color: "azul",
        anio: 2023,
        capacidad: 35,
        unidad: "TNE",
        certificado_vehicular: "CV-112233",
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
      },
    ],
  },
  {
    nro_doc: "20987654321", // RUC
    razon_social: "Logística Andina Express E.I.R.L.",
    nro_mtc: "MTC-0003",
    vehiculos: [
      {
        nro_placa: "CDE567",
        marca: "Kenworth",
        modelo: "T680",
        color: "azul",
        anio: 2023,
        capacidad: 35,
        unidad: "TNE",
        certificado_vehicular: "CV-112233",
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
      },
    ],
  },
  {
    nro_doc: "20555444333", // RUC
    razon_social: "Distribuidora del Sur S.R.L.",
    nro_mtc: "MTC-0003",
    vehiculos: [
      {
        nro_placa: "CDE567",
        marca: "Kenworth",
        modelo: "T680",
        color: "azul",
        anio: 2023,
        capacidad: 35,
        unidad: "TNE",
        certificado_vehicular: "CV-112233",
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
      },
    ],
  },
];

const TransportistasLayout = () => {
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
        <ModalNuevoTransporte open={open} setOpen={setOpen} />
      </div>

      {/* // ? TABLA */}
      <TablaTransportistas transportistas={listTransportistas} />
    </div>
  );
};

export default TransportistasLayout;
