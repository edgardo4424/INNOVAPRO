import factilizaService from "@/modules/facturacion/service/FactilizaService";
import { FileArchive, FileCode, FileText, X } from "lucide-react";
import { useState } from "react";
// npm install file-saver
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import facturaService from "../../service/FacturaService";
//
import JSZip from "jszip";
import { nombreDocumentoADdescargar } from "../../utils/formateos";

/* ================== helpers simplificados ================== */
const toDocumentoPayload = (doc = {}) => {
  const correlativoSrc = doc.correlativo ?? doc.correlativo ?? "";
  const correlativo = correlativoSrc;
  const empresa_ruc = String(
    doc.numRuc ?? doc.empresa_ruc ?? doc.empresa_Ruc ?? "",
  );
  const serie = String(doc.serie ?? "");
  const tipo_Doc = String(doc.tipoDoc ?? doc.tipo_Doc ?? "").padStart(2, "0");
  return { correlativo, empresa_ruc, serie, tipo_Doc };
};

const filenameBaseFromDoc = (doc = {}) => {
  const p = toDocumentoPayload(doc);
  if (p.empresa_ruc && p.tipo_Doc && p.serie && p.correlativo) {
    return `${p.empresa_ruc}-${p.tipo_Doc}-${p.serie}-${p.correlativo}`;
  }
  if (doc.serie && (doc.numDocumentoComprobante || doc.correlativo)) {
    return `${doc.serie}-${doc.numDocumentoComprobante || doc.correlativo}`;
  }
  return "documento";
};

const normalizeBase64 = (s = "") => {
  if (typeof s !== "string") return "";
  // quita comillas accidentales, espacios y saltos de línea
  let out = s
    .trim()
    .replace(/^"+|"+$/g, "")
    .replace(/\s+/g, "");
  // quita prefijo data:...;base64,
  const m = out.match(/^data:[^;]+;base64,(.+)$/i);
  if (m) out = m[1];
  return out;
};

const getBlobFromResponse = async (response, filename, type) => {
  return new Promise((resolve, reject) => {
    try {
      processResponse(
        response,
        filename,
        type,
        // callback opcional: en lugar de descargar, devolvemos el blob
        (blob) => resolve(blob),
      );
    } catch (e) {
      reject(e);
    }
  });
};

const processResponse = async (response, filename, type = "auto", onBlob) => {
  const deliver = (blob, ext) => {
    if (onBlob) {
      onBlob(blob);
    } else {
      saveAs(blob, `${filename}${ext}`);
    }
  };

  // 1) Respuesta tipo string
  if (typeof response === "string") {
    const txt = response.trim();

    // XML directo
    if (
      txt.startsWith("<?xml") ||
      txt.startsWith("<?cdr") ||
      txt.startsWith("<")
    ) {
      const blob = new Blob([txt], { type: "application/xml;charset=utf-8" });
      return deliver(blob, ".xml");
    }

    const b64 = normalizeBase64(txt);

    // ZIP en base64
    if (b64.startsWith("UEsDB")) {
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/zip" });
      return deliver(blob, ".zip");
    }

    // PDF en base64
    if (b64.startsWith("JVBER")) {
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/pdf" });
      return deliver(blob, ".pdf");
    }
  }

  // 2) Blob directo
  if (response instanceof Blob) {
    const ct = (response.type || "").toLowerCase();
    if (ct.includes("zip") || type === "zip") return deliver(response, ".zip");
    if (ct.includes("xml") || type === "xml") return deliver(response, ".xml");
    if (ct.includes("pdf") || type === "pdf") return deliver(response, ".pdf");
    return deliver(response, "");
  }

  // 3) ArrayBuffer directo
  if (response instanceof ArrayBuffer) {
    const blob = new Blob([response], {
      type:
        type === "zip"
          ? "application/zip"
          : type === "xml"
            ? "application/xml"
            : type === "pdf"
              ? "application/pdf"
              : "application/octet-stream",
    });
    const ext =
      type === "zip"
        ? ".zip"
        : type === "xml"
          ? ".xml"
          : type === "pdf"
            ? ".pdf"
            : "";
    return deliver(blob, ext);
  }

  // 4) Datos anidados
  const data = response?.data || response?.payload || response?.result;
  if (data != null) {
    return processResponse(data, filename, type, onBlob);
  }

  throw new Error("Formato de respuesta no reconocido");
};

const ModalDescarga = ({
  id_documento,
  setIdDocumento,
  setModalOpen,
  documentoADescargar,
  setDocumentoADescargar,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const { serie, correlativo, tipoDoc } = documentoADescargar || {};
  const baseName = filenameBaseFromDoc(documentoADescargar);

  const closeModal = () => {
    setIsOpen(false);
    setIdDocumento("");
    setModalOpen(false);
    setDocumentoADescargar({});
    setMsg("");
  };

  const handleDownload = async (format) => {
    try {
      setLoading(true);
      setMsg("");
      console.log(documentoADescargar)

      const payload = toDocumentoPayload(documentoADescargar);
      if (
        !payload.empresa_ruc ||
        !payload.serie ||
        !payload.correlativo ||
        !payload.tipo_Doc
      ) {
        throw new Error(
          "Faltan datos del documento (RUC, serie, correlativo o tipo_Doc).",
        );
      }

      if (format === "xml") {
        const response = await factilizaService.consultarXml(payload);
        await processResponse(response, `${nombreDocumentoADdescargar(documentoADescargar, "xml")}`, "xml");
        setMsg("XML/CDR descargado exitosamente.");
        return;
      }

      if (format === "cdr") {
        const response = await factilizaService.consultarCdr(payload);
        await processResponse(response, `${baseName}-CDR`, "zip"); // el 'zip' sirve de hint si cambias a binario en el futuro
        setMsg("CDR (ZIP) descargado exitosamente.");
        return;
      }

      if (format === "pdf") {
        const response = await factilizaService.consultarPdf(payload);
        await processResponse(response, `${baseName}-PDF`, "pdf");
        setMsg("PDF descargado exitosamente.");
        return;
      }

      if (format === "pdf-innova") {
        let response;

        if (tipoDoc === "01" || tipoDoc === "03") {
          response = await facturaService.reporteFactura(documentoADescargar);
        } else if (tipoDoc === "07" || tipoDoc === "08") {
          response = await facturaService.reporteNota(documentoADescargar);
        } else if (tipoDoc === "09") {
          response = await facturaService.reporteGuia(documentoADescargar);
        } else {
          throw new Error(
            "No se puede descargar el PDF para este tipo de documento.",
          );
        }
        await processResponse(
          response,
          `${nombreDocumentoADdescargar(documentoADescargar, "pdf")}`,
          "pdf",
        );
        setMsg("PDF descargado exitosamente.");
        return;
      }

      if (format === "all") {
        try {
          setLoading(true);
          setMsg("");

          const zip = new JSZip();

          // ✅ 1) XML
          const xmlResponse = await factilizaService.consultarXml(payload);
          const xmlBlob = await getBlobFromResponse(
            xmlResponse,
            `${baseName}-XML`,
            "xml",
          );
          zip.file(`${baseName}.xml`, xmlBlob);

          // ✅ 2) CDR
          const cdrResponse = await factilizaService.consultarCdr(payload);
          const cdrBlob = await getBlobFromResponse(
            cdrResponse,
            `${baseName}-CDR`,
            "zip",
          );
          // puedes llamar al archivo como .zip o .cdr.zip
          zip.file(`${baseName}-CDR.zip`, cdrBlob);

          // ✅ 3) PDF
          let pdfResponse;
          if (tipoDoc === "01" || tipoDoc === "03") {
            pdfResponse =
              await facturaService.reporteFactura(documentoADescargar);
          } else if (tipoDoc === "07" || tipoDoc === "08") {
            pdfResponse = await facturaService.reporteNota(documentoADescargar);
          } else if (tipoDoc === "09") {
            pdfResponse = await facturaService.reporteGuia(documentoADescargar);
          } else {
            throw new Error(
              "No se puede descargar el PDF para este tipo de documento.",
            );
          }

          const pdfBlob = await getBlobFromResponse(
            pdfResponse,
            `${documentoADescargar.serie}-${documentoADescargar.correlativo}`,
            "pdf",
          );
          zip.file(`${baseName}.pdf`, pdfBlob);

          // ✅ 4) Generar ZIP final
          const zipContent = await zip.generateAsync({ type: "blob" });
          saveAs(zipContent, `${baseName}-COMPLETO.zip`);

          setMsg("XML, CDR y PDF descargados en un solo ZIP.");
        } catch (err) {
          console.error(err);
          toast.error("Error al crear el ZIP combinado");
        } finally {
          setLoading(false);
        }

        return;
      }
    } catch (err) {
      toast.error("Error al tratar de descargar el archivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-xl bg-white p-8 shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600"
              disabled={loading}
            >
              <X size={24} />
            </button>

            <div className="mb-6 text-center">
              {serie && correlativo ? (
                <h2 className="text-xl font-bold text-gray-800">
                  Documento {serie}-{correlativo}
                </h2>
              ) : (
                <h2 className="text-xl font-bold text-gray-800">Documento</h2>
              )}
              <h3 className="mt-1 text-base font-semibold text-gray-700">
                ¿Qué deseas descargar?
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Se consultará a /sunat/pdf y /sunat/xml con el body del
                documento.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleDownload("xml")}
                disabled={loading}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-100 p-4 font-semibold text-gray-700 transition-colors hover:bg-gray-300/90 disabled:opacity-60"
              >
                <FileCode size={20} />
                {loading ? "Procesando…" : "Descargar XML"}
              </button>

              <button
                onClick={() => handleDownload("cdr")}
                disabled={loading}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-100 p-4 font-semibold text-gray-700 transition-colors hover:bg-gray-300/90 disabled:opacity-60"
              >
                <FileCode size={20} />
                {loading ? "Procesando…" : "Descargar CDR"}
              </button>

              {/* <button
                                onClick={() => handleDownload('pdf')}
                                disabled={loading}
                                className="cursor-pointer flex items-center justify-center gap-2 p-4 bg-gray-100 rounded-lg text-gray-700 font-semibold hover:bg-gray-300/90 transition-colors disabled:opacity-60"
                            >
                                <FileText size={20} />
                                {loading ? 'Procesando…' : 'Descargar PDF'}
                            </button> */}

              <button
                onClick={() => handleDownload("pdf-innova")}
                disabled={loading}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-100 p-4 font-semibold text-gray-700 transition-colors hover:bg-gray-300/90 disabled:opacity-60"
              >
                <FileText size={20} />
                {loading ? "Procesando…" : "Descargar PDF - Innova"}
              </button>

              <button
                onClick={() => handleDownload("all")}
                disabled={loading}
                className="bg-innova-blue hover:bg-innova-blue-hover flex cursor-pointer items-center justify-center gap-2 rounded-lg p-4 font-semibold text-white transition-colors disabled:opacity-60"
              >
                <FileArchive size={20} />
                {loading ? "Procesando…" : "Descargar ZIP"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalDescarga;
