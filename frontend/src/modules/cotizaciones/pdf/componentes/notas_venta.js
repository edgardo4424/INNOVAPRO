import { verificarSaltoDePagina } from "./pagina.js";
import { renderListaJustificada } from "../../../../utils/pdf/renderListaJustificada.js";

export async function renderNotasVenta(doc, data, currentY) {
  const indent = 20;
  const maxWidth = 170;
  const lineHeight = 4.5;

  currentY += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("NOTA:", indent, currentY);
  doc.line(indent, currentY + 1.5, indent + 8, currentY + 1.5);
  currentY += 10;

  const condiciones = data.condiciones || [
    "1° Los precios ofertados NO INCLUYEN I.G.V. (18%).",
    "2° Validez de la oferta: 15 días",
    "3° **Forma de pago POR ADELANTADO.**",
    "4° El horario de atención del Almacén es de lunes a viernes de 8:00 a.m a 12:00 p.m. y de 1:00 p.m. a 5:00 p.m.",
    "5° Relación de cuentas para depósito o transferencia:"
  ];

  currentY = await renderListaJustificada({
      doc,
      lista: condiciones,
      x: indent,
      y: currentY,
      maxWidth,
      verificarSaltoDePagina,
      lineHeight: lineHeight + 0.5, 
      fontSize: 8,
    })

  return currentY;
}