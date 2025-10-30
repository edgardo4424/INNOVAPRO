const path = require("path");
const fs = require("fs");
const multer = require("multer");

//! --- Integración del renderer DOCX específico para contratos ---
// Reusa los servicios del módulo documentos (-> IMPORT CORRECTA)
const { DocxTemplateService } = require("../../../documentos/infrastructure/services/DocxTemplateService");
const { RenderDocxPlantilla } = require("../../../documentos/application/useCases/RenderDocxPlantilla");
const { DocumentoController } = require("../../../documentos/interfaces/controllers/DocumentoController");

// Directorio de salida específico para contratos
const OUTPUT_DIR = path.resolve(process.cwd(), "storage/documentos/contratos");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Multer en memoria (reutilizable)
const upload = multer({ storage: multer.memoryStorage() });

// Instancia única de los servicios (singleton dentro del proceso)
const docxTemplateService = new DocxTemplateService({ baseOutputDir: OUTPUT_DIR });
const renderDocxPlantilla = new RenderDocxPlantilla({ docxTemplateService });

// Ajusta el publicBaseUrl según tu app (ver app.use("/public", ...))
const documentoController = new DocumentoController({
  renderDocxPlantilla,
  publicBaseUrl: "/public/documentos/contratos",
});


module.exports = {
  OUTPUT_DIR,
  upload,
  docxTemplateService,
  renderDocxPlantilla,
  documentoController,
};