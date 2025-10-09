import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DocumentoSkeleton from "../../bandeja/list-factura-boleta/components/DocumentoSkeleton";
import facturaService from "../../service/FacturaService";
import {
  formatDateTime,
  getMotivoLabel,
  getTipoDocCliente,
  getTipoDocLabel,
} from "../../utils/formateos";

export default function ModalVizualizarNota({
  setModalOpen,
  documentoAVisualizar,
  setDocumentoAVisualizar,
}) {
  const [nota, setNota] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  // Helpers
  const closeModal = () => {
    setIsOpen(false);
    setModalOpen(false);
    setDocumentoAVisualizar({});
  };

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  // Obtener la nota detallada con endpoint
  useEffect(() => {
    if (
      !isOpen ||
      !documentoAVisualizar ||
      Object.keys(documentoAVisualizar).length === 0
    ) {
      return;
    }

    const fetchNota = async () => {
      try {
        const { succes, status, message, data } =
          await facturaService.obtenerNotaDetallada(documentoAVisualizar);
        if (succes && status === 200) {
          setNota(data[0]);
          console.log(data[0]);
          return;
        }
        toast.error(message || "Error al obtener el documento");
        closeModal();
      } catch (e) {
        console.error("Error fetching nota:", e);
        toast.error(
          e.response?.data?.message || "Error al obtener el documento",
        );
        closeModal();
      }
    };

    fetchNota();
  }, [isOpen, documentoAVisualizar]);

  // Se usa un memo para calcular el número de documento solo cuando 'nota' cambia.
  const numeroDoc = useMemo(() => {
    if (!nota) return "";
    const { serie, correlativo } = nota;
    return `${serie ?? ""}-${String(correlativo ?? "").padStart(5, "0")}`;
  }, [nota]);

  if (!isOpen) {
    return null;
  }

  // Si no hay nota, se muestra el esqueleto de carga
  if (!nota) {
    return <DocumentoSkeleton />;
  }

  const {
    empresa_nombre,
    empresa_Ruc,
    empresa_direccion,
    tipo_Doc,
    fecha_Emision,
    cliente_Razon_Social,
    cliente_Direccion,
    cliente_Tipo_Doc,
    cliente_Num_Doc,
    afectado_Num_Doc,
    fecha_Emision_Afectado,
    motivo_Cod,
    motivo_Des,
    detalle_nota_cre_debs,
    tipo_Moneda,
    sub_Total,
    monto_Igv,
    monto_Oper_Gravadas,
    monto_Oper_Exoneradas,
    monto_Imp_Venta,
    Observacion,
  } = nota;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px]"
      onClick={onBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="animate-scale-in relative max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-gray-100 bg-white p-1 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X close */}
        <button
          className="absolute top-2 right-2 cursor-pointer rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
          aria-label="Cerrar"
          onClick={closeModal}
        >
          <X size={20} />
        </button>

        {/* Contenido */}
        <div className="space-y-6 p-6 md:p-8">
          {/* Header */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
              <div className="col-span-2">
                <h1 className="text-2xl font-bold text-blue-700 md:text-3xl">
                  {empresa_nombre}
                </h1>
                <p className="mt-2 text-sm text-gray-700">{empresa_Ruc}</p>
                <p className="text-sm text-gray-700">{empresa_direccion}</p>
              </div>
              <div className="md:text-center">
                <p className="text-lg font-semibold text-gray-700">
                  {getTipoDocLabel(tipo_Doc)}
                </p>
                <p className="text-2xl font-extrabold tracking-wide text-gray-700">
                  {numeroDoc}
                </p>
                <p className="mt-4 text-sm text-gray-600">
                  <span className="font-semibold">Fecha de emisión: </span>
                  {formatDateTime(fecha_Emision)}
                </p>
              </div>
            </div>
          </div>

          {/* Cliente y Documento Afectado */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-3 text-sm font-bold text-gray-600">
              DATOS DEL CLIENTE Y DOCUMENTO AFECTADO
            </h3>
            <div className="grid grid-cols-1 gap-x-10 gap-y-4 text-sm text-gray-800 md:grid-cols-2">
              <div className="space-y-1">
                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                  <span className="font-semibold text-gray-700">
                    Razón social:
                  </span>
                  <span className="font-medium">
                    {cliente_Razon_Social || "—"}
                  </span>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                  <span className="font-semibold text-gray-700">
                    Dirección:
                  </span>
                  <span className="font-medium">
                    {cliente_Direccion || "—"}
                  </span>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                  <span className="font-semibold text-gray-700">
                    Tipo doc.:
                  </span>
                  <span className="font-medium">
                    {getTipoDocCliente(cliente_Tipo_Doc)}
                  </span>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                  <span className="font-semibold text-gray-700">
                    Número doc.:
                  </span>
                  <span className="font-medium">{cliente_Num_Doc || "—"}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                  <span className="font-semibold text-gray-700">
                    Doc. afectado:
                  </span>
                  <span className="font-medium">{afectado_Num_Doc || "—"}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                  <span className="font-semibold text-gray-700">
                    Fecha emisión:
                  </span>
                  <span className="font-medium">
                    {formatDateTime(fecha_Emision_Afectado) || "—"}
                  </span>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                  <span className="font-semibold text-gray-700">Motivo:</span>
                  <span className="font-medium">
                    {getMotivoLabel(tipo_Doc, motivo_Cod)}
                  </span>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-x-2">
                  <span className="font-semibold text-gray-700">
                    Desc. Motivo:
                  </span>
                  <span className="font-medium">{motivo_Des || "—"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de items */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="grid grid-cols-12 bg-gray-100 px-6 py-3 text-xs font-semibold tracking-wide text-gray-600 uppercase">
              <div className="col-span-2">Código</div>
              <div className="col-span-3">Descripción</div>
              <div className="col-span-1 text-right">Cantidad</div>
              <div className="col-span-1 text-center">Unidad</div>
              <div className="col-span-2 text-right">Valor Unitario</div>
              <div className="col-span-1 text-right">IGV</div>
              <div className="col-span-2 text-right">Monto Precio</div>
            </div>

            <div className="divide-y divide-gray-200">
              {(detalle_nota_cre_debs?.length ? detalle_nota_cre_debs : []).map(
                (it, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 px-6 py-3 text-sm text-gray-800"
                  >
                    <div className="col-span-2">{it.cod_Producto || "—"}</div>
                    <div className="col-span-3">{it.descripcion}</div>
                    <div className="col-span-1 text-right">
                      {Number(it.cantidad ?? 0).toFixed(2)}
                    </div>
                    <div className="col-span-1 text-center">{it.unidad}</div>
                    <div className="col-span-2 text-right">
                      {Number(it.monto_Valor_Unitario ?? 0).toFixed(2)}
                    </div>
                    <div className="col-span-1 text-right">
                      {Number(it.igv ?? 0).toFixed(2)}
                    </div>
                    <div className="col-span-2 text-right">
                      {Number(it.monto_Precio_Unitario ?? 0).toFixed(2)}
                    </div>
                  </div>
                ),
              )}
              {(!detalle_nota_cre_debs ||
                detalle_nota_cre_debs.length === 0) && (
                <div className="px-6 py-6 text-center text-sm text-gray-500">
                  No hay productos en el detalle.
                </div>
              )}
            </div>
          </div>

          {/* Totales */}
          <div className="flex flex-col items-end">
            <div className="w-full space-y-1 text-sm text-gray-800 md:w-1/2">
              <div className="flex justify-between font-semibold">
                <span>Gravados:</span>
                <span>
                  {tipo_Moneda} {Number(monto_Oper_Gravadas).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Exonerados:</span>
                <span>
                  {tipo_Moneda} {Number(monto_Oper_Exoneradas).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>IGV (18%):</span>
                <span>
                  {tipo_Moneda} {Number(monto_Igv).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-2 text-lg font-bold text-blue-700">
                <span>Total:</span>
                <span>
                  {tipo_Moneda} {Number(monto_Imp_Venta).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Observacion */}
          {Observacion && (
            <div className="mt-4 rounded-md border border-gray-200 p-4 pt-2">
              <h3 className="text-md mb-2 font-bold text-gray-600">
                Observaciones:
              </h3>
              <p className="text-sm text-gray-800">{Observacion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
