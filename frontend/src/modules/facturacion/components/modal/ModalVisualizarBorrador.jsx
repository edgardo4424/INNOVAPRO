import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import facturaService from "../../service/FacturaService";
import { getDescripcion } from "../../emitir/factura-boleta/utils/codDetraccion";
import {
  formatDateTime,
  getTipoDocCliente,
  getTipoDocDescription,
} from "../../utils/formateos";

export default function ModalVisualizarBorrador({
  id_documento,
  setIdDocumento,
  setModalOpen,
}) {
  const [borrador, setBorrador] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  const closeModal = () => {
    setIsOpen(false);
    setIdDocumento("");
    setModalOpen(false);
  };

  // Función para formatear números a 2 decimales
  const formatNumber = (number) => {
    return Number(number).toFixed(2);
  };

  useEffect(() => {
    if (!isOpen || !id_documento) return;

    const BuscarDocumento = async () => {
      try {
        const res = await facturaService.obtenerBorradorConId(id_documento);
        const { message, success, data } = res;

        if (!success) {
          toast.error(message || "No se pudo obtener el documento");
          return;
        }

        const rawBorrador = JSON.parse(data.body);

        // Mapeamos las propiedades al formato que queremos usar
        const borradorMapeado = {
          id: rawBorrador.id,
          //   ?? datos del comprobante
          tipo_Operacion: rawBorrador?.tipo_Operacion || "",
          tipo_doc: rawBorrador?.tipo_Doc || "",
          serie: rawBorrador?.serie || "",
          correlativo: rawBorrador?.correlativo || "",
          fecha_emision: rawBorrador?.fecha_Emision || "",
          empresa_ruc: rawBorrador?.empresa_Ruc || "",
          tipo_moneda: rawBorrador?.tipo_Moneda || "",
          observacion:
            rawBorrador?.observacion || rawBorrador?.Observacion || "",
          relDocs: rawBorrador?.relDocs || [],
          orden_compra: rawBorrador?.orden_compra || "",
          detallesExtra: rawBorrador?.valores_Detalles_Extra || [],

          //   ?? datos del cliente
          cliente_tipo_doc: rawBorrador?.cliente_Tipo_Doc || "",
          cliente_num_doc: rawBorrador?.cliente_Num_Doc || "",
          cliente_razon_social: rawBorrador?.cliente_Razon_Social.trim() || "",
          cliente_direccion: rawBorrador?.cliente_Direccion || "",

          //   ?? montos
          monto_oper_gravadas: rawBorrador?.monto_Oper_Gravadas || 0,
          monto_oper_exoneradas: rawBorrador?.monto_Oper_Exoneradas || 0,
          monto_igv: rawBorrador?.monto_Igv || 0,
          total_impuestos: rawBorrador?.total_Impuestos || 0,
          valor_venta: rawBorrador?.valor_Venta || 0,
          sub_total: rawBorrador?.sub_Total || 0,
          monto_imp_venta: rawBorrador?.monto_Imp_Venta || 0,
          neto_pagar: rawBorrador?.neto_Pagar || 0,

          estado_documento: rawBorrador?.estado_Documento || "",

          manual: rawBorrador?.manual,
          usuario_id: rawBorrador?.usuario_id,

          //   ?? datos retecion
          descuento_cod_tipo:
            rawBorrador?.valores_Retencion?.descuento_cod_tipo || "",
          descuento_monto_base:
            rawBorrador.valores_Retencion?.descuento_monto_base || 0,
          descuento_factor:
            rawBorrador?.valores_Retencion?.descuento_factor || 0,
          descuento_monto: rawBorrador?.valores_Retencion?.descuento_monto || 0,
          retencion_activada: rawBorrador?.retencion_activada || false,

          // ?? datos de detraccion
          detraccion_cod_bien_detraccion:
            rawBorrador?.valores_Detraccion?.detraccion_cod_bien_detraccion,
          detraccion_cod_medio_pago:
            rawBorrador?.valores_Detraccion?.detraccion_cod_medio_pago,
          detraccion_cta_banco:
            rawBorrador?.valores_Detraccion?.detraccion_cta_banco,
          detraccion_percent:
            rawBorrador?.valores_Detraccion?.detraccion_percent,
          detraccion_mount: rawBorrador?.valores_Detraccion?.detraccion_mount,

          detalle: rawBorrador?.detalle ?? [],
          forma_pago: rawBorrador?.forma_pago ?? [],
          //   legend: rawBorrador?.legend ?? [],

          // ?? datos de nota
          afectado_Tipo_Doc: rawBorrador?.afectado_Tipo_Doc || "",
          afectado_Num_Doc: rawBorrador?.afectado_Num_Doc || "",
          fecha_Emision_Afectado: rawBorrador?.fecha_Emision_Afectado || "",
          motivo_Cod: rawBorrador?.motivo_Cod || "",
          motivo_Des: rawBorrador?.motivo_Des || "",

          empresa_razon_social: data?.empresa_razon_social,
          empresa_direccion: data?.empresa_direccion,
          empresa_telefono_oficina: data?.empresa_telefono_oficina,
          empresa_correo: data?.empresa_correo,
          empresa_cuenta_banco: data?.empresa_cuenta_banco,
          empresa_link_website: data?.empresa_link_website,
          empresa_codigo_ubigeo: data?.empresa_codigo_ubigeo,
        };

        setBorrador(borradorMapeado);
      } catch (e) {
        console.error(e);
        toast.error("Error al obtener el documento");
      }
    };

    BuscarDocumento();
  }, [isOpen, id_documento]);

  // Si el modal está cerrado o no hay datos, no renderizamos nada
  if (!isOpen || !borrador) {
    return null;
  }
  console.log(borrador);

  return (
    <>
      <div className="bg-opacity-10 animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
        <div className="animate-scale-in relative max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
          <button
            className="absolute top-4 right-4 text-gray-500 transition-colors duration-200 hover:text-red-600"
            onClick={closeModal}
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>

          <div className="text-center">
            <p className="md:text-md">
              Este documento es un borrador y puede ser modificado para emitir o
              eliminado.
            </p>
          </div>
          <div className="space-y-4 md:space-y-6">
            {/* Cabecera */}
            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="grid grid-cols-1 items-start gap-6 px-6 py-6 md:grid-cols-3 md:py-8">
                <div className="col-span-2">
                  <h1 className="text-md font-bold text-blue-700 md:text-3xl">
                    {borrador.empresa_razon_social}
                  </h1>
                  <p className="text-sm">{borrador.empresa_ruc}</p>
                  <p className="text-xs md:text-sm">
                    DIRECCIÓN: {borrador.empresa_direccion}
                  </p>
                </div>
                <div className="md:text-center">
                  <p className="text-sm font-bold md:text-lg">
                    {getTipoDocDescription(borrador.tipo_doc)}
                  </p>
                  <p className="text-sm font-extrabold tracking-wide text-gray-700 md:text-2xl">
                    {borrador.serie}-{borrador.correlativo}
                  </p>
                  <p>
                    Fecha de Emisión: {formatDateTime(borrador.fecha_emision)}
                  </p>
                </div>
              </div>
            </div>

            {/* Cliente */}
            <div className="rounded-xl border border-gray-200 bg-white">
              <div
                className={`grid grid-cols-1 ${borrador?.relDocs.length > 0 || borrador?.orden_compra !== "" ? "md:grid-cols-7" : "md:grid-cols-5"} gap-x-2 p-6`}
              >
                <div className="col-span-3">
                  <h3 className="mb-3 text-sm font-bold text-gray-600">
                    CLIENTE
                  </h3>
                  <div className="space-y-1 text-sm text-gray-800">
                    <div className="grid grid-cols-[110px_1fr] gap-x-2">
                      <span className="font-semibold text-gray-700">
                        Razón social:
                      </span>
                      <span className="font-medium">
                        {borrador.cliente_razon_social || "—"}
                      </span>
                      <span className="font-semibold text-gray-700">
                        Dirección:
                      </span>
                      <span className="font-medium">
                        {borrador.cliente_direccion || "—"}
                      </span>
                      <span className="font-semibold text-gray-700">
                        Tipo doc.:
                      </span>
                      <span className="font-medium">
                        {borrador.cliente_tipo_doc
                          ? getTipoDocCliente(borrador.cliente_tipo_doc)
                          : "—"}
                      </span>
                      <span className="font-semibold text-gray-700">
                        Número doc.:
                      </span>
                      <span className="font-medium">
                        {borrador.cliente_num_doc || "—"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* DETALLES DEL PAGO */}
                {borrador.tipo_doc === "01" || borrador.tipo_doc === "03" ? (
                  <>
                    <div className="col-span-2">
                      <h3 className="mb-3 text-sm font-bold text-gray-600">
                        DETALLES DEL PAGO
                      </h3>
                      <div className="space-y-1 text-sm text-gray-800">
                        <div className="grid grid-cols-[110px_1fr] gap-x-2">
                          <span className="font-semibold text-gray-700">
                            Moneda:
                          </span>
                          <span className="font-medium">
                            {borrador.tipo_moneda ?? "—"}
                          </span>
                          <span className="font-semibold text-gray-700">
                            Total:
                          </span>
                          <span className="font-medium">
                            {borrador.monto_imp_venta ?? "—"}
                          </span>
                          <span className="font-semibold text-gray-700">
                            Tipo de pago:
                          </span>
                          <span className="font-medium uppercase">
                            {borrador.forma_pago.length > 0
                              ? borrador.forma_pago[0].tipo
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={` ${borrador.relDocs.length > 0 || borrador.orden_compra !== "" ? "" : "hidden"} col-span-2 flex flex-col`}
                    >
                      <h3 className="mb-3 text-sm font-bold text-gray-600">
                        DOCUMENTOS RELACIONADOS
                      </h3>
                      <div className="space-y-1 text-sm text-gray-800">
                        <div className="grid grid-cols-[110px_1fr] gap-x-2">
                          {borrador.relDocs.map((doc, index) => (
                            <>
                              <span className="font-semibold text-gray-700">
                                Nro. doc:
                              </span>
                              <span className="font-medium">
                                {doc.nroDoc ?? "—"}
                              </span>
                            </>
                          ))}
                          {borrador.orden_compra !== "" && (
                            <>
                              <span className="font-semibold text-gray-700">
                                Nro. Orden:
                              </span>
                              <span className="font-medium">
                                {borrador.orden_compra ?? "—"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}

                {borrador.tipo_doc === "07" || borrador.tipo_doc === "08" ? (
                  <div className={`col-span-2 flex flex-col`}>
                    <h3 className="mb-3 text-sm font-bold text-gray-600">
                      DOCUMENTOS AFECTADO
                    </h3>
                    <div className="space-y-1 text-sm text-gray-800">
                      <div className="grid grid-cols-[110px_1fr] gap-x-2">
                        <span className="font-semibold text-gray-700">
                          Doc. afectado:
                        </span>
                        <span className="font-medium">
                          {borrador.afectado_Num_Doc || "—"}
                        </span>
                        <span className="font-semibold text-gray-700">
                          Fecha emisión:
                        </span>
                        <span className="font-medium">
                          {borrador.fecha_Emision_Afectado || "—"}
                        </span>
                        <span className="font-semibold text-gray-700">
                          Motivo:
                        </span>
                        <span className="font-medium">
                          {(borrador.tipo_Doc, borrador.motivo_Cod)}
                        </span>
                        <span className="font-semibold text-gray-700">
                          Desc. Motivo:
                        </span>
                        <span className="font-medium">
                          {borrador.motivo_Des || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Detalle */}
            <div className="mb-6">
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border-b px-4 py-2 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        Cant.
                      </th>
                      <th className="border-b px-4 py-2 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        Unidad
                      </th>
                      <th className="border-b px-4 py-2 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        Descripción
                      </th>
                      <th className="border-b px-4 py-2 text-right text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        V. Unit.
                      </th>
                      <th className="border-b px-4 py-2 text-right text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        P. Unit.
                      </th>
                      <th className="border-b px-4 py-2 text-right text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrador.detalle?.length ? (
                      borrador.detalle.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b last:border-b-0 hover:bg-gray-50"
                        >
                          <td className="px-4 py-2 text-sm">{item.cantidad}</td>
                          <td className="px-4 py-2 text-sm">{item.unidad}</td>
                          <td className="px-4 py-2 text-sm">
                            {item.descripcion}
                          </td>
                          <td className="px-4 py-2 text-right text-sm">
                            {formatNumber(item.monto_Valor_Unitario)}
                          </td>
                          <td className="px-4 py-2 text-right text-sm">
                            {formatNumber(item.monto_Precio_Unitario)}
                          </td>
                          <td className="px-4 py-2 text-right text-sm">
                            {formatNumber(
                              item.cantidad * (item.monto_Precio_Unitario ?? 0),
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-4 text-center text-gray-500"
                        >
                          No hay productos en el detalle.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Observacion */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-2">
                {/* // Observations Section */}
                <div className="">
                  <h3 className="text-md mb-2 font-bold text-gray-600">
                    OBSERVACION:
                  </h3>
                  <div className="rounded-md bg-white p-2 text-sm text-gray-800">
                    {borrador.observacion || "No hay observacion registradas."}
                  </div>
                </div>
                {borrador.detallesExtra &&
                  borrador.detallesExtra.length > 0 && (
                    <div className="grid w-full">
                      {borrador.detallesExtra.map((detalle, index) => (
                        <div
                          key={index}
                          className="flex justify-between p-3 text-sm"
                        >
                          <p className="pr-4 font-semibold">
                            {detalle.detalle} :
                          </p>
                          <p className="pl-4 text-right text-gray-600 dark:text-gray-400">
                            {detalle.valor}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              <div className="rounded-md border border-gray-200 bg-white p-4 text-right">
                <p className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">
                    Op. Gravadas:
                  </span>
                  <span className="text-gray-900">
                    {borrador.tipo_moneda}{" "}
                    {formatNumber(borrador.monto_oper_gravadas)}
                  </span>
                </p>
                <p className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">
                    Op. Exoneradas:
                  </span>
                  <span className="text-gray-900">
                    {borrador.tipo_moneda}{" "}
                    {formatNumber(borrador.monto_oper_exoneradas)}
                  </span>
                </p>
                <p className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">
                    IGV (18%):
                  </span>
                  <span className="text-gray-900">
                    {borrador.tipo_moneda}{" "}
                    {formatNumber(borrador.total_impuestos)}
                  </span>
                </p>
                <p className="mt-4 flex justify-between border-t-2 border-gray-300 pt-4 text-lg font-bold text-blue-800">
                  <span>TOTAL:</span>
                  <span>
                    {borrador.tipo_moneda} {formatNumber(borrador.sub_total)}
                  </span>
                </p>
              </div>
            </div>

            {/* Detraccion */}
            {borrador.tipo_Operacion == "1001" &&
              borrador.tipo_doc === "01" && (
                <div className="mt-4 rounded-md border-2 border-gray-200 p-4 pt-2">
                  <h3 className="text-md mb-2 font-bold text-gray-600">
                    DETRACCION:
                  </h3>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="flex justify-between pr-3">
                      <p className="rounded-md bg-white px-2 text-sm font-semibold text-gray-800">
                        Cta. Cte. Banco
                      </p>
                      <p className="rounded-md bg-white px-2 text-sm text-gray-800">
                        {borrador.detraccion_cta_banco}
                      </p>
                    </div>
                    <div className="flex justify-between pr-3">
                      <p className="rounded-md bg-white px-2 text-sm font-semibold text-gray-800">
                        Detraccion ({borrador.detraccion_percent}%)
                      </p>
                      <p className="rounded-md bg-white px-2 text-sm text-gray-800">
                        {borrador.detraccion_mount}
                      </p>
                    </div>
                    <div className="flex justify-between pr-3">
                      <p className="min-w-[130px] rounded-md bg-white px-2 text-sm font-semibold text-gray-800">
                        Bien o Servicio
                      </p>
                      <p className="rounded-md bg-white px-2 text-sm text-gray-800">
                        {getDescripcion(
                          borrador.detraccion_cod_bien_detraccion,
                        ) || ""}
                      </p>
                    </div>
                    <div className="flex justify-between pr-3">
                      <p className="rounded-md bg-white px-2 text-sm font-semibold text-gray-800">
                        Neto a Pagar
                      </p>
                      <p className="rounded-md bg-white px-2 text-sm text-gray-800">
                        {(
                          borrador.monto_Imp_Venta - borrador.detraccion_mount
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {borrador.tipo_Operacion !== "1001" &&
              borrador.retencion_activada && (
                <div className="mt-4 rounded-md border-2 border-gray-200 p-4 pt-2">
                  <h3 className="text-md mb-2 font-bold text-gray-600">
                    RETENCION:
                  </h3>
                  <div className="grid grid-cols-1 space-y-2 gap-x-10 md:grid-cols-4">
                    <div className="flex justify-between pr-3">
                      <p className="rounded-md bg-white px-2 text-sm font-semibold text-gray-800">
                        Porcentaje
                      </p>
                      <p className="rounded-md bg-white px-2 text-sm text-gray-800">
                        {borrador.descuento_factor * 100}%
                      </p>
                    </div>
                    <div className="flex justify-between pr-3">
                      <p className="rounded-md bg-white px-2 text-sm font-semibold text-gray-800">
                        Base
                      </p>
                      <p className="rounded-md bg-white px-2 text-sm text-gray-800">
                        PEN {borrador.descuento_monto_base}
                      </p>
                    </div>
                    <div className="flex justify-between pr-3">
                      <p className="rounded-md bg-white px-2 text-sm font-semibold text-gray-800">
                        Retencion
                      </p>
                      <p className="rounded-md bg-white px-2 text-sm text-gray-800">
                        PEN {borrador.descuento_monto}
                      </p>
                    </div>
                    <div className="flex justify-between pr-3">
                      <p className="rounded-md bg-white px-2 text-sm font-semibold text-gray-800">
                        Pago Neto
                      </p>
                      <p className="rounded-md bg-white text-sm text-gray-800">
                        {borrador.tipo_moneda} {borrador.neto_pagar}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
