import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGuiaTransporte } from "@/modules/facturacion/context/GuiaTransporteContext";
import { LoaderCircle, Search, SquarePen } from "lucide-react";
import { useEffect } from "react";
import { Calendar22 } from "../../factura-boleta/components/Calendar22";
import { formatDateTime } from "@/modules/facturacion/utils/formateos";

const InfDocumentoForm = () => {
  const {
    serieGuia,
    correlativos,
    correlativoEstado,
    setCorrelativoEstado,
    loadingCorrelativo,
    buscarCorrelativo,
    guiaTransporte,
    setGuiaTransporte,
    tipoGuia,
    setTipoGuia,
    filiales,
    setGuiaDatosInternos,
  } = useGuiaTransporte();

  const {
    tipo_Doc,
    serie,
    correlativo,
    observacion,
    empresa_Ruc,
    obra,
    nro_contrato,
    fecha_Emision,
  } = guiaTransporte;

  const activarCorrelativo = (e) => {
    e.preventDefault();
    setCorrelativoEstado(!correlativoEstado);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuiaTransporte((prevGuiaTransporte) => ({
      ...prevGuiaTransporte,
      [name]: value.toUpperCase(),
    }));
  };

  const handleSelectChange = (value, name) => {
    setGuiaTransporte((prevValores) => ({
      ...prevValores,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (filiales.length !== 0) {
      buscarCorrelativo();
    }
  }, [filiales]);

  useEffect(() => {
    // Buscar y establecer el correlativo bas ndose en la serie y el RUC actual
    if (
      correlativos.length > 0 &&
      guiaTransporte.empresa_Ruc &&
      guiaTransporte.serie
    ) {
      const correlativoEncontrado = correlativos.find(
        (item) =>
          item.ruc === guiaTransporte.empresa_Ruc &&
          item.serie === guiaTransporte.serie,
      );
      const siguienteCorrelativo = correlativoEncontrado
        ? correlativoEncontrado.siguienteCorrelativo
        : "0001";
      setGuiaTransporte((prev) => ({
        ...prev,
        correlativo: siguienteCorrelativo,
      }));
    }
  }, [guiaTransporte.empresa_Ruc, guiaTransporte.serie, correlativos]);

  useEffect(() => {
    if (guiaTransporte.empresa_Ruc) {
      setGuiaDatosInternos((prevValores) => ({
        ...prevValores,
        guia_Envio_Partida_Ruc: guiaTransporte.empresa_Ruc,
        guia_Envio_Llegada_Ruc: guiaTransporte.empresa_Ruc,
      }));
    }
  }, [guiaTransporte.empresa_Ruc]);

  useEffect(() => {
    if (tipoGuia === "traslado-misma-empresa") {
      const filialSameRuc = filiales.find(
        (filial) => filial.ruc === guiaTransporte.empresa_Ruc,
      );
      console.log(filialSameRuc);
      setGuiaTransporte((prevValores) => ({
        ...prevValores,
        cliente_Tipo_Doc: "6",
        cliente_Num_Doc: filialSameRuc.ruc,
        cliente_Razon_Social: filialSameRuc.razon_social,
        cliente_Direccion: filialSameRuc.direccion,
      }));
    }
  }, [tipoGuia]);

  return (
    <div className="overflow-y-auto p-4 sm:p-6 lg:px-8 lg:py-4">
      <h2 className="mb-2 flex text-2xl font-semibold">
        Información del Documento
      </h2>
      <form
        onSubmit={(e) => e.preventDefault()}
        action=""
        className="mb-8 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* Added gap-y for vertical spacing on small screens */}
        <div>
          <Label
            htmlFor="tipo_Doc"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Tipo de Guia a Emitir
          </Label>
          <Select
            name="tipo_operacion"
            value={tipoGuia}
            onValueChange={(e) => {
              setTipoGuia(e);
            }}
          >
            <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
              {" "}
              {/* Estilo de borde mejorado */}
              <SelectValue placeholder="Selecciona un tipo de Documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transporte-publico">
                Guia de Remision - Transporte Publico
              </SelectItem>
              <SelectItem value="transporte-privado">
                Guia de Remision - Transporte Privado
              </SelectItem>
              <SelectItem value="traslado-misma-empresa">
                Nota de Remision - Traslado Interno
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Added gap-y for vertical spacing on small screens */}
        <div>
          <Label
            htmlFor="tipo_Doc"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Tipo de Documento
          </Label>
          <Select
            name="tipo_operacion"
            value={tipo_Doc}
            onValueChange={(e) => {
              handleSelectChange(e, "tipo_Doc");
            }}
          >
            <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
              {" "}
              {/* Estilo de borde mejorado */}
              <SelectValue placeholder="Selecciona un tipo de Documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="09">Guia de Remision</SelectItem>
              {/* <SelectItem value="07">Nota de Credito</SelectItem> */}
              {/* <SelectItem value="08">Nota de Debito</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label
            htmlFor="serie"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Serie
          </Label>
          <div className="relative w-full">
            <Select
              value={serie}
              name="serie"
              onValueChange={(value) => handleSelectChange(value, "serie")}
            >
              <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
                <SelectValue placeholder="Selecciona una serie" />
              </SelectTrigger>
              <SelectContent>
                {serieGuia.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label
            htmlFor="correlativo"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Correlativo
          </Label>
          <div className="flex justify-between gap-x-2">
            <div className="relative w-full">
              <Input
                type="text"
                id="correlativo"
                name="correlativo"
                value={correlativo}
                onChange={handleChange}
                disabled={!correlativoEstado}
                maxLength={8}
                className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:outline-none"
              />
              <button
                onClick={activarCorrelativo}
                className={`absolute top-1/2 right-2 -translate-y-1/2 transform ${correlativoEstado ? "text-blue-500" : "text-gray-400"} `}
              >
                <SquarePen />
              </button>
            </div>
            <button
              className="bg-innova-blue hover:bg-innova-blue-hover focus:ring-innova-blue cursor-pointer rounded-md p-2 text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
              // disabled={correlativoEstado}
              onClick={(e) => buscarCorrelativo(e)}
            >
              {loadingCorrelativo ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <Search className="size-5" />
              )}
            </button>
          </div>
        </div>
        <div>
          <Label
            htmlFor="fecha_Emision"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Fecha de Emisión
          </Label>
          {/* <Calendar22
            tipo={"fecha_Emision"}
            Dato={guiaTransporte}
            setDato={setGuiaTransporte}
            type="datetime-local"
            id="fecha_Emision"
            name="fecha_Emision"
            className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:outline-none"
          /> */}
          <input
            type="string"
            id="fecha_Emision"
            name="fecha_Emision"
            className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:outline-none"
            value={formatDateTime(fecha_Emision) || ""}
            readOnly
          />
        </div>
        <div>
          <div>
            <Label
              htmlFor="empresa_Ruc"
              className="mb-1 block text-left text-sm font-semibold text-gray-700"
            >
              RUC Empresa
            </Label>
            <Select
              value={empresa_Ruc}
              name="empresa_Ruc"
              onValueChange={(e) => {
                handleSelectChange(e, "empresa_Ruc");
              }}
            >
              <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
                <SelectValue placeholder="Selecciona un codigo" />
              </SelectTrigger>
              <SelectContent>
                {filiales.map((filial) => (
                  <SelectItem key={filial.id} value={filial.ruc}>
                    {filial.razon_social} - {filial.ruc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <Label
            htmlFor="cliente_Razon_Social"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Obra
          </Label>
          <Input
            type="text"
            id="obra"
            name="obra"
            value={obra}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <Label
            htmlFor="cliente_Razon_Social"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Codigo Contrato
          </Label>
          <Input
            type="text"
            id="nro_contrato"
            name="nro_contrato"
            value={nro_contrato}
            onChange={handleChange}
            className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Label
            htmlFor="observacion"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Observación
          </Label>
          <div className="relative flex w-full">
            <Textarea
              id="observacion"
              name="observacion"
              value={observacion}
              onChange={handleChange}
              rows="2"
              maxLength="250"
              className="h-32 w-full resize-none rounded-lg border border-gray-300 bg-white p-4 placeholder-gray-400 transition-all duration-200"
            ></Textarea>
            <p className="absolute right-4 bottom-2 mt-2 text-right text-sm text-gray-500">
              {observacion.length}/250
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InfDocumentoForm;
