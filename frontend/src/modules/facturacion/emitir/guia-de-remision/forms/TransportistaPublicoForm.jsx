import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";

import { Search } from "lucide-react";
import { toast } from "react-toastify";
import facturaService from "../../../service/FacturaService";
import { useState } from "react";
import factilizaService from "@/modules/facturacion/service/FactilizaService";

const TransportistaPublicoForm = () => {
  const { guiaDatosPublico, tipoGuia, setGuiaDatosPublico } =
    useGuiaTransporte();
  const [loadingBtn, setLoadingBtn] = useState(false);

  const handleChange = (value, name) => {
    setGuiaDatosPublico((prev) => ({
      ...prev,
      transportista: {
        ...prev.transportista,
        [name]: value,
      },
    }));
  };

  const handleBuscar = async () => {
    // e.preventDefault();
    setLoadingBtn(true);
    const transportista = guiaDatosPublico.transportista;

    if (transportista.nro_doc.length !== 11) {
      toast.error("El número de documento del chofer debe tener 11 dígitos.");
      return;
    }

    try {
      const ruc = String(transportista?.nro_doc || "").trim();

      if (!/^\d{11}$/.test(ruc)) {
        // ? RUC inválido: no sigas
        // ? toast.error("RUC del transportista inválido");
        return;
      }

      // ? ========= 1) RUC -> Razón Social (consulta “ligera”) =========
      const rucResp = await factilizaService.obtenerEmpresaPorRuc(ruc);
      const rucStatus = rucResp?.status ?? 200;
      const rucOk =
        (rucResp?.success ?? rucResp?.succes ?? rucResp?.estado ?? true) &&
        rucStatus === 200;

      const razonSocial =
        (rucOk &&
          (rucResp?.data?.nombre_o_razon_social ??
            rucResp?.data?.razon_social ??
            rucResp?.nombre_o_razon_social ??
            rucResp?.razon_social)) ||
        "";

      setGuiaDatosPublico((prev) => ({
        ...prev,
        transportista: {
          ...prev.transportista,
          razon_Social: razonSocial,
          //? nro_mtc se llenará en el paso 2
        },
      }));

      //? ========= 2) MTC (con toast.promise) =========
      const mtcPromise = facturaService.obtenerMtc(ruc);

      toast.promise(mtcPromise, {
        pending: "Buscando MTC",
        success: "Información encontrada",
        warning: "No se encontró información en MTC",
      });

      const mtcResp = await mtcPromise;

      //? Algunas APIs devuelven { status, estado, data:{ status, ... } }
      const mtcTopStatus = mtcResp?.status; // a veces existe
      const mtcDataStatus = mtcResp?.data?.status; // a veces está dentro de data
      const mtcOkFlag = (mtcResp?.estado ?? mtcResp?.success ?? true) === true;
      const mtcOk =
        (mtcTopStatus === 200 || mtcDataStatus === 200) && mtcOkFlag;

      const nombresAlt =
        mtcResp?.razon_social || mtcResp?.data?.razon_social || "";
      const nro_mtc = mtcOk
        ? mtcResp?.data?.codigo_mtc || mtcResp?.codigo_mtc || ""
        : "";

      setGuiaDatosPublico((prev) => ({
        ...prev,
        transportista: {
          ...prev.transportista,
          //? Si no vino de Sunat, puedes usar el de MTC como fallback (descomenta si lo quieres):
          //? razon_Social: prev.transportista?.razon_Social || razonSocial || nombresAlt || "",
          nro_mtc,
        },
      }));
    } catch (error) {
      // console.error("Error al buscar:", error);
      // toast.error("Hubo un problema al conectar con el servicio de búsqueda.");
    } finally {
      setLoadingBtn(false);
    }
  };

  if (tipoGuia !== "transporte-publico") return <></>;

  return (
    <div className="flex flex-col overflow-y-auto p-4 sm:p-6 lg:px-8 lg:py-4">
      <div className="flex">
        <h2 className="mb-6 text-2xl font-semibold">Datos del Transportista</h2>
      </div>
      <div className="relative mb-6 grid grid-cols-1 gap-x-6 gap-y-4 rounded-md border border-gray-400 p-6 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <Label
            htmlFor={`transportePublico-tipo_doc`}
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Tipo Documento
          </Label>
          <Select
            name="tipo_doc"
            value={guiaDatosPublico.transportista.tipo_doc}
            onValueChange={(e) => handleChange(e.target.value, e.target.name)}
          >
            <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
              <SelectValue placeholder="Selecciona un tipo de Documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">RUC</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label
            htmlFor={`chofer-nro_doc`}
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Nro. Documento
          </Label>
          <div className="flex gap-x-1">
            <Input
              type="text"
              id={`chofer-nro_doc`}
              name="nro_doc"
              value={guiaDatosPublico.transportista.nro_doc}
              onChange={(e) => handleChange(e.target.value, e.target.name)}
              className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
              maxLength={11}
            />
            <button
              type="button" // Importante: usa type="button" para evitar que el botón envíe el formulario
              onClick={handleBuscar}
              disabled={loadingBtn}
              className="bg-innova-blue cursor-pointer rounded-md p-2 text-white transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <Label
            htmlFor={`chofer-nombres`}
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Razón Social
          </Label>
          <Input
            type="text"
            id={`chofer-nombres`}
            name="razon_Social"
            value={guiaDatosPublico.transportista.razon_Social}
            onChange={(e) => handleChange(e.target.value, e.target.name)}
            className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <Label
            htmlFor={`chofer-nro_mtc`}
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Número MTC
          </Label>
          <Input
            type="text"
            id={`chofer-nro_mtc`}
            name="nro_mtc"
            value={guiaDatosPublico.transportista.nro_mtc}
            onChange={(e) => handleChange(e.target.value, e.target.name)}
            className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default TransportistaPublicoForm;
