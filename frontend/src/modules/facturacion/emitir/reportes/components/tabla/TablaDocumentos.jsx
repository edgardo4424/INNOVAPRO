import { formatDateTime } from "@/modules/facturacion/utils/formateos";
import { LoaderCircle } from "lucide-react";
import React from "react";

const TablaDocumentos = ({ documentos, loading }) => {
  return (
    <div className="w-full overflow-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full bg-white text-sm text-gray-700">
        {/* CABECERA */}
        <thead className="bg-innova-blue text-white">
          <tr>
            {[
              "Filial",
              "Razon Social",
              "RUC",
              "Tipo Doc",
              "Comprobante",
              "Estado",
              "F. Emisión",
              "F. Vencimiento",
              "Moneda",
              "Base",
              "IGV",
              "Total",
              "Detraccion",
              "Retención",
              "Neto",
              "Tipo Cambio",
              "Monto en Soles",
              "Codigo",
              "Mensaje",
              "Fecha Documento de Relación",
              "Documentos de Referencia",
              "Tipo Documento de Referencia",
            ].map((col, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-[10px] font-semibold tracking-wide uppercase"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        {/* CUERPO */}
        <tbody>
          {loading ? (
            <tr>
              <td colspan={20}>
                <LoaderCircle className="mx-auto size-20 animate-spin" />
              </td>
            </tr>
          ) : documentos.length > 0 ? (
            documentos.map((doc, i) => (
              <tr key={i}>
                <td className="border px-4 py-3 text-xs min-w-[200px]">
                  {doc?.filial || ""}
                </td>
                <td className="min-w-[200px] border px-4 py-3 text-xs">
                  {doc?.razon_social || ""}
                </td>
                <td className="border px-4 py-3 text-xs">
                  {doc?.ruc_cliente || ""}
                </td>
                <td className="min-w-[100px] border px-4 py-3 text-xs">
                  {doc?.tipo_doc || ""}
                </td>
                <td className="min-w-[130px] border px-4 py-3 text-xs">
                  {doc?.serie || ""} - {doc?.correlativo || ""}
                </td>
                <td className="border px-4 py-3 text-xs">
                  {doc?.estado || ""}
                </td>
                <td className="border px-4 py-3 text-xs">
                  {formatDateTime(doc?.fecha_emision) || ""}
                </td>
                <td className="border px-4 py-3 text-xs">
                  {formatDateTime(doc?.fecha_vencimiento) || ""}
                </td>
                <td className="border px-4 py-3 text-xs">
                  {doc?.tipo_moneda || ""}
                </td>
                <td className="border px-4 py-3 text-xs">{doc?.base || ""}</td>
                <td className="border px-4 py-3 text-xs">{doc?.igv || ""}</td>
                <td className="border px-4 py-3 text-xs">{doc?.total || ""}</td>
                <td className="border px-4 py-3 text-xs">
                  {doc?.detraccion || ""}
                </td>
                <td className="border px-4 py-3 text-xs">
                  {doc?.retencion || ""}
                </td>
                <td className="border px-4 py-3 text-xs">{doc?.neto || ""}</td>
                <td className="border px-4 py-3 text-xs">
                  {doc?.precio_dolar || ""}
                </td>
                <td className="border px-4 py-3 text-xs">
                  {doc?.monto_en_soles || ""}
                </td>
                <td className="border px-4 py-3 text-xs">
                  {doc?.codigo || ""}
                </td>
                <td className="border px-4 py-3 text-xs min-w-[200px]">
                  {doc?.mensaje || ""}
                </td>
                <td className="border px-4 py-3 text-xs">
                  {formatDateTime(doc?.fec_doc_de_referencia) || ""}
                </td>
                <td className="border px-4 py-3 text-xs  min-w-[200px]">
                  {doc?.doc_de_referencia || ""}
                </td>
                <td className="border px-4 py-3 text-xs">
                  {doc?.tipo_doc_de_referencia || ""}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colspan={20} className="text-center">
                Sin resultados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaDocumentos;
