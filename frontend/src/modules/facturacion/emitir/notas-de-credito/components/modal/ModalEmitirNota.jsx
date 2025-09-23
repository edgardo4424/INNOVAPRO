import { useNota } from "@/modules/facturacion/context/NotaContext";
import { Building2, Eye, FileText, ReceiptText, Tag, X } from "lucide-react";
import { useState } from "react";
import { formatearFecha } from "../../../../utils/formatearFecha";
import EnviarNota from "../EnviarNota";
import { getTipoDocCliente } from "@/modules/facturacion/utils/formateos";

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
  {
    value: "10",
    label: "10 - Otros Conceptos",
    descripcion: "OTROS CONCEPTOS",
  },
];

const codigosMotivosDebito = [
  {
    value: "01",
    label: "01 - Intereses por mora",
    descripcion: "INTERESES POR MORAS",
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


const tipoOperacion = {
  "0101": "Venta Interna",
  1001: "Operaciones Gravadas",
  "0104": "Venta Interna – Anticipos",
  "0105": "Venta Itinerante",
  // Agrega los demás valores del SelectContent aquí si es necesario
};

export default function ModalEmitirNota() {
  const [open, setOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const { notaCreditoDebito, filiales } = useNota();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const getMotivoLabel = (motivo_Cod, tipo_Doc) => {
    if (tipo_Doc === "07") {
      const motivoCredito = codigosMotivoCredito.find(
        (motivoCredito) => motivoCredito.value === motivo_Cod,
      );
      return motivoCredito ? motivoCredito.descripcion : "Desconocido";
    } else {
      const motivoDebito = codigosMotivosDebito.find(
        (motivoDebito) => motivoDebito.value === motivo_Cod,
      );
      return motivoDebito ? motivoDebito.descripcion : "Desconocido";
    }
  };


  const getTipoOperacionLabel = (codigo) => {
    return tipoOperacion[codigo] || "Desconocido";
  };

  const isNotaDebito = notaCreditoDebito.tipo_Doc === "03";
  const tipoNota = isNotaDebito ? "Débito" : "Crédito";

  const filialActual = filiales.find(
    (filial) => filial.ruc === notaCreditoDebito.empresa_Ruc,
  );
  const nombreEmpresa = filialActual
    ? filialActual.razon_social
    : "Empresa Desconocida";

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getTipoDocumentoLabel = (codigo) => {
    switch (codigo) {
      case "01":
        return "Factura";
      case "03":
        return "Boleta";
      // case "09":
      //     return "Guía de Remisión";
      case "07":
        return "Nota de Crédito";
      case "08":
        return "Nota de Débito";
      default:
        return "Desconocido";
    }
  };

  return (
    <div>
      {/* Botón para abrir el modal */}
      <button
        type="button"
        onClick={openModal}
        className="focus:ring-opacity-75 flex items-center justify-center gap-x-2 rounded-lg bg-green-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition duration-300 ease-in-out hover:bg-green-700 hover:shadow-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
      >
        <Eye size={24} />
        <span className="hidden md:block">Previsualizar Nota</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onBackdropClick}
        >
          <div
            className="animate-scale-in relative max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar */}
            <button
              className="absolute top-4 right-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
              onClick={closeModal}
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>

            <div className="p-6 md:p-10">
              {/* Cabecera del Documento */}
              <div className="mb-6 flex flex-col justify-between border-b border-gray-200 pb-6 md:flex-row md:items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Building2 size={32} className="text-gray-600" />
                    <h3 className="text-xl font-bold text-gray-800">
                      {nombreEmpresa}
                    </h3>
                  </div>
                  <p className="text-gray-500">
                    RUC: {notaCreditoDebito.empresa_Ruc}
                  </p>
                </div>
                <div className="mt-4 text-left md:mt-0 md:text-right">
                  <div className="mb-2 flex items-center gap-2">
                    <ReceiptText size={28} className="text-indigo-600" />
                    <span className="text-2xl font-extrabold text-indigo-700 uppercase">
                      {getTipoDocumentoLabel(notaCreditoDebito.tipo_Doc)}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${isNotaDebito ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                  >
                    {getTipoDocumentoLabel(notaCreditoDebito.tipo_Doc)}
                  </span>
                </div>
              </div>

              {/* Contenido principal - Grilla */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Sección de Comprobantes Relacionados */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-700">
                    <Tag size={20} className="text-blue-500" />
                    Datos Relacionados
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-gray-600">
                        Comprobante Afectado:
                      </p>
                      <p className="text-gray-800">{`${getTipoDocumentoLabel(notaCreditoDebito.afectado_Tipo_Doc)} - ${notaCreditoDebito.afectado_Num_Doc}`}</p>
                    </div>{" "}
                    <div>
                      <p className="font-semibold text-gray-600">
                        Fecha de Emision:
                      </p>
                      <p className="text-gray-800">{`${formatearFecha(notaCreditoDebito.fecha_Emision_Afectado)}`}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600">Cliente:</p>
                      <p className="text-gray-800">{`${getTipoDocCliente(notaCreditoDebito.cliente_Tipo_Doc)} - ${notaCreditoDebito.cliente_Num_Doc}`}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-600">
                        Tipo de Operación:
                      </p>
                      <p className="text-gray-800">
                        {getTipoOperacionLabel(
                          notaCreditoDebito.tipo_Operacion,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sección de Detalles de la Nota */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-700">
                    <FileText size={20} className="text-green-500" />
                    Detalles de la Nota
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-gray-600">Motivo:</p>
                      <p className="text-gray-800">
                        {getMotivoLabel(
                          notaCreditoDebito.motivo_Cod,
                          notaCreditoDebito.tipo_Doc,
                        )}
                      </p>
                    </div>
                    {/* <div>
                                            <p className="font-semibold text-gray-600">Descripción Motivo:</p>
                                            <p className="text-gray-800 italic">{notaCreditoDebito.motivo_Des || "Sin observaciones adicionales."}</p>
                                        </div> */}
                    <div>
                      <p className="font-semibold text-gray-600">
                        Observación:
                      </p>
                      <p className="text-gray-800 italic">
                        {notaCreditoDebito.Observacion ||
                          "Sin observaciones adicionales."}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                      <p className="font-semibold text-gray-600">Total:</p>
                      <p className="text-2xl font-extrabold text-indigo-700">
                        {formatCurrency(notaCreditoDebito.monto_Imp_Venta)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- End Invoice Detail --- */}
              <div className="flex w-full justify-end pt-5">
                <EnviarNota
                  open={open}
                  setOpen={setOpen}
                  ClosePreviu={closeModal}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
