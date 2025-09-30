import { X } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DocumentoSkeleton from "../../bandeja/list-factura-boleta/components/DocumentoSkeleton";
import facturaService from "../../service/FacturaService";
import {
  formatDateTime,
  getCodigoTraslado,
  getModalidadTrasladoLabel,
  getTipoDocCliente,
  getTipoDocDescription,
} from "../../utils/formateos";

export default function ModalVisualizarGuia({
  setModalOpen,
  documentoAVisualizar,
  setDocumentoAVisualizar,
}) {
  const [guia, setGuia] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  // Helpers
  const closeModal = () => {
    setIsOpen(false);
    setModalOpen?.(false);
    setDocumentoAVisualizar?.({});
  };

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  // ** METODO VISUALIZAR DOCUMENTO CON ENDPOINT DE INNOVA
  useEffect(() => {
    if (!isOpen || !documentoAVisualizar) return;

    (async () => {
      try {
        const { succes, status, message, data } =
          await facturaService.obtenerGuiaDetallada(documentoAVisualizar);
        console.log(data);
        if (succes && status === 200) {
          console.log("data", data[0]);
          setGuia(data[0]);
          return;
        }
      } catch (e) {
        console.log(e);
        toast.error(e.response.data.message || "Error al obtener el documento");
        closeModal();
      }
    })();
  }, [isOpen, documentoAVisualizar]);

  const numeroDoc = useMemo(() => {
    if (!guia) return "";
    return `${guia.serie ?? ""}-${String(guia.correlativo ?? "").padStart(1, "0")}`;
  }, [guia]);

  if (!isOpen) return null;

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
        <div className="p-6 md:p-8">
          {!guia ? (
            <DocumentoSkeleton />
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="rounded-xl border border-gray-200 bg-white">
                <div className="grid grid-cols-1 items-start gap-6 px-6 py-6 md:grid-cols-3 md:py-8">
                  <div className="col-span-2">
                    <h1 className="text-2xl font-bold text-blue-700 md:text-3xl">
                      {guia.empresa_nombre}
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                      RUC: {guia.empresa_Ruc}
                    </p>
                    <p className="text-sm text-gray-700">
                      {guia.empresa_direccion}
                    </p>
                  </div>
                  <div className="md:text-center">
                    <p className="text-lg font-semibold text-gray-700">
                      {getTipoDocDescription(guia.tipo_Doc)}
                    </p>
                    <p className="text-2xl font-extrabold tracking-wide text-gray-700">
                      {numeroDoc}
                    </p>
                    <p className="mt-4 text-sm text-gray-600">
                      <span className="font-semibold">Fecha de emisión: </span>
                      {formatDateTime(guia.fecha_Emision)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cliente */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-sm font-bold text-gray-600">
                  DATOS DEL CLIENTE
                </h3>
                <div className="grid grid-cols-1 space-y-1 text-sm text-gray-800 md:grid-cols-2">
                  <div className="grid grid-cols-[120px_1fr] gap-x-2">
                    <span className="font-semibold text-gray-700">
                      Razón social:
                    </span>
                    <span className="font-medium">
                      {guia.cliente_Razon_Social || "—"}
                    </span>
                    <span className="font-semibold text-gray-700">
                      Dirección:
                    </span>
                    <span className="font-medium">
                      {guia.cliente_Direccion || "—"}
                    </span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-around">
                    <div className="grid grid-cols-2 gap-x-2">
                      <span className="font-semibold text-gray-700">
                        Tipo doc.:
                      </span>
                      <span className="font-medium">
                        {getTipoDocCliente(guia.cliente_Tipo_Doc)}
                      </span>
                      <span className="font-semibold text-gray-700">
                        Número doc.:
                      </span>
                      <span className="font-medium">
                        {guia.cliente_Num_Doc || "—"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2">
                      <span className="font-semibold text-gray-700">Obra:</span>
                      <span className="font-medium">{guia.obra || "—"}</span>
                      <span className="font-semibold text-gray-700">
                        Contrato:
                      </span>
                      <span className="font-medium">
                        {guia.nro_contrato || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Datos de la Guía de Remisión */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 text-sm font-bold text-gray-600">
                  DATOS DE ENVÍO
                </h3>
                <div className="grid grid-cols-1 gap-x-10 gap-y-4 text-sm text-gray-800 md:grid-cols-3">
                  <div className="space-y-1">
                    <div className="grid grid-cols-[140px_1fr] gap-x-2">
                      <span className="font-semibold text-gray-700">
                        Fecha de traslado:
                      </span>
                      <span className="font-medium">
                        {formatDateTime(guia.guia_Envio_Fec_Traslado)}
                      </span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] gap-x-2">
                      <span className="font-semibold text-gray-700">
                        Modalidad de traslado:
                      </span>
                      <span className="font-medium">
                        {getModalidadTrasladoLabel(
                          guia.guia_Envio_Mod_Traslado,
                        )}
                      </span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] gap-x-2">
                      <span className="font-semibold text-gray-700">
                        Motivo de traslado:
                      </span>
                      <span className="font-medium">
                        {getCodigoTraslado(guia.guia_Envio_Cod_Traslado)}
                      </span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] gap-x-2">
                      <span className="font-semibold text-gray-700">
                        Peso total:
                      </span>
                      <span className="font-medium">
                        {guia.guia_Envio_Peso_Total}{" "}
                        {guia.guia_Envio_Und_Peso_Total}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <div className="grid grid-cols-[140px_1fr] gap-x-2">
                      <span className="font-semibold text-gray-700">
                        Punto de partida:
                      </span>
                      <span className="font-medium">
                        {guia.guia_Envio_Partida_Direccion}
                      </span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] gap-x-2">
                      <span className="font-semibold text-gray-700">
                        Punto de llegada:
                      </span>
                      <span className="font-medium">
                        {guia.guia_Envio_Llegada_Direccion}
                      </span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] gap-x-2">
                      <span className="font-semibold text-gray-700">
                        Placa de vehículo:
                      </span>
                      <span className="font-medium">
                        {guia.guia_Envio_Vehiculo_Placa || "—"}
                      </span>
                    </div>
                    {(guia.guia_choferes && guia.guia_choferes.length > 0) ||
                    (guia.guia_transportista &&
                      Object.keys(guia.guia_transportista).length > 0) ? (
                      <Fragment>
                        {guia.guia_choferes &&
                          guia.guia_choferes.length > 0 &&
                          guia.guia_choferes.map((chofer, index) => (
                            <Fragment key={index}>
                              <div className="grid grid-cols-[140px_1fr] gap-x-2">
                                <span className="font-semibold text-gray-700">
                                  {chofer.nro_mtc ? "Transportista" : "Chofer"}:
                                </span>
                                <p className="grid grid-cols-1 font-medium">
                                  {chofer.nombres && (
                                    <span>
                                      {chofer.nombres} {chofer.apellidos}
                                    </span>
                                  )}
                                  {chofer.razon_Social && (
                                    <span>
                                      {" "}
                                      {chofer.razon_Social}-{chofer.nro_doc}
                                    </span>
                                  )}
                                  {chofer.nro_doc && !chofer.razon_Social && (
                                    <span> ({chofer.nro_doc})</span>
                                  )}
                                  {chofer.nro_mtc && (
                                    <span> (MTC {chofer.nro_mtc})</span>
                                  )}
                                </p>
                              </div>
                            </Fragment>
                          ))}
                        {guia.guia_transportista &&
                          Object.keys(guia.guia_transportista).length > 0 && (
                            <div className="grid grid-cols-[140px_1fr] gap-x-2">
                              <span className="font-semibold text-gray-700">
                                Transportista:
                              </span>
                              <span className="font-medium">
                                {guia.guia_transportista.Razon_Social} (
                                {guia.guia_transportista.Num_Doc})
                              </span>
                            </div>
                          )}
                      </Fragment>
                    ) : (
                      <div className="grid grid-cols-[140px_1fr] gap-x-2">
                        <span className="font-semibold text-gray-700">
                          Transportista/Chofer:
                        </span>
                        <span className="font-medium">—</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabla de items */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="grid grid-cols-12 bg-gray-100 px-6 py-3 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                  <div className="col-span-2">Código</div>
                  <div className="col-span-7">Producto</div>
                  <div className="col-span-1 text-right">Cantidad</div>
                  <div className="col-span-2 text-right">Unidad</div>
                </div>

                <div className="divide-y divide-gray-200">
                  {(guia.guia_detalles?.length ? guia.guia_detalles : []).map(
                    (it, idx) => {
                      const { cod_Producto, descripcion, cantidad, unidad } =
                        it;

                      return (
                        <div
                          key={idx}
                          className="grid grid-cols-12 px-6 py-3 text-sm text-gray-800"
                        >
                          <div className="col-span-2">
                            {cod_Producto || "—"}
                          </div>
                          <div className="col-span-7">{descripcion}</div>
                          <div className="col-span-1 text-right">
                            {Number(cantidad ?? 0).toFixed(2)}
                          </div>
                          <div className="col-span-2 text-right font-medium">
                            {unidad}
                          </div>
                        </div>
                      );
                    },
                  )}

                  {!guia.guia_detalles?.length && (
                    <div className="px-6 py-6 text-center text-sm text-gray-500">
                      No hay productos en el detalle.
                    </div>
                  )}
                </div>
              </div>

              {/* Observacion */}
              {guia.observacion && (
                <div className="mt-4 rounded-md border border-gray-200 p-4 pt-2">
                  <h3 className="text-md mb-2 font-bold text-gray-600">
                    Observaciones:
                  </h3>
                  <p className="text-sm text-gray-800">{guia.observacion}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
