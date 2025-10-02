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
import { useNota } from "@/modules/facturacion/context/NotaContext";
import { LoaderCircle, Search, SquarePen } from "lucide-react";
import { useEffect, useRef } from "react";
import { Calendar22 } from "../../factura-boleta/components/Calendar22";

const InfDocumentoForm = () => {
  const {
    notaCreditoDebito,
    setNotaCreditoDebito,
    filiales,
    correlativos,
    buscarCorrelativo,
    serieCredito,
    serieDebito,
    correlativoEstado,
    setCorrelativoEstado,
    loadingCorrelativo,
  } = useNota();

  const activarCorrelativo = (e) => {
    e.preventDefault();
    setCorrelativoEstado(!correlativoEstado);
  };

  const handleInputChange = useRef((e) => {
    const { name, value } = e.target;
    setNotaCreditoDebito((prevValores) => ({
      ...prevValores,
      [name]: value.toUpperCase(),
    }));
  }).current;

  useEffect(() => {
    const handleInput = (e) => {
      handleInputChange(e);
    };
    const debouncedHandleInput = debounce(handleInput, 500);
    const inputElement = document.querySelector("input");
    inputElement.addEventListener("input", debouncedHandleInput);
    return () => {
      inputElement.removeEventListener("input", debouncedHandleInput);
    };
  }, []);

  const debounce = (fn, delay) => {
    let timerId = null;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    };
  };

  const handleSelectChange = (value, name) => {
    if (name == "tipo_Doc") {
      setNotaCreditoDebito((prevValores) => ({
        ...prevValores,
        tipo_Doc: value,
        motivo_Cod: "",
        motivo_Des: "",
        monto_Igv: 0.0,
        total_Impuestos: 0.0,
        valor_Venta: 0.0,
        monto_Oper_Gravadas: 0.0,
        monto_Oper_Exoneradas: 0.0,
        sub_Total: 0.0,
        monto_Imp_Venta: 0.0,
        legend: [],
      }));
    } else {
      setNotaCreditoDebito((prevValores) => ({
        ...prevValores,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    // Establecer la serie por defecto al cambiar el tipo de documento
    let nuevaSerie;
    if (notaCreditoDebito.tipo_Doc === "07") {
      if (notaCreditoDebito.afectado_Tipo_Doc == "01") {
        nuevaSerie = "FCT1";
      } else {
        nuevaSerie = "BCT1";
      }
    } else {
      if (notaCreditoDebito.afectado_Tipo_Doc == "01") {
        nuevaSerie = "FDT1";
      } else {
        nuevaSerie = "BDT1";
      }
    }
    setNotaCreditoDebito((prev) => ({
      ...prev,
      serie: nuevaSerie,
      correlativo: "", // Limpiar el correlativo para que se recalcule
      detalle: [],
      motivo_Cod: "",
    }));
  }, [notaCreditoDebito.tipo_Doc]);

  useEffect(() => {
    // Buscar y establecer el correlativo basándose en la serie y el RUC actual
    if (
      correlativos.length > 0 &&
      notaCreditoDebito.empresa_Ruc &&
      notaCreditoDebito.serie
    ) {
      const correlativoEncontrado = correlativos.find(
        (item) =>
          item.ruc === notaCreditoDebito.empresa_Ruc &&
          item.serie === notaCreditoDebito.serie,
      );
      const siguienteCorrelativo = correlativoEncontrado
        ? correlativoEncontrado.siguienteCorrelativo
        : "0001";

      setNotaCreditoDebito((prev) => ({
        ...prev,
        correlativo: siguienteCorrelativo,
      }));
    }
  }, [
    notaCreditoDebito.empresa_Ruc,
    notaCreditoDebito.serie,
    correlativos,
    notaCreditoDebito.tipo_operacion,
  ]);

  return (
    <div className="overflow-y-auto p-4 sm:p-6 lg:px-8 lg:py-4">
      <h2 className="mb-2 flex text-2xl font-semibold">
        Información del Documento
      </h2>
      <div className="mb-8 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Tipo de Operacion */}
        <div className="col-span-full flex flex-col gap-1 sm:col-span-1">
          {" "}
          {/* Col-span-full para que ocupe todo el ancho en móviles */}
          <Label
            htmlFor="tipo_operacion"
            className="font-semibold text-gray-700"
          >
            Tipo de Operación
          </Label>
          <Select
            name="tipo_operacion"
            value={notaCreditoDebito.tipo_Operacion}
            onValueChange={(e) => {
              handleSelectChange(e, "tipo_Operacion");
            }}
          >
            <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
              {" "}
              {/* Estilo de borde mejorado */}
              <SelectValue placeholder="Selecciona un tipo de operación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0101">Venta Interna - (0101)</SelectItem>
              <SelectItem value="1001">
                Operaciones Gravadas - (1001)
              </SelectItem>
              {/* <SelectItem value="0102">Exportación - (0102)</SelectItem> */}
              {/* <SelectItem value="0103">No Domiciliados - (0103)</SelectItem> */}
              <SelectItem value="0104">
                Venta Interna – Anticipos - (0104)
              </SelectItem>
              <SelectItem value="0105">Venta Itinerante - (0105)</SelectItem>
              {/* <SelectItem value="0106">Factura Guía - (0106)</SelectItem> */}
              {/* <SelectItem value="0107">Venta Arroz Pilado - (0107)</SelectItem> */}
              {/* <SelectItem value="0108">Factura - Comprobante de Percepción - (0108)</SelectItem> */}
              {/* <SelectItem value="0110">Factura - Guía remitente - (0110)</SelectItem> */}
              {/* <SelectItem value="0111">Factura - Guía transportista - (0111)</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de Documento */}
        <div>
          <Label
            htmlFor="tipo_Doc"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Tipo de Documento
          </Label>
          <Select
            name="tipo_operacion"
            value={notaCreditoDebito.tipo_Doc}
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
              <SelectItem value="07">Nota de Credito</SelectItem>
              <SelectItem value="08">Nota de Debito</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Serie */}
        <div>
          <Label htmlFor="serie" className="font-semibold text-gray-700">
            Serie
          </Label>
          <Select
            value={notaCreditoDebito.serie}
            name="serie"
            onValueChange={(value) => handleSelectChange(value, "serie")}
          >
            <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
              <SelectValue placeholder="Selecciona una serie" />
            </SelectTrigger>
            <SelectContent>
              {notaCreditoDebito.afectado_Tipo_Doc !== ""
                ? notaCreditoDebito.tipo_Doc === "07"
                  ? serieCredito
                      .filter(
                        (item) =>
                          item.doc === notaCreditoDebito.afectado_Tipo_Doc,
                      )
                      .map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.value}
                        </SelectItem>
                      ))
                  : serieDebito
                      .filter(
                        (item) =>
                          item.doc === notaCreditoDebito.afectado_Tipo_Doc,
                      )
                      .map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.value}
                        </SelectItem>
                      ))
                : notaCreditoDebito.tipo_Doc === "07"
                  ? serieCredito.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.value}
                      </SelectItem>
                    ))
                  : serieDebito.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.value}
                      </SelectItem>
                    ))}
            </SelectContent>
          </Select>
        </div>

        {/* Correlativo */}
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
                value={notaCreditoDebito.correlativo}
                onChange={handleInputChange}
                disabled={!correlativoEstado}
                maxLength={8}
                className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:outline-none"
              />
              <button
                onClick={activarCorrelativo}
                className={`absolute top-1/2 right-2 -translate-y-1/2 transform ${correlativoEstado ? "text-blue-500" : "text-gray-400"}`}
              >
                <SquarePen />
              </button>
            </div>
            <button
              className="bg-innova-blue hover:bg-innova-blue-hover focus:ring-innova-blue cursor-pointer rounded-md p-2 text-white transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
              onClick={buscarCorrelativo}
            >
              {loadingCorrelativo ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <Search className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* Tipo de Moneda */}
        <div className="col-span-full flex flex-col gap-1 sm:col-span-1">
          <Label htmlFor="tipo_moneda" className="font-semibold text-gray-700">
            Tipo de Moneda
          </Label>
          <Select
            value={notaCreditoDebito.tipo_Moneda}
            name="tipo_Moneda"
            disabled
            readOnly
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

        {/* Fecha de Emisión */}
        <div>
          <Label
            htmlFor="fecha_Emision"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Fecha de Emisión
          </Label>
          <Calendar22
            tipo={"fecha_Emision"}
            Dato={notaCreditoDebito}
            setDato={setNotaCreditoDebito}
            type="datetime-local"
            id="fecha_Emision"
            name="fecha_Emision"
            className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:outline-none"
          />
        </div>

        {/* Ruc de la Empresa */}
        <div className="col-span-full flex flex-col gap-1 sm:col-span-1">
          {" "}
          {/* Col-span-full para que ocupe todo el ancho en móviles */}
          <Label
            htmlFor="tipo_operacion"
            className="font-semibold text-gray-700"
          >
            Ruc de la empresa
          </Label>
          <Select
            name="tipo_operacion"
            value={notaCreditoDebito.empresa_Ruc}
            onValueChange={(e) => {
              handleSelectChange(e, "empresa_Ruc");
            }}
          >
            <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
              {" "}
              {/* Estilo de borde mejorado */}
              <SelectValue placeholder="Selecciona un tipo de operación" />
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

        {/* Observación */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <Label
            htmlFor="observacion"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Observación
          </Label>
          <textarea
            id="Observacion"
            name="Observacion"
            value={notaCreditoDebito.Observacion}
            onChange={handleInputChange}
            rows="2"
            className="h-22 w-full resize-none rounded-lg border border-gray-300 bg-white p-4 placeholder-gray-400 transition-all duration-200"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default InfDocumentoForm;
