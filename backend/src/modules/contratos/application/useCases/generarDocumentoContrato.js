const path = require("path");
const fs = require("fs");
const {
  renderDocxPlantilla,
  documentoController,
} = require("../../infraestructure/services/contratosDocumentService");

const db = require("../../../../database/models");
const { DocxTemplateService } = require("../../../documentos/infrastructure/services/DocxTemplateService");
const { RenderDocxPlantilla } = require("../../../documentos/application/useCases/RenderDocxPlantilla");

module.exports = async (
  contrato_id,
  data,
  contratoRepository,
  options = {},
  transaction = null
) => {

  // -- Verificar si el contrato ya tiene un documento de contrato generado automatico con estado "borrador"
  const documentoExistente = await db.documentos.findOne({
    where: {
      contrato_id: contrato_id,
      estado: "borrador",
    },
  }, { transaction });

  if (documentoExistente) {
    return { codigo: 409, respuesta: { error: "Ya existe un 'borrador' para este contrato" } };
  }
  

  // --- obtener contrato y año (usar transaction correctamente) ---
  const contratoEncontrado = await db.contratos.findOne({
    where: { id: contrato_id },
    include: [
      {
        model: db.usuarios,
        as: "usuario",
        include: [
          {
            model: db.trabajadores,
            as: "trabajador",
          }, 
        ],
      },
      {
        model: db.empresas_proveedoras,
        as: "filial",
      }
    ]
        }, { transaction });

  if (!contratoEncontrado) {
    return { codigo: 404, respuesta: { error: "Contrato no encontrado" } };
  }

  const contratoData = contratoEncontrado.get({ plain: true });
  const createdAt = contratoData.createdAt;
  const anio = createdAt
    ? new Date(createdAt).getFullYear()
    : new Date().getFullYear();

  const nombre_comercial = ((contratoData.usuario?.trabajador?.nombres + " " + contratoData.usuario?.trabajador?.apellidos).trim()).toUpperCase();
  const nombre_comercial_sin_caracteres_especiales = nombre_comercial.replace(/[^\w\s]/gi, '');

  const filial_nombre = (contratoData.filial?.razon_social.trim()).toUpperCase();
  const filial_nombre_sin_caracteres_especiales = filial_nombre.replace(/[^\w\s]/gi, '');

  //!2. ... (tu lógica de localizar plantilla y leer templateBuffer)
  const templatesDir = path.resolve(process.cwd(), "storage/plantillas");
  if (!fs.existsSync(templatesDir)) {
    /* await transaction.rollback(); */
    return {
      codigo: 500,
      respuesta: {
        mensaje: `Directorio de plantillas no existe en servidor: ${templatesDir}`,
      },
    };
  }

  const plantillaPath = path.join(
    templatesDir,
    "01. ENCOFRADOS INNOVA",
    "01. CONTRATOS (CC)",
    "USOS V2.docx"
  );
  console.log("PLANTILLA PATH:", plantillaPath);
  if (!fs.existsSync(plantillaPath)) {
    /*  await transaction.rollback(); */
    return {
      codigo: 404,
      respuesta: {
        mensaje: `Plantilla no encontrada en servidor: ${plantillaPath}`,
      },
    };
  }

  // Leer el .docx a memoria
  const templateBuffer = fs.readFileSync(plantillaPath);

  // Nombre base para salida (usar ref_contrato si existe)
  const sanitize = (s) =>
    String(s || "")
      .replace(/[/\\:*?"<>|]/g, "")
      .trim();
  const nombreBase = sanitize(
    (data.contrato && data.contrato.codigo) ||
      data.ref_contrato ||
      `contrato-${contrato_id}`
  );

  //!3.  Ejecutar el renderer del módulo documentos (reutilizamos el servicio)
  // Crear carpeta del año dentro de storage/documentos/contratos/{anio}/{nombre_comercial}
  
  const yearDir = path.join(
    process.cwd(),
    "storage",
    "documentos",
    "contratos",
    String(anio),
    String(nombre_comercial_sin_caracteres_especiales),
    String(filial_nombre_sin_caracteres_especiales)
  );
  fs.mkdirSync(yearDir, { recursive: true });

  // Crear instancia local del servicio apuntando al yearDir
  const localDocxService = new DocxTemplateService({ baseOutputDir: yearDir });
  // Crear renderer que usa la instancia local
  const localRenderer = new RenderDocxPlantilla({
    docxTemplateService: localDocxService,
  });

  // Ejecutar render — los archivos se escribirán en yearDir
  const { outputDocxPath, filenameDocx, pdfInfo } = await localRenderer.execute(
    {
      templateBuffer,
      data,
      options: { nombreBase, generarPdf: true, addTimestamp: true }, // controla addTimestamp si quieres
    }
  );

  // Ahora outputDocxPath y pdfInfo.outputPdfPath (si existe) ya apuntan a archivos en yearDir.
  // Construir URLs públicas incluyendo el año
  let base;
  if (
    options.req &&
    typeof documentoController.getServerBaseUrl === "function"
  ) {
    try {
      base = documentoController.getServerBaseUrl(options.req);
    } catch (err) {
      base =
        options.serverBaseUrl ||
        process.env.SERVER_PUBLIC_BASE_URL ||
        `http://localhost:${process.env.PORT || 3000}`;
    }
  } else {
    base =
      options.serverBaseUrl ||
      process.env.SERVER_PUBLIC_BASE_URL ||
      `http://localhost:${process.env.PORT || 3000}`;
  }

  const publicBase =
    documentoController?.publicBaseUrl || "/public/documentos/contratos";
  // la URL incluye el subfolder del año
  const docxUrl = `${base}${publicBase}/${anio}/${nombre_comercial_sin_caracteres_especiales}/${filial_nombre_sin_caracteres_especiales}/${filenameDocx}`;
  let pdfUrl = null;
  if (pdfInfo && pdfInfo.filenamePdf) {
    pdfUrl = `${base}${publicBase}/${anio}/${nombre_comercial_sin_caracteres_especiales}/${filial_nombre_sin_caracteres_especiales}/${pdfInfo.filenamePdf}`;
  }

  return {
    codigo: 200,
    respuesta: {
      mensaje: "Documento generado exitosamente",
      contrato: data,
      docx: {
        filename: filenameDocx,
        url: docxUrl,
      },
      pdf: pdfUrl
        ? { filename: pdfInfo.filenamePdf, url: pdfUrl }
        : pdfInfo?.error
        ? { error: pdfInfo.error }
        : null,
    },
  };
};
