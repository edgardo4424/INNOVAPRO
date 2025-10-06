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
import { ListTodo, LoaderCircle, Search, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { Calendar22 } from "../Calendar22";
import { Calendar44 } from "../Calendar44";

const DatosDelComprobante = () => {
  const {
    factura,
    setFactura,
    filiales,
    correlativos,
    correlativoEstado,
    setCorrelativoEstado,
    loadingCorrelativo,
    buscarCorrelativo,
    serieFactura,
    setRetencionActivado,
    serieBoleta,
    correlativosPendientes,
  } = useFacturaBoleta();

  const [listaCorrelativos, setListaCorrelativos] = useState([]);

  // ? ... otros estados
  const [mostrarPendientes, setMostrarPendientes] = useState(false);

  // ? Función para alternar la visibilidad de la lista
  const togglePendientes = () => {
    setMostrarPendientes((prev) => !prev);
  };

  const activarCorrelativo = (e) => {
    e.preventDefault();
    setCorrelativoEstado(!correlativoEstado);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFactura((prevValores) => ({
      ...prevValores,
      [name]: value.toUpperCase(),
    }));
  };

  const seleccionarCorrelativo = (value) => {
    setFactura((prevValores) => ({
      ...prevValores,
      correlativo: value,
    }));
    setMostrarPendientes(false);
  };

  const handleSelectChange = (value, name) => {
    setFactura((prevValores) => ({
      ...prevValores,
      [name]: value,
    }));
  };

  // Al cambiar el tipo de documento o la serie, actualizar el correlativo
  useEffect(() => {
    // Establecer la serie por defecto al cambiar el tipo de documento
    const nuevaSerie = factura.tipo_Doc === "01" ? "FT01" : "BT01";
    setFactura((prev) => ({
      ...prev,
      serie: nuevaSerie,
      correlativo: "",
      // forma_pago: [],
      // cuotas_Real: [],
      neto_Pagar: 0,
    }));
  }, [factura.tipo_Doc]);

  useEffect(() => {
    // Buscar y establecer el correlativo basándose en la serie y el RUC actual
    if (correlativos.length > 0 && factura.empresa_Ruc && factura.serie) {
      const correlativoEncontrado = correlativos.find(
        (item) =>
          item.ruc === factura.empresa_Ruc && item.serie === factura.serie,
      );
      const siguienteCorrelativo = correlativoEncontrado
        ? correlativoEncontrado.siguienteCorrelativo
        : "0001";

      setFactura((prev) => ({
        ...prev,
        correlativo: siguienteCorrelativo,
      }));
    }
  }, [factura.empresa_Ruc, factura.serie, correlativos]);

  useEffect(() => {
    setMostrarPendientes(false);
    const lista = correlativosPendientes.filter(
      (item) =>
        item.ruc === factura.empresa_Ruc && item.serie === factura.serie,
    );

    // Une todos los arrays "pendientes" en uno solo
    setListaCorrelativos(lista.flatMap((item) => item.pendientes));
  }, [factura.empresa_Ruc, factura.serie, correlativosPendientes]);

  return (
    <div className="overflow-y-auto p-4 sm:p-6 lg:px-8 lg:py-4">
      <h1 className="py-3 text-2xl font-bold text-gray-800">
        Datos del Comprobante
      </h1>
      <form
        onSubmit={(e) => e.preventDefault()}
        action=""
        className="relative grid w-full grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 md:gap-x-6 md:gap-y-8 lg:grid-cols-3"
      >
        {/* Tipo de Operacion */}
        <div className="col-span-full flex flex-col gap-1 sm:col-span-1">
          <Label
            htmlFor="tipo_operacion"
            className="font-semibold text-gray-700"
          >
            Tipo de Venta
          </Label>
          <Select
            name="tipo_operacion"
            value={factura.tipo_Operacion}
            disabled
            readOnly
          >
            <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
              <SelectValue placeholder="Selecciona un tipo de operación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0101">Venta Interna - (0101)</SelectItem>
              <SelectItem value="1001">
                Operaciones Gravadas - (1001)
              </SelectItem>
              <SelectItem value="0104">
                Venta Interna – Anticipos - (0104)
              </SelectItem>
              <SelectItem value="0105">Venta Itinerante - (0105)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Serie */}
        <div className="col-span-full flex flex-col gap-1 sm:col-span-1">
          <Label htmlFor="serie" className="font-semibold text-gray-700">
            Serie
          </Label>
          <Select
            value={factura.serie}
            name="serie"
            onValueChange={(value) => handleSelectChange(value, "serie")}
          >
            <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
              <SelectValue placeholder="Selecciona una serie" />
            </SelectTrigger>
            <SelectContent>
              {factura.tipo_Doc === "01"
                ? serieFactura.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.value} {item.descrip ? `- ${item.descrip}` : ""}
                    </SelectItem>
                  ))
                : serieBoleta.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.value} {item.descrip ? `(${item.descrip})` : ""}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>

        {/* Correlativo */}
        <div className="col-span-full flex flex-col gap-1 sm:col-span-1">
          <Label htmlFor="correlativo" className="font-semibold text-gray-700">
            Correlativo
          </Label>
          <div className="flex justify-between gap-x-2">
            <div className="relative w-full">
              <Input
                type="text"
                name="correlativo"
                id="correlativo"
                placeholder="Correlativo"
                className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                value={factura.correlativo}
                onChange={handleInputChange}
                disabled={!correlativoEstado}
                maxLength={8}
              />
              <button
                onClick={activarCorrelativo}
                className={`absolute top-1/2 right-2 -translate-y-1/2 transform ${correlativoEstado ? "text-blue-500" : "text-gray-400"}`}
              >
                <SquarePen />
              </button>
            </div>
            <div className="relative flex">
              <div className="flex gap-x-1">
                <button
                  className={`bg-innova-blue hover:bg-innova-blue cursor-pointer rounded-md px-2 text-white hover:scale-105`}
                  onClick={buscarCorrelativo}
                >
                  {loadingCorrelativo ? (
                    <LoaderCircle className="size-5 animate-spin" />
                  ) : (
                    <Search className="size-5" />
                  )}
                </button>

                {listaCorrelativos.length > 0 && (
                  <button
                    // Añado el onClick para cambiar el estado 'mostrarPendientes'
                    onClick={togglePendientes}
                    className={`cursor-pointer rounded-md px-2 text-white hover:scale-105 ${mostrarPendientes ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-500"}`}
                  >
                    <ListTodo />
                  </button>
                )}
              </div>

              {mostrarPendientes && listaCorrelativos.length > 0 && (
                <div className="r absolute top-12 col-span-full rounded-md border border-gray-200 bg-gray-50 p-3 shadow-inner">
                  <h3 className="mb-2 text-sm font-bold text-gray-700">
                    Pendientes:
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {listaCorrelativos.map((pendiente, index) => (
                      <li
                        key={index}
                        className="cursor-pointer rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-gray-800 hover:bg-green-200"
                        onClick={() => seleccionarCorrelativo(pendiente)}
                      >
                        {pendiente}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tipo de Documento */}
        <div className="col-span-full flex flex-col gap-1 sm:col-span-1">
          <Label htmlFor="tipo_doc" className="font-semibold text-gray-700">
            Tipo de Documento
          </Label>
          <Select
            value={factura.tipo_Doc}
            name="tipo_Doc"
            onValueChange={(value) => handleSelectChange(value, "tipo_Doc")}
          >
            <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
              <SelectValue placeholder="Selecciona un tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="01">FACTURA</SelectItem>
              <SelectItem value="03">BOLETA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de Moneda */}
        <div className="col-span-full flex flex-col gap-1 sm:col-span-1">
          <Label htmlFor="tipo_moneda" className="font-semibold text-gray-700">
            Tipo de Moneda
          </Label>
          <Select
            value={factura.tipo_Moneda}
            name="tipo_Moneda"
            onValueChange={(value) => handleSelectChange(value, "tipo_Moneda")}
          >
            <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
              <SelectValue placeholder="Qué moneda usas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PEN">SOLES</SelectItem>
              <SelectItem value="USD">DÓLAR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fecha Emision */}
        <div className="col-span-full flex flex-col gap-1 sm:col-span-1">
          <Label
            htmlFor="fecha_emision"
            className="font-semibold text-gray-700"
          >
            Fecha Emisión
          </Label>
          <Calendar44
            Dato={factura}
            setDato={setFactura}
            tipo="fecha_Emision"
          />
        </div>

        {/* Ruc de la empresa */}
        <div className="col-span-full flex flex-col gap-1 sm:col-span-1 md:col-span-1">
          <Label htmlFor="empresa_Ruc" className="font-semibold text-gray-700">
            Ruc de la empresa
          </Label>
          <Select
            value={factura.empresa_Ruc}
            name="empresa_Ruc"
            onValueChange={(value) => handleSelectChange(value, "empresa_Ruc")}
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

        {/* Orden de compra */}
        <div className="col-span-full flex flex-col gap-1 sm:col-span-1">
          <Label htmlFor="correlativo" className="font-semibold text-gray-700">
            Orden de compra
          </Label>
          <Input
            type="text"
            name="orden_compra"
            id="orden_compra"
            placeholder="orden de compra"
            className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            value={factura.orden_compra}
            onChange={handleInputChange}
          />
        </div>
      </form>
    </div>
  );
};

export default DatosDelComprobante;
