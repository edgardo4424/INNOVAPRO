import React, { useState } from "react";
import TablaDocumentos from "./components/tabla/TablaDocumentos";
import FiltroReporte from "./components/FiltroReporte";
import facturaService from "../../service/FacturaService";
import { toast } from "react-toastify";
import { formatDateTime } from "../../utils/formateos";
import ExportExcelVentas from "./hook/ExportExcelVentas";

// ✅ Función para limpiar el nombre de la hoja Excel
const sanitizeSheetName = (name) => {
  return name.replace(/[:\\/?*\[\]]/g, "-");
};

const filtroInicial = {
  ac_factura: true,
  ac_boleta: true,
  ac_n_credito: true,
  ac_n_debito: true,
  ac_guia: true,
  empresa_ruc: "",
  cliente_num_doc: "",
  cliente_razon_social: "",
  fec_des: "",
  fec_ast: "",
  serieG: null,
  serieN: null,
  serieF: null,
  usuario_id: null,
};

const ReportesForm = () => {
  const [filtro, setFiltro] = useState(filtroInicial);
  const [loading, setLoading] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [excelData, setExcelData] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalFact, setTotalFact] = useState(0);
  const [totalBole, setTotalBole] = useState(0);
  const [totalNotaCre, setTotalNotaCre] = useState(0);
  const [totalNotaDeb, setTotalNotaDeb] = useState(0);
  const [totalGuia, setTotalGuia] = useState(0);

  const handleAplicarFiltros = async () => {
    if (filtro.fec_des == "")
      return toast.error("La fecha de inicio es requerida.");
    if (filtro.fec_ast && filtro.fec_des > filtro.fec_ast)
      return toast.error(
        "La fecha de inicio debe ser menor a la fecha de fin.",
      );

    try {
      setLoading(true);
      const promise = facturaService.reporteVentas(filtro);
      toast.promise(promise, {
        pending: "Buscando documentos",
        success: "Información encontrada",
      });
      const {
        datos,
        total,
        total_notas,
        total_guia,
        total_facturas_boleta,
        estado,
      } = await promise;

      if (estado) {
        setDocumentos(datos);
        setTotal(total);
        setTotalFact(total_facturas_boleta);
        setTotalFact(datos.filter((doc) => doc.tipo_doc === "Factura").length);
        setTotalBole(datos.filter((doc) => doc.tipo_doc === "Boleta").length);
        setTotalNotaCre(
          datos.filter((doc) => doc.tipo_doc === "Nota de Crédito").length,
        );
        setTotalNotaDeb(
          datos.filter((doc) => doc.tipo_doc === "Nota de Débito").length,
        );
        setTotalGuia(
          datos.filter((doc) => doc.tipo_doc === "Guía de Remisión").length,
        );

        setExcelData({
          nombre_libro: sanitizeSheetName(`Reporte de Ventas `),
          datos: datos.map((doc) => ({
            ...doc,
            // 🔹 Fechas formateadas con tu helper
            fecha_emision: doc.fecha_emision
              ? formatDateTime(doc.fecha_emision)
              : "",
            fecha_vencimiento: doc.fecha_vencimiento
              ? formatDateTime(doc.fecha_vencimiento)
              : "",
            fec_doc_de_referencia: doc.fec_doc_de_referencia
              ? formatDateTime(doc.fec_doc_de_referencia)
              : "",
          })),
          columnas: [
            { key: "filial", label: "Filial" },
            { key: "razon_social", label: "Razon Social" },
            { key: "ruc_cliente", label: "RUC" },
            { key: "tipo_doc", label: "Tipo Doc" },
            { key: "comprobante_serie_correlativo", label: "Comprobante" },
            { key: "estado", label: "Estado" },
            { key: "fecha_emision", label: "F. Emisión" },
            { key: "fecha_vencimiento", label: "F. Vencimiento" },
            { key: "tipo_moneda", label: "Moneda" },
            { key: "base", label: "Base" },
            { key: "igv", label: "IGV" },
            { key: "total", label: "Total" },
            { key: "detraccion", label: "Detraccion" },
            { key: "retencion", label: "Retención" },
            { key: "neto", label: "Neto" },
            { key: "precio_dolar", label: "Tipo Cambio" },
            { key: "monto_en_soles", label: "Monto en Soles" },
            { key: "codigo", label: "Codigo" },
            { key: "mensaje", label: "Mensaje" },
            {
              key: "fec_doc_de_referencia",
              label: "Fecha Documento de Relación",
            },
            { key: "doc_de_referencia", label: "Documentos de Referencia" },
            {
              key: "afectado_tipo_doc",
              label: "Tipo Documento de Referencia",
            },
          ],
          excluir: [],
        });
      }
    } catch (error) {
      toast.error("Ocurrio un error al obtener los documentos.");
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiarFiltros = () => {
    setFiltro(filtroInicial);
    setDocumentos([]);
    setTotal(0);
    setTotalFact(0);
    setTotalNota(0);
    setTotalGuia(0);
  };

  return (
    <div className="w-full">
      <FiltroReporte
        filtro={filtro}
        setFiltro={setFiltro}
        handleAplicarFiltros={handleAplicarFiltros}
        handleLimpiarFiltros={handleLimpiarFiltros}
      />

      <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-5">
        {/* Facturas */}
        <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4 shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-600">Facturas</p>
            <h2 className="text-xl font-bold text-blue-700">{totalFact}</h2>
          </div>
          <span className="rounded-full bg-blue-100 p-3 text-lg text-blue-600">
            📄
          </span>
        </div>

        {/* Boletas */}
        <div className="flex items-center justify-between rounded-xl bg-indigo-50 p-4 shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-600">Boletas</p>
            <h2 className="text-xl font-bold text-indigo-700">{totalBole}</h2>
          </div>
          <span className="rounded-full bg-indigo-100 p-3 text-lg text-indigo-600">
            🧾
          </span>
        </div>

        {/* Notas Crédito */}
        <div className="flex items-center justify-between rounded-xl bg-yellow-50 p-4 shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-600">Notas Crédito</p>
            <h2 className="text-xl font-bold text-yellow-700">
              {totalNotaCre}
            </h2>
          </div>
          <span className="rounded-full bg-yellow-100 p-3 text-lg text-yellow-600">
            📝
          </span>
        </div>

        {/* Notas Débito */}
        <div className="flex items-center justify-between rounded-xl bg-orange-50 p-4 shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-600">Notas Débito</p>
            <h2 className="text-xl font-bold text-orange-700">
              {totalNotaDeb}
            </h2>
          </div>
          <span className="rounded-full bg-orange-100 p-3 text-lg text-orange-600">
            📌
          </span>
        </div>

        {/* Guías */}
        <div className="flex items-center justify-between rounded-xl bg-green-50 p-4 shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-600">Guías</p>
            <h2 className="text-xl font-bold text-green-700">{totalGuia}</h2>
          </div>
          <span className="rounded-full bg-green-100 p-3 text-lg text-green-600">
            🚚
          </span>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        {excelData && (
          <ExportExcelVentas
            nombreArchivo={`Reporte de Ventas.xlsx`}
            hojas={excelData}
          />
        )}
      </div>

      <div className="overflow-y-auto">
        <TablaDocumentos documentos={documentos} loading={loading} />
      </div>
    </div>
  );
};

export default ReportesForm;
