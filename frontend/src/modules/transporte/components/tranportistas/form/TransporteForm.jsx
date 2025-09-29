import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import factilizaService from "@/modules/facturacion/service/FactilizaService";
import {
  valorIncialTransporte,
  valorInicialVehicular,
} from "@/modules/transporte/utils/valoresInicial";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import VehiculoForm from "../../vehiculos/form/VehiculoForm";

const TransporteForm = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [transporte, setTransporte] = useState(valorIncialTransporte);

  const handleAddVehiculo = () => {
    setVehiculos([...vehiculos, valorInicialVehicular]);
  };

  const handleVehiculoChange = (index, field, value) => {
    const newVehiculos = [...vehiculos];
    newVehiculos[index][field] = value;
    setVehiculos(newVehiculos);
  };

  const handleDeleteVehiculo = (index) => {
    const newVehiculos = [...vehiculos];
    newVehiculos.splice(index, 1);
    setVehiculos(newVehiculos);
  };

  const handleChangeTransporte = (event) => {
    if (event.target.id === "nro_doc") {
      const valor = event.target.value.replace(/[^0-9]/g, "");
      setTransporte({
        ...transporte,
        [event.target.id]: valor,
      });
    } else {
      setTransporte({
        ...transporte,
        [event.target.id]: event.target.value.toUpperCase(),
      });
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();

    if (!transporte.nro_doc || transporte.nro_doc.length !== 11) {
      toast.error("Debes ingresar un RUC valido.");
      return;
    }

    try {
      const promise = factilizaService.obtenerEmpresaPorRuc(transporte.nro_doc);
      toast.promise(promise, {
        pending: "Buscando información dela empresa",
        success: "Información encontrada",
        error: "Ocurrió un error al buscar la información del empresa",
      });
      const { data, status, success } = await promise;

      if (status === 200 && success) {
        setTransporte({
          ...transporte,
          razon_social: data.nombre_o_razon_social,
        });
      }
    } catch (error) {
      // console.log(error);
    }
  };
  return (
    <div className="">
      {/* Contenedor principal con grid para disposición de campos */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 pb-2 md:grid-cols-3">
        {/* //* Campo: Nro. Documento */}
        <div className="">
          <Label htmlFor="nro_doc">Nro. Documento</Label>
          <div className="flex gap-x-2">
            <Input
              id="nro_doc"
              value={transporte.nro_doc}
              onChange={handleChangeTransporte}
              placeholder="Ej: 12345678912"
              maxLength={11}
              type="string"
              className={"bg-white"}
              required
            />
            <button
              onClick={handleBuscar}
              className="bg-innova-blue hover:bg-innova-blue-hover focus:ring-innova-blue cursor-pointer rounded-md p-2 text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* //* Campo: Razon social */}
        <div className="col-span-2">
          <Label htmlFor="razon_social">Razon Social</Label>
          <Input
            id="razon_social"
            value={transporte.razon_social}
            onChange={handleChangeTransporte}
            placeholder="Ej: Transporte S.A"
            className={"bg-white"}
            required
          />
        </div>

        {/* //* Campo: Nro. Mtc */}
        <div className="">
          <div className="flex justify-start gap-x-3">
            <Label htmlFor="nro_mtc">Nro. Mtc</Label>
            <a
              href="https://www.mtc.gob.pe/tramitesenlinea/tweb_tLinea/tw_consultadgtt/Frm_rep_intra_mercancia.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="my-auto text-xs text-blue-600 underline"
            >
              Consultar
            </a>
          </div>
          <Input
            id="nro_mtc"
            value={transporte.nro_mtc}
            onChange={handleChangeTransporte}
            placeholder="Ej: 15161734CNG "
            className={"bg-white"}
            required
          />
        </div>
      </div>

      {/* //? Vehiculos */}
      <div className="gap-y-4">
        <div className="flex flex-col gap-y-3">
          {vehiculos.map((vehiculo, index) => (
            <VehiculoForm
              key={index}
              vehiculo={vehiculo}
              index={index}
              handleChange={handleVehiculoChange}
              handleDelete={handleDeleteVehiculo}
            />
          ))}
        </div>

        {/* //? Botón de agregar vehiculo */}
        <Button
          type="button"
          className={
            "bg-innova-orange hover:bg-innova-orange mt-4 cursor-pointer hover:scale-105"
          }
          onClick={handleAddVehiculo}
        >
          <span>Vehiculo</span>
          <Plus />
        </Button>
      </div>

      {/* Botón de envío */}
      <div className="mt-6 flex justify-end">
        <Button type="submit">Guardar Transporte</Button>
      </div>
    </div>
  );
};

export default TransporteForm;
