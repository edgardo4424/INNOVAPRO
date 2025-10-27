const path = require("path");

class DocumentoController {
  constructor({ renderDocxPlantilla, publicBaseUrl = "/public/documentos/contratos" }) {
    this.renderDocxPlantilla = renderDocxPlantilla;
    this.publicBaseUrl = publicBaseUrl;
  }

  // Helper para obtener base absoluta hacia el backend
  getServerBaseUrl(req) {
    // Permite forzar base desde env en producción (dominio real)
    const forced = process.env.SERVER_PUBLIC_BASE_URL; // ej: https://erp.grupoinnova.pe
    if (forced) return forced.replace(/\/+$/, "");

    // Respeta proxies
    const proto = req.headers["x-forwarded-proto"] || req.protocol;
    const host  = req.headers["x-forwarded-host"]  || req.get("host");
    return `${proto}://${host}`;
  }

  render = async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ message: "Falta archivo .docx en 'file'." });

      const dataRaw = req.body?.data;
      if (!dataRaw) return res.status(400).json({ message: "Falta 'data' (JSON) en el body." });

      let data = {};
      try { data = JSON.parse(dataRaw); }
      catch { return res.status(400).json({ message: "El campo 'data' no es un JSON válido." }); }

      const nombreBase = req.body?.nombreBase || "contrato";
      const generarPdf = String(req.body?.generarPdf).toLowerCase() === "true";

      const { outputDocxPath, filenameDocx, pdfInfo } = await this.renderDocxPlantilla.execute({
        templateBuffer: file.buffer,
        data,
        options: { nombreBase, generarPdf },
      });

      const base = this.getServerBaseUrl(req); // <<< BACKEND ABSOLUTO
      const docxUrl = `${base}${this.publicBaseUrl}/${filenameDocx}`;

      let pdfUrl = null;
      if (pdfInfo && pdfInfo.filenamePdf) {
        pdfUrl = `${base}${this.publicBaseUrl}/${pdfInfo.filenamePdf}`;
      }

      return res.json({
        ok: true,
        docx: { filename: filenameDocx, url: docxUrl },
        pdf: pdfUrl ? { filename: pdfInfo.filenamePdf, url: pdfUrl } : (pdfInfo?.error ? { error: pdfInfo.error } : null),
      });
    } catch (e) {
      return res.status(500).json({ message: e.message || "Error generando documento." });
    }
  };
}

module.exports = { DocumentoController };