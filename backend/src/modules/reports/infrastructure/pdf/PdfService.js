const PdfPrinter = require("pdfmake");
const fs = require("fs");
const path = require("path");

const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

class PdfService {
  constructor() {
    this.printer = new PdfPrinter(fonts);
  }

  generatePdfBuffer(docDefinition) {
    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
        const chunks = [];

        pdfDoc.on("data", (chunk) => chunks.push(chunk));
        pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
        pdfDoc.on("error", reject);
        pdfDoc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  generatePdfFile(docDefinition, filePath) {
    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.on("end", () => resolve(filePath));
        pdfDoc.on("error", reject);
        pdfDoc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = { PdfService };
