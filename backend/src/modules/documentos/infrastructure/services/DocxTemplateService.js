const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const { CONTRATOS_DIR } = require("../../../../config/paths");

class DocxTemplateService {
  constructor({ baseOutputDir } = {}) {
    this.baseOutputDir = baseOutputDir || CONTRATOS_DIR;
  }

  ensureDirs() {
    fs.mkdirSync(this.baseOutputDir, { recursive: true });
  }

  renderFromBuffer({ templateBuffer, data, nombreBase = "contrato" }) {
    this.ensureDirs();

    const zip = new PizZip(templateBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      nullGetter: () => "",
    });

    /* doc.setData(data); */
    
    try { doc.render(data); }
    catch (error) { throw new Error(`Error al renderizar DOCX: ${error.message}`); }

    const buf = doc.getZip().generate({ type: "nodebuffer" });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    //! ASIGNACION DEL NOMBRE DEL ARCHIVO
    const filenameDocx = `${nombreBase}-${timestamp}.docx`;
    
    const outputDocxPath = path.join(this.baseOutputDir, filenameDocx);

    fs.writeFileSync(outputDocxPath, buf);
    return { outputDocxPath, filenameDocx };
  }

  async tryConvertToPdf(docxPath) {
    const lo = process.env.LIBREOFFICE_PATH || "soffice";
    const outDir = path.dirname(docxPath);

    await new Promise((resolve, reject) => {
      const child = spawn(lo, ["--headless","--convert-to","pdf","--outdir", outDir, docxPath], { stdio: "ignore" });
      child.on("error", reject);
      child.on("close", (code) => code === 0 ? resolve() : reject(new Error(`LibreOffice terminó con código ${code}`)));
    });

    const pdfPath = docxPath.replace(/\.docx$/i, ".pdf");
    if (!fs.existsSync(pdfPath)) throw new Error("No se generó PDF");
    return { outputPdfPath: pdfPath, filenamePdf: path.basename(pdfPath) };
  }
}

module.exports = { DocxTemplateService };