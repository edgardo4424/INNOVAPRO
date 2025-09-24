import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DocumentoSkeleton from "../../bandeja/list-factura-boleta/components/DocumentoSkeleton";
import { getDescripcion } from "../../emitir/factura-boleta/utils/codDetraccion";
import facturaService from "../../service/FacturaService";

export default function ModalVisualizarDocumento({
  setModalOpen,
  documentoAVisualizar,
  setDocumentoAVisualizar,
}) {
  const [factura, setFactura] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  // ** METODO VISUALIZAR DOCUMENTO CON ENDPOINT DE INNOVA
  useEffect(() => {
    if (!isOpen || !documentoAVisualizar) return;

    (async () => {
      try {
        const { succes, status, message, data } =
          await facturaService.obtenerFacturaDetallada(documentoAVisualizar);
        if (succes && status === 200) {
          setFactura(data[0]);
          return;
        }
      } catch (e) {
        toast.error(e.response.data.message || "Error al obtener el documento");
        closeModal();
      }
    })();
  }, [isOpen, documentoAVisualizar]);

  let pagosTabla;

  let documentoRelacionados = [];
  let detallesExtra;
  let cuotasReales;
  if (factura?.relDocs) {
    documentoRelacionados = JSON.parse(factura.relDocs);
  }
  if (factura?.extraDetails) {
    detallesExtra = JSON.parse(factura.extraDetails);
  }
  if (factura?.cuotas_Real) {
    pagosTabla = JSON.parse(factura.cuotas_Real);
  } else if (factura?.forma_pago) {
    pagosTabla = factura.forma_pago;
  }

  // Helpers
  const closeModal = () => {
    setIsOpen(false);
    setModalOpen?.(false);
    setDocumentoAVisualizar?.({});
  };

  const onBackdropClick = (e) => {
    // Cierra solo si el click fue en el backdrop
    if (e.target === e.currentTarget) closeModal();
  };

  const currency = (value, code = "PEN") => {
    const n = Number(value ?? 0);
    try {
      return new Intl.NumberFormat("es-PE", {
        style: "currency",
        // currency: code || "PEN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(n);
    } catch {
      return `${n.toFixed(2)}`;
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      // hour: "2-digit",
      // minute: "2-digit",
    });
  };

  const tipoDocLabel = (code) => {
    switch (code) {
      case "01":
        return "FACTURA ELECTRÓNICA";
      case "03":
        return "BOLETA DE VENTA ELECTRÓNICA";
      case "07":
        return "NOTA DE CRÉDITO ELECTRÓNICA";
      case "08":
        return "NOTA DE DÉBITO ELECTRÓNICA";
      default:
        return "DOCUMENTO ELECTRÓNICO";
    }
  };

  const tipoDocCliente = (code) => {
    switch (String(code)) {
      case "6":
        return "RUC";
      case "1":
        return "DNI";
      case "4":
        return "CARNET DE EXTRANJERÍA";
      default:
        return "OTRO";
    }
  };

  const numeroDoc = useMemo(() => {
    if (!factura) return "";
    return `${factura.serie ?? ""}-${String(factura.correlativo ?? "").padStart(1, "0")}`;
  }, [factura]);

  if (!isOpen) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px]"
      onClick={onBackdropClick}
    >
      <div
        // ref={cardRef}
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-5xl rounded-2xl bg-white p-1 shadow-2xl ${factura?.estado === "ANULADA" || factura?.estado === "ANULADA-NOTA" ? "border-4 border-red-500" : ""} animate-scale-in max-h-[95vh] overflow-y-auto`}
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
          {!factura ? (
            <DocumentoSkeleton />
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="rounded-xl border border-gray-200 bg-white">
                <div className="grid grid-cols-1 items-start gap-6 px-6 py-6 md:grid-cols-3 md:py-8">
                  <div className="col-span-2">
                    <h1 className="text-2xl font-bold text-blue-700 md:text-3xl">
                      {factura.empresa_nombre}
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                      {factura.empresa_ruc}
                    </p>
                    <p className="text-sm text-gray-700">
                      {factura.empresa_direccion}
                    </p>
                  </div>
                  <div className="md:text-center">
                    <p className="text-lg font-semibold text-gray-700">
                      {tipoDocLabel(factura.tipo_doc)}
                    </p>
                    <p className="text-2xl font-extrabold tracking-wide text-gray-700">
                      {numeroDoc}
                    </p>
                    <p className="mt-4 text-sm text-gray-600">
                      <span className="font-semibold">Fecha de emisión: </span>
                      {formatDateTime(factura.fecha_Emision)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cliente + Pago (dos columnas) */}
              <div className="rounded-xl border border-gray-200 bg-white">
                <div
                  className={`grid grid-cols-1 ${documentoRelacionados.length > 0 || factura.orden_compra !== "" ? "md:grid-cols-7" : "md:grid-cols-5"} gap-x-2 p-6`}
                >
                  <div className="col-span-3">
                    <h3 className="mb-3 text-sm font-bold text-gray-600">
                      CLIENTE
                    </h3>
                    <div className="space-y-1 text-sm text-gray-800">
                      <div className="grid grid-cols-[100px_1fr] gap-x-2">
                        <span className="font-semibold text-gray-700">
                          Razón social:
                        </span>
                        <span className="font-medium">
                          {factura.cliente_Razon_Social || "—"}
                        </span>
                        <span className="font-semibold text-gray-700">
                          Dirección:
                        </span>
                        <span className="font-medium">
                          {factura.cliente_Direccion || "—"}
                        </span>
                        <span className="font-semibold text-gray-700">
                          Tipo doc.:
                        </span>
                        <span className="font-medium">
                          {tipoDocCliente(factura.cliente_Tipo_Doc)}
                        </span>
                        <span className="font-semibold text-gray-700">
                          Número doc.:
                        </span>
                        <span className="font-medium">
                          {factura.cliente_Num_Doc || "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <h3 className="mb-3 text-sm font-bold text-gray-600">
                      DETALLES DEL PAGO
                    </h3>
                    <div className="space-y-1 text-sm text-gray-800">
                      <div className="grid grid-cols-[151px_1fr] gap-x-2">
                        <span className="font-semibold text-gray-700">
                          Moneda:
                        </span>
                        <span className="font-medium">
                          {factura.tipo_Moneda}
                        </span>
                        <span className="font-semibold text-gray-700">
                          Total:
                        </span>
                        <span className="font-medium">
                          {currency(factura.sub_Total, factura.tipo_Moneda)}
                        </span>
                        {factura.forma_pago_facturas[0].tipo.toUpperCase() ===
                        "CREDITO" ? (
                          <>
                            <span className="font-semibold text-gray-700">
                              Tipo de pago:
                            </span>
                            <span className="font-medium">
                              {factura.forma_pago_facturas[0].tipo.toUpperCase()}{" "}
                              {factura.dias_pagar !== "" &&
                                `${factura.dias_pagar} DIAS`}{" "}
                            </span>
                            <span className="font-semibold text-gray-700">
                              Fecha de vencimiento:
                            </span>
                            <span className="font-medium">
                              {formatDateTime(factura.fecha_vencimiento)}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-semibold text-gray-700">
                              Tipo de pago:
                            </span>
                            <span className="font-medium">
                              {factura.forma_pago_facturas[0].tipo.toUpperCase()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={` ${documentoRelacionados.length > 0 || factura.orden_compra !== "" ? "" : "hidden"} col-span-2 flex flex-col`}
                  >
                    <h3 className="mb-3 text-sm font-bold text-gray-600">
                      DOCUMENTOS RELACIONADOS
                    </h3>
                    <div className="space-y-1 text-sm text-gray-800">
                      <div className="grid grid-cols-[85px_1fr] gap-x-2">
                        {documentoRelacionados.map((doc, index) => (
                          <>
                            <span className="font-semibold text-gray-700">
                              Nro. doc:
                            </span>
                            <span className="font-medium">
                              {doc.nroDoc ?? "—"}
                            </span>
                          </>
                        ))}
                        {factura.orden_compra !== "" && (
                          <>
                            <span className="font-semibold text-gray-700">
                              Nro. Orden:
                            </span>
                            <span className="font-medium">
                              {factura.orden_compra ?? "—"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla de items */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="grid grid-cols-12 bg-gray-100 px-6 py-3 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                  <div className="col-span-2">Código</div>
                  <div className="col-span-4">Producto</div>
                  <div className="col-span-2 text-center">Precio unitario</div>
                  <div className="col-span-2 text-center">Cantidad</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>

                <div className="divide-y divide-gray-200">
                  {(factura.detalle_facturas?.length
                    ? factura.detalle_facturas
                    : []
                  ).map((it, idx) => {
                    const {
                      id,
                      factura_id,
                      unidad,
                      cantidad,
                      cod_Producto,
                      descripcion,
                      monto_Valor_Unitario,
                      monto_Base_Igv,
                      porcentaje_Igv,
                      igv,
                      tip_Afe_Igv,
                      total_Impuestos,
                      monto_Precio_Unitario,
                      monto_Valor_Venta,
                      factor_Icbper,
                    } = it;

                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-12 px-6 py-3 text-sm text-gray-800"
                      >
                        <div className="col-span-2">{cod_Producto || "—"}</div>
                        <div className="col-span-4">{descripcion}</div>
                        <div className="col-span-2 text-center">
                          {currency(monto_Valor_Unitario, factura.tipo_moneda)}
                        </div>
                        <div className="col-span-2 text-center">
                          {Number(cantidad ?? 0).toFixed(2) + " " + unidad}
                        </div>
                        <div className="col-span-2 text-center font-medium">
                          {currency(monto_Precio_Unitario, factura.tipo_moneda)}
                        </div>
                      </div>
                    );
                  })}

                  {!factura.detalle_facturas?.length && (
                    <div className="px-6 py-6 text-center text-sm text-gray-500">
                      No hay productos en el detalle.
                    </div>
                  )}
                </div>
              </div>

              {/* Leyenda + Totales */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Leyenda/nota */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <div className="text-sm">
                    <span className="font-semibold">Leyenda:</span>
                    <p className="mt-2 text-gray-800">
                      {factura.legend_facturas?.[0]?.legend_Value ?? "—"}
                    </p>
                  </div>
                </div>

                {/* Totales */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Op. gravadas:</span>
                      <span className="font-medium">
                        {currency(
                          factura.monto_Oper_Gravadas,
                          factura.tipo_Moneda,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IGV:</span>
                      <span className="font-medium">
                        {currency(factura.total_Impuestos, factura.tipo_Moneda)}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between border-t pt-3 text-base font-bold">
                      <span>Precio de venta:</span>
                      <span>
                        {currency(factura.sub_Total, factura.tipo_Moneda)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observacion */}
              {factura.Observacion && (
                <div className="mt-4 rounded-md border border-gray-200 p-4 pt-2">
                  <h3 className="text-md mb-2 font-bold text-gray-600">
                    Obesvaciones:
                  </h3>
                  <p className="text-sm text-gray-800">{factura.Observacion}</p>
                </div>
              )}

              {/* Detalles Extra */}
              {detallesExtra && (
                <div className="mt-4 rounded-md border border-gray-200 p-4 pt-2">
                  <h3 className="text-md mb-2 font-bold text-gray-600">
                    Detalles Extra:
                  </h3>
                  <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                    {detallesExtra.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <p className="text-sm font-semibold text-gray-800">
                          {item.detalle}
                        </p>
                        <p className="text-sm text-gray-800">{item.valor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Retencion */}
              {factura.descuento_monto_base &&
                factura.descuento_factor &&
                factura.descuento_monto && (
                  <div className="mt-4 rounded-md border border-gray-200 p-4 pt-2">
                    <h3 className="text-md mb-2 flex items-center gap-x-4 font-bold text-gray-600">
                      RETENCION:
                    </h3>
                    <div className="grid grid-cols-4 gap-x-10 gap-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm font-semibold text-gray-800">
                          Base del descuento
                        </p>
                        <p className="text-sm text-gray-800">
                          {factura.descuento_monto_base}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm font-semibold text-gray-800">
                          Factor del descuento
                        </p>
                        <p className="text-sm text-gray-800">
                          {factura.descuento_factor}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm font-semibold text-gray-800">
                          Monto del descuento
                        </p>
                        <p className="text-sm text-gray-800">
                          {factura.descuento_monto}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm font-semibold text-gray-800">
                          Monto Neto a Pagar
                        </p>
                        <p className="text-sm text-gray-800">
                          {factura.monto_Imp_Venta - factura.descuento_monto}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      {factura.tipo_Moneda == "USD" && (
                        <p className="py-2 text-sm text-gray-400">
                          *la retencion siempre se aplica en soles, a pesar que
                          la factura esta en dolares*
                        </p>
                      )}
                    </div>
                  </div>
                )}

              {/* Detraccion */}
              {factura.tipo_Operacion == "1001" && (
                <div className="mt-4 rounded-md border border-gray-200 p-4 pt-2">
                  <h3 className="text-md mb-2 font-bold text-gray-600">
                    DETRACCION:
                  </h3>
                  <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-semibold text-gray-800">
                        Cta. Cte. Banco
                      </p>
                      <p className="text-sm text-gray-800">
                        {factura.detraccion_cta_banco}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-semibold text-gray-800">
                        Detraccion ({factura.detraccion_percent}%)
                      </p>
                      <p className="text-sm text-gray-800">
                        {factura.detraccion_mount}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="min-w-[130px] text-sm font-semibold text-gray-800">
                        Bien o Servicio
                      </p>
                      <p className="text-sm text-gray-800">
                        {getDescripcion(
                          factura.detraccion_cod_bien_detraccion,
                        ) || ""}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-semibold text-gray-800">
                        Neto a Pagar
                      </p>
                      <p className="text-sm text-gray-800">
                        {(
                          factura.monto_Imp_Venta - factura.detraccion_mount
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabla de pagos */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="grid grid-cols-4 bg-gray-100 px-6 py-3 text-xs font-semibold tracking-wide text-gray-600 uppercase">
                  <div className="col-span-1 text-center">Cuota</div>
                  <div className="col-span-1 text-center">Tipo</div>
                  <div className="col-span-1 text-center">Monto</div>
                  <div className="col-span-1 text-center">Fecha</div>
                </div>

                <div className="divide-y divide-gray-200">
                  {(pagosTabla?.length ? pagosTabla : []).map((it, idx) => {
                    const { id, factura_id, tipo, monto, cuota, fecha_Pago } =
                      it;

                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-4 px-6 py-3 text-sm text-gray-800"
                      >
                        <div className="col-span-1 text-center">{cuota}</div>
                        <div className="col-span-1 text-center">{tipo}</div>
                        <div className="col-span-1 text-center">
                          {currency(monto, factura.tipo_Moneda)}
                        </div>
                        <div className="col-span-1 text-center">
                          {formatDateTime(fecha_Pago)}
                        </div>
                      </div>
                    );
                  })}

                  {!factura.forma_pago_facturas?.length && (
                    <div className="px-6 py-6 text-center text-sm text-gray-500">
                      No hay pagos en el detalle.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
