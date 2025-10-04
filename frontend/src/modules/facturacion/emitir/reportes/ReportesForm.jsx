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
  usuario_id: null,
};

const ReportesForm = () => {
  const [filtro, setFiltro] = useState(filtroInicial);
  const [loading, setLoading] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [excelData, setExcelData] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalFact, setTotalFact] = useState(0);
  const [totalNota, setTotalNota] = useState(0);
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
        setTotalNota(total_notas);
        setTotalGuia(total_guia);

        setExcelData({
          nombre_libro: sanitizeSheetName(
            `Reporte de Ventas ${formatDateTime(filtro.fec_des)} - ${formatDateTime(filtro.fec_ast)}`,
          ),
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
            { key: "serie", label: "Serie" },
            { key: "correlativo", label: "Correlativo" },
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
              key: "tipo_doc_de_referencia",
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

      <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Factura/Boleta */}
        <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4 shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Factura / Boleta
            </p>
            <h2 className="text-xl font-bold text-blue-700">{totalFact}</h2>
          </div>
          <span className="rounded-full bg-blue-100 p-3 text-lg text-blue-600">
            📄
          </span>
        </div>

        {/* Guía */}
        <div className="flex items-center justify-between rounded-xl bg-green-50 p-4 shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-600">Guías</p>
            <h2 className="text-xl font-bold text-green-700">{totalGuia}</h2>
          </div>
          <span className="rounded-full bg-green-100 p-3 text-lg text-green-600">
            🚚
          </span>
        </div>

        {/* Notas */}
        <div className="flex items-center justify-between rounded-xl bg-yellow-50 p-4 shadow-md">
          <div>
            <p className="text-sm font-medium text-gray-600">Notas</p>
            <h2 className="text-xl font-bold text-yellow-700">{totalNota}</h2>
          </div>
          <span className="rounded-full bg-yellow-100 p-3 text-lg text-yellow-600">
            📝
          </span>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        {excelData && (
          <ExportExcelVentas
            nombreArchivo={`Reporte de Ventas ${formatDateTime(filtro.fec_des)} - ${formatDateTime(filtro.fec_ast)}.xlsx`}
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
