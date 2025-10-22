class RenderDocxPlantilla {
  constructor({ docxTemplateService }) {
    this.docxTemplateService = docxTemplateService;
  }

  /**
   * @param {Buffer} templateBuffer - contenido .docx
   * @param {Object} data - datos para merge
   * @param {Object} options - { nombreBase?: string, generarPdf?: boolean }
   */
  async execute({ templateBuffer, data, options = {} }) {
    const { nombreBase = "contrato", generarPdf = false } = options;

    const { outputDocxPath, filenameDocx } = this.docxTemplateService.renderFromBuffer({
      templateBuffer,
      data,
      nombreBase,
    });

    let pdfInfo = null;
    if (generarPdf) {
      try {
        pdfInfo = await this.docxTemplateService.tryConvertToPdf(outputDocxPath);
      } catch (e) {
        // No reventamos el flujo si falla el PDF; reportamos como null.
        pdfInfo = { error: e.message };
      }
    }

    return { outputDocxPath, filenameDocx, pdfInfo };
  }
}

module.exports = { RenderDocxPlantilla };