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
import { useEffect, useState } from "react";
import ModalDocumentos from "../components/modal/ModalDocumentos";
import {
  valorIncialDescuentoItem,
  ValorInicialDetalleNota,
  valorInicialProducto,
} from "../utils/valoresInicialNota";

const codigosMotivoCredito = [
  {
    value: "01",
    label: "01 - Anulación de la operación",
    descripcion: "ANULACION DE OPERACION",
  },
  {
    value: "02",
    label: "02 - Anulación por error en el RUC",
    descripcion: "ANULACION POR ERROR EN EL RUC",
  },
  {
    value: "03",
    label: "03 - Corrección por error en la descripción",
    descripcion: "CORRECCION POR ERROR EN LA DESCRIPCION",
  },
  {
    value: "04",
    label: "04 - Descuento global",
    descripcion: "DESCUENTO GLOBAL",
  },
  {
    value: "05",
    label: "05 - Descuento por ítem",
    descripcion: "DESCUENTO POR ITEM",
  },
  {
    value: "06",
    label: "06 - Devolución total",
    descripcion: "DEVOLUCION TOTAL",
  },
  {
    value: "07",
    label: "07 - Devolución por ítem",
    descripcion: "DEVOLUCION POR ITEM",
  },
  // { value: "08", label: "08 - Bonificación" },
  // { value: "09", label: "09 - Disminución en el valor" },
  // { value: "10", label: "10 - Otros Conceptos", descripcion: "OTROS CONCEPTOS" },
];

const codigosMotivosDebito = [
  {
    value: "01",
    label: "01 - Intereses por mora",
    descripcion: "INTERESES POR MORA",
  },
  {
    value: "02",
    label: "02 - Aumento en el valor",
    descripcion: "AUMENTO EN EL VALOR",
  },
  {
    value: "03",
    label: "03 - Penalidades/ otros conceptos",
    descripcion: "PENALIDADES/ OTROS CONCEPTOS",
  },
];
const DocumentoAfectadoForm = () => {
  const {
    notaCreditoDebito,
    setNotaCreditoDebito,
    documentoAAfectar,
    setItemActual,
  } = useNota();

  const [codMotivoStatus, setCodMotivoStatus] = useState(true);
  const [open, setOpen] = useState(false);

  const handleSelectChange = (value, name) => {
    setNotaCreditoDebito((prevValores) => ({
      ...prevValores,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotaCreditoDebito((prevValores) => ({
      ...prevValores,
      [name]: value.toUpperCase(),
    }));
  };

  const obtenerDescipcionMotivo = (motivo, tipo) => {
    if (tipo === "07") {
      const motivoCredito = codigosMotivoCredito.find(
        (motivoCredito) => motivoCredito.value === motivo,
      );
      return motivoCredito ? motivoCredito.descripcion : "Desconocido";
    } else {
      const motivoDebito = codigosMotivosDebito.find(
        (motivoDebito) => motivoDebito.value === motivo,
      );
      return motivoDebito ? motivoDebito.descripcion : "Desconocido";
    }
  };

  useEffect(() => {
    setNotaCreditoDebito((prev) => ({
      ...prev,
      motivo_Cod: "",
      motivo_Des: "",
    }));
  }, [notaCreditoDebito.tipo_Doc]);

  useEffect(() => {
    // ?? CASOS DE NOTA DE CREDITO
    if (
      (notaCreditoDebito.motivo_Cod === "01" ||
        notaCreditoDebito.motivo_Cod === "02" ||
        notaCreditoDebito.motivo_Cod === "06") &&
      notaCreditoDebito.tipo_Doc === "07"
    ) {
      setNotaCreditoDebito((prev) => ({
        ...prev,
        ...documentoAAfectar,
        motivo_Des: obtenerDescipcionMotivo(
          notaCreditoDebito.motivo_Cod,
          notaCreditoDebito.tipo_Doc,
        ),
      }));
    } else if (
      notaCreditoDebito.motivo_Cod === "03" &&
      notaCreditoDebito.tipo_Doc === "07"
    ) {
      setNotaCreditoDebito((prev) => ({
        ...prev,
        ...ValorInicialDetalleNota,
        motivo_Des: obtenerDescipcionMotivo(
          notaCreditoDebito.motivo_Cod,
          notaCreditoDebito.tipo_Doc,
        ),
        legend: [],
      }));
      setItemActual(valorInicialProducto);
    } else if (
      notaCreditoDebito.motivo_Cod === "04" &&
      notaCreditoDebito.tipo_Doc === "07"
    ) {
      setNotaCreditoDebito((prev) => ({
        ...prev,
        ...ValorInicialDetalleNota,
        motivo_Des: obtenerDescipcionMotivo(
          notaCreditoDebito.motivo_Cod,
          notaCreditoDebito.tipo_Doc,
        ),
        legend: [],
      }));
      setItemActual(valorInicialProducto);
    } else if (
      notaCreditoDebito.motivo_Cod === "05" &&
      notaCreditoDebito.tipo_Doc === "07"
    ) {
      setNotaCreditoDebito((prev) => ({
        ...prev,
        ...ValorInicialDetalleNota,
        motivo_Des: obtenerDescipcionMotivo(
          notaCreditoDebito.motivo_Cod,
          notaCreditoDebito.tipo_Doc,
        ),
        legend: [],
      }));
      setItemActual(valorIncialDescuentoItem);
    } else if (
      notaCreditoDebito.motivo_Cod === "07" &&
      notaCreditoDebito.tipo_Doc === "07"
    ) {
      setNotaCreditoDebito((prev) => ({
        ...prev,
        ...ValorInicialDetalleNota,
        motivo_Des: obtenerDescipcionMotivo(
          notaCreditoDebito.motivo_Cod,
          notaCreditoDebito.tipo_Doc,
        ),
        legend: [],
      }));
      setItemActual(valorInicialProducto);
    }
    // ?? CASOS DE NOTA DE DEBITO
    else if (
      ["01", "02", "03"].includes(notaCreditoDebito.motivo_Cod) &&
      notaCreditoDebito.tipo_Doc === "08"
    ) {
      setNotaCreditoDebito((prev) => ({
        ...prev,
        ...ValorInicialDetalleNota,
        motivo_Des: obtenerDescipcionMotivo(
          notaCreditoDebito.motivo_Cod,
          notaCreditoDebito.tipo_Doc,
        ),
        legend: [],
        detalle: [],
      }));
    }
  }, [notaCreditoDebito.motivo_Cod]);

  useEffect(() => {
    if (notaCreditoDebito.afectado_Num_Doc === "") {
      setCodMotivoStatus(true);
    } else {
      setCodMotivoStatus(false);
    }
  }, [notaCreditoDebito.afectado_Num_Doc]);

  return (
    <div className="p-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="py-3 text-2xl font-bold text-gray-800">
          Datos del Documento Afectado
        </h1>
        <ModalDocumentos open={open} setOpen={setOpen} />
      </div>
      <div className="mb-8 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Label
            htmlFor="afectado_Tipo_Doc"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Tipo Documento Afectado
          </Label>
          <Select
            name="afectado_Tipo_Doc"
            value={notaCreditoDebito.afectado_Tipo_Doc}
            // onValueChange={(e) => {
            //     handleSelectChange(e, "afectado_Tipo_Doc");
            // }}
            disabled
          >
            <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
              <SelectValue placeholder="Selecciona un tipo de Documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="01">Factura</SelectItem>
              <SelectItem value="03">Boleta</SelectItem>
              <SelectItem value="09">Guía de Remisión</SelectItem>
              {/* <SelectItem value="03">Nota de Crédito</SelectItem> */}
              {/* <SelectItem value="07">Nota de Débito</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label
            htmlFor="afectado_Num_Doc"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Número Documento Afectado
          </Label>
          <Input
            type="text"
            id="afectado_Num_Doc"
            name="afectado_Num_Doc"
            value={notaCreditoDebito.afectado_Num_Doc}
            // onChange={handleInputChange}
            disabled
            className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <Label
            htmlFor="motivo_Cod"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Código Motivo
          </Label>
          <Select
            name="motivo_Cod"
            value={notaCreditoDebito.motivo_Cod}
            onValueChange={(e) => {
              handleSelectChange(e, "motivo_Cod");
            }}
            disabled={codMotivoStatus}
          >
            <SelectTrigger className="w-full rounded-md border border-gray-300 shadow-sm">
              <SelectValue placeholder="Selecciona un tipo de Documento" />
            </SelectTrigger>
            <SelectContent>
              {notaCreditoDebito.tipo_Doc === "07"
                ? codigosMotivoCredito.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))
                : codigosMotivosDebito.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Label
            htmlFor="motivo_Des"
            className="mb-1 block text-left text-sm font-semibold text-gray-700"
          >
            Descripción Motivo
          </Label>
          <Textarea
            value={notaCreditoDebito.motivo_Des}
            type="text"
            id="motivo_Des"
            name="motivo_Des"
            rows="2"
            onChange={handleInputChange}
            className="block w-full rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
          ></Textarea>
        </div>
      </div>
    </div>
  );
};

export default DocumentoAfectadoForm;
