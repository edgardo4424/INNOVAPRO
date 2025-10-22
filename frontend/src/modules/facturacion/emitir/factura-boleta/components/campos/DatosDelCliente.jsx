import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFacturaBoleta } from "@/modules/facturacion/context/FacturaBoletaContext";
import factilizaService from "@/modules/facturacion/service/FactilizaService";
import { Pencil, Search, SquarePen } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import ModalListaDeClientes from "../../../../components/modal/ModalListaDeClientes";

const DatosDelCliente = () => {
  const { factura, setFactura } = useFacturaBoleta();
  const [razonSocialAct, setRazonSocialAct] = useState(false);
  const [direccionAct, setDireccionAct] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    cliente_Tipo_Doc,
    cliente_Num_Doc,
    cliente_Razon_Social,
    cliente_Direccion,
  } = factura;

  let dad = {
    filial: "RUC PRUEBA FACTALIZA",
    razon_social: "Deister Software Peru S.a.C.",
    ruc_cliente: "20602860338",
    tipo_doc: "Factura",
    serie: "FT01",
    correlativo: "00000008",
    fecha_emision: "2025-10-03T22:41:28.000Z",
    fecha_vencimiento: "2025-10-31T05:00:00.000Z",
    base: "788.02",
    igv: "141.84",
    total: "929.86",
    detraccion: "92.99",
    retencion: null,
    neto: "836.87",
    estado: "Validado",
    tipo_moneda: "PEN",
    precio_dolar: null,
    monto_en_soles: null,
    codigo: "0",
    mensaje: "La Factura numero FT01-00000008, ha sido aceptada",
    doc_de_referencia: null,
    tipo_doc_de_referencia: null,
  };

  const handleBuscar = async (e) => {
    e.preventDefault();

    if (!cliente_Tipo_Doc) {
      toast.error("Debes seleccionar el tipo de documento del cliente.");
      return;
    }

    if (!cliente_Num_Doc?.trim()) {
      toast.error("Debes ingresar el número de documento del cliente.");
      return;
    }

    try {
      const promise = factilizaService.metodoOpcional(
        cliente_Tipo_Doc,
        cliente_Num_Doc,
      );
      toast.promise(promise, {
        pending: "Buscando información del cliente",
        success: "Información encontrada",
        error: "No se encontraron resultados",
      });
      const { data, status, success } = await promise;

      if (status === 200 && success) {
        let razonSocial = "";
        let direccion = "";

        if (cliente_Tipo_Doc === "1") {
          razonSocial = data.nombre_completo;
          direccion = data.direccion_completa;
        } else if (cliente_Tipo_Doc === "6") {
          razonSocial = data.nombre_o_razon_social;
          direccion = data.direccion;
        } else if (cliente_Tipo_Doc === "4") {
          razonSocial = `${data.nombres} ${data.apellido_paterno} ${data.apellido_materno}`;
        }

        setFactura((prev) => ({
          ...prev,
          cliente_Razon_Social: razonSocial,
          cliente_Direccion: direccion,
        }));
      }
    } catch (error) {}
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "cliente_Razon_Social") {
      setFactura((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setFactura((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (value) => {
    setFactura((prev) => ({ ...prev, cliente_Tipo_Doc: value }));
  };

  return (
    <div className="overflow-y-auto p-4 sm:p-6 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between">
        <h1 className="py-3 text-lg font-bold text-gray-800 md:text-2xl">
          Datos del Cliente
        </h1>
        <ModalListaDeClientes setContext={setFactura} />
      </div>
      <form
        className="grid w-full grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 md:gap-x-6 md:gap-y-8 lg:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* Tipo de Documento */}
        <div className="col-span-full flex flex-col gap-1 sm:col-span-1">
          <Label
            htmlFor="cliente_tipo_doc"
            className="font-semibold text-gray-700"
          >
            Tipo de Documento
          </Label>
          <Select value={cliente_Tipo_Doc} onValueChange={handleSelectChange}>
            <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
              <SelectValue placeholder="Selecciona tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              {factura.tipo_Doc === "01" && (
                <SelectItem value="6">RUC</SelectItem>
              )}
              {factura.tipo_Doc === "03" && (
                <>
                  <SelectItem value="6">RUC</SelectItem>
                  <SelectItem value="1">
                    DNI - Documento Nacional de Identidad
                  </SelectItem>
                  <SelectItem value="4">CARNET DE EXTRANJERIA</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Número de Documento */}
        <div className="col-span-full flex flex-col gap-1 sm:col-span-1">
          <Label
            htmlFor="cliente_num_doc"
            className="font-semibold text-gray-700"
          >
            Número de Documento
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              name="cliente_Num_Doc"
              id="cliente_num_doc"
              placeholder="RUC o DNI"
              className="flex-grow rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              value={cliente_Num_Doc || ""}
              onChange={handleInputChange}
              inputMode="numeric"
              maxLength={11}
              pattern="[0-9]{1,11}"
            />
            <button
              type="submit"
              onClick={handleBuscar}
              className="bg-innova-blue hover:bg-innova-blue rounded-md p-2 text-white transition-colors duration-200 hover:scale-105" // Estilos de botón mejorados
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Razón Social */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-1">
          <Label
            htmlFor="cliente_razon_social"
            className="font-semibold text-gray-700"
          >
            Razón Social
          </Label>
          <div className="flex w-full items-start justify-center gap-x-2 ">
            <Input
              type="text"
              name="cliente_Razon_Social"
              id="cliente_razon_social"
              placeholder="Razón Social"
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500" // Estilos mejorados
              value={cliente_Razon_Social || ""}
              onChange={handleInputChange}
              disabled={!razonSocialAct}
            />
            <button
              onClick={() => setRazonSocialAct(!razonSocialAct)}
              id="razon-social-edit-button"
              aria-label="Editar razón social"
              className={`flex items-center justify-center rounded-md p-2 ${!razonSocialAct ? "bg-innova-blue text-white" : "bg-gray-200 text-black"}`}
            >
              <Pencil className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dirección */}
        <div className="col-span-1 flex flex-col gap-1 lg:col-span-4">
          <Label
            htmlFor="cliente_direccion"
            className="font-semibold text-gray-700"
          >
            Dirección
          </Label>
          <div className="flex w-full items-start justify-center gap-x-2">
            <Input
              type="text"
              name="cliente_Direccion"
              id="cliente_direccion"
              placeholder="Dirección"
              className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              value={cliente_Direccion || ""}
              onChange={handleInputChange}
              disabled={!direccionAct}
            />
            <button
              onClick={() => setDireccionAct(!direccionAct)}
              id="direccion-edit-button"
              aria-label="Editar dirección"
              className={`flex items-center justify-center rounded-md p-2 ${!direccionAct ? "bg-innova-blue text-white" : "bg-gray-200 text-black"}`}
            >
              <Pencil className="h-5 w-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DatosDelCliente;
