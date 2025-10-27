const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { DocxTemplateService } = require("../../infrastructure/services/DocxTemplateService");
const { RenderDocxPlantilla } = require("../../application/useCases/RenderDocxPlantilla");
const { DocumentoController } = require("../controllers/DocumentoController");

const router = express.Router();

// Storage estático para servir /storage/documentos/contratos
// Asegúrate en tu index.js global tener algo así:
// app.use("/public", express.static(path.resolve(process.cwd(), "storage")));
const OUTPUT_DIR = path.resolve(process.cwd(), "storage/documentos/contratos");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const upload = multer({ storage: multer.memoryStorage() });

const docxTemplateService = new DocxTemplateService({ baseOutputDir: OUTPUT_DIR });
const renderDocxPlantilla = new RenderDocxPlantilla({ docxTemplateService });
const controller = new DocumentoController({ renderDocxPlantilla, publicBaseUrl: "/public/documentos/contratos" });

// RUTA: POST /api/documentos/contratos/render
router.post("/contratos/render", upload.single("file"), controller.render);

module.exports = router;