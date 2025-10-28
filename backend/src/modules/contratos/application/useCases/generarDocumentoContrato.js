 const path = require("path");
const fs = require("fs");
const { renderDocxPlantilla, documentoController } = require("../../infraestructure/services/contratosDocumentService");

module.exports = async (
  contrato_id,
  data,
  contratoRepository,
  options = {},
  transaction = null
) => {

        // --- Dónde está la plantilla: tú ya sabes cuál usar ---
        // Opciones:
        //  - recibir el nombre de plantilla en body: req.body.templateFilename
        //  - o tomarla de data (p.e. data.templateFilename)
        //  - o construirla por patrón (ref_contrato / uso / empresa ...)
        // Aquí usamos preferentemente req.body.templateFilename y si no existe, fallback a data.templateFilename
      
    
        const templatesDir = path.resolve(process.cwd(), "storage/plantillas");
        if (!fs.existsSync(templatesDir)) {
          /* await transaction.rollback(); */
          return {
            codigo: 500,
            respuesta: { mensaje: `Directorio de plantillas no existe en servidor: ${templatesDir}` }
          };
        }
    
       /*  const templateFilename = (req.body && req.body.templateFilename)
          || (data.templateFilename)
          || null; */
        
        // Obtener la ruta de la plantilla tomando como referencia a templatesDir, añadiendo mas carpetas

       //const templateFilename = templatesDir + '/01. ENCOFRADOS INNOVA/01. CONTRATOS (CC)/EI-CC-RESPONSABLE-000X_1-Año - Empresa - Obra - USO.docx';
    
        /* if (!templateFilename) {
         
          return {
            codigo: 400,
            respuesta: { mensaje: "No se proporcionó nombre de plantilla" }
          }
        } */
    
     /*    const plantillaPath = path.join(templatesDir, templateFilename); */
     const plantillaPath = path.join(templatesDir, '01. ENCOFRADOS INNOVA','01. CONTRATOS (CC)','USOS V2.docx');
     console.log("PLANTILLA PATH:", plantillaPath); 
     if (!fs.existsSync(plantillaPath)) {
         /*  await transaction.rollback(); */
          return {
            codigo: 404,
            respuesta: { mensaje: `Plantilla no encontrada en servidor: ${plantillaPath}` }
          }
        }
    
        // Leer el .docx a memoria
        const templateBuffer = fs.readFileSync(plantillaPath);
    
        // Nombre base para salida (usar ref_contrato si existe)
        const sanitize = (s) => String(s || "").replace(/[/\\:*?"<>|]/g, "").trim();
        const nombreBase = sanitize((data.contrato && data.contrato.codigo) || data.ref_contrato || `contrato-${contrato_id}`);
    
        // Ejecutar el renderer del módulo documentos (reutilizamos el servicio)
        const { outputDocxPath, filenameDocx, pdfInfo } = await renderDocxPlantilla.execute({
          templateBuffer,
          data, // la estructura que la plantilla espera
          options: { nombreBase, generarPdf: true },
        });
    
         // Construir URLs públicas: primero intentar obtener base desde options.req si se pasó,
  // si no, usar SERVER_PUBLIC_BASE_URL en env o fallback a http://localhost:PORT
  let base;
  if (options.req && typeof documentoController.getServerBaseUrl === "function") {
    try {
      base = documentoController.getServerBaseUrl(options.req);
    } catch (err) {
      console.warn("getServerBaseUrl falló con req, usando fallback env:", err.message);
      base = process.env.SERVER_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    }
  } else {
    base = options.serverBaseUrl || process.env.SERVER_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  }

  // publicBase tomado del controller (lo definiste cuando instanciaste documentoController)
  const publicBase = documentoController?.publicBaseUrl || "/public/documentos/contratos";
  const docxUrl = `${base}${publicBase}/${filenameDocx}`;
  let pdfUrl = null;
  if (pdfInfo && pdfInfo.filenamePdf) {
    pdfUrl = `${base}${publicBase}/${pdfInfo.filenamePdf}`;
  }
    
        // OPTIONAL: si quieres persistir la url dentro del contrato:
        // const db = require("../../../../database/models");
        // await db.contratos.update({ pdf_final_url: pdfUrl }, { where: { id: contrato_id }, transaction });
    
  
  return {
    codigo: 200,
    respuesta: {
        mensaje: "Documento generado exitosamente",
        contrato: data,
        docx: {
          filename: filenameDocx,
          url: docxUrl
        },
        pdf: pdfUrl ? { filename: pdfInfo.filenamePdf, url: pdfUrl } : (pdfInfo?.error ? { error: pdfInfo.error } : null),
    },
  };
};
