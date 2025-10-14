import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ModalListaDeClientes from "@/modules/facturacion/components/modal/ModalListaDeClientes";
import { useNota } from "@/modules/facturacion/context/NotaContext";
import { Search } from "lucide-react";

const DatosDeClienteForm = () => {
  const { notaCreditoDebito, setNotaCreditoDebito, filiales } = useNota();
  const {
    cliente_Tipo_Doc,
    cliente_Num_Doc,
    cliente_Razon_Social,
    cliente_Direccion,
  } = notaCreditoDebito;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotaCreditoDebito((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setNotaCreditoDebito((prev) => ({ ...prev, cliente_Tipo_Doc: value }));
  };

  return (
    <div className="p-4 sm:px-6 lg:px-8">
      <div className=" grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label
            htmlFor="cliente_Tipo_Doc"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Tipo Documento Cliente
          </Label>
          <Select
            name="cliente_Tipo_Doc"
            value={cliente_Tipo_Doc}
            readOnly
            disabled
          >
            <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
              <SelectValue placeholder="Selecciona un tipo de Documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">RUC</SelectItem>
              <SelectItem value="1">
                DNI - Documento Nacional de Identidad
              </SelectItem>
              <SelectItem value="4">CARNET DE EXTRANJERIA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label
            htmlFor="cliente_Num_Doc"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Número Documento Cliente
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              id="cliente_Num_Doc"
              name="cliente_Num_Doc"
              value={cliente_Num_Doc}
              readOnly
              disabled
              className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <Label
            htmlFor="cliente_Razon_Social"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Razón Social Cliente
          </Label>
          <Input
            type="text"
            id="cliente_Razon_Social"
            name="cliente_Razon_Social"
            value={cliente_Razon_Social}
            readOnly
            disabled
            className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        {/* <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Label
            htmlFor="cliente_Direccion"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Dirección Cliente
          </Label>
          <Input
            type="text"
            id="cliente_Direccion"
            name="cliente_Direccion"
            value={cliente_Direccion}
            onChange={handleInputChange}
            className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
          />
        </div> */}
      </div>
    </div>
  );
};

export default DatosDeClienteForm;
