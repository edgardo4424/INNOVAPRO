import { verificarSaltoDePagina } from "./pagina";
import { drawJustifiedText } from "../../../../utils/pdf/drawJustifiedText";

export async function renderTextoTransporte(doc, data, currentY) {

  if (data.tarifa_transporte && Object.keys(data.tarifa_transporte).length === 0) return currentY;

  const indent = 20;
  const box = 2.5;

  currentY += 6;

  // ⛔ Validar salto antes de dibujar el rectángulo
  currentY = await verificarSaltoDePagina(doc, currentY, 10);
  doc.rect(indent, currentY - box + 0.5, box, box);
  const subtitulo = "Servicio de Transporte: (OPCIONAL)";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(subtitulo, indent + box + 3, currentY + 0.5);
  const w = doc.getTextWidth(subtitulo);
  doc.line(indent + box + 3, currentY + 1.5, indent + box + 3 + w, currentY + 1.5);

  const transporte = [
    `Transporte de ENTREGA: **S/${data.tarifa_transporte?.costo_total_transporte || "(INDEFINIDO COSTO DE TRANSPORTE)"} + IGV.**`,
    `Transporte de DEVOLUCIÓN: **S/${data.tarifa_transporte?.costo_total_transporte || "(INDEFINIDO COSTO DE TRANSPORTE)"} + IGV. (Siempre y cuando el servicio se realice en un solo flete)**`
  ];

  currentY += 6;
  for (const linea of transporte) {
    const palabras = linea.split(/\s+/);
    const aproxLineas = Math.ceil(palabras.length / 11);
    const alturaEstimado = aproxLineas * 5;

    currentY = await verificarSaltoDePagina(doc, currentY, alturaEstimado);
    currentY = drawJustifiedText(doc, linea, indent + box + 3, currentY, 170, 5, 9.5);
  }

  return currentY;
}