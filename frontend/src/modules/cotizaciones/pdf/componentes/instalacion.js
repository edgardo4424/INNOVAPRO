import { verificarSaltoDePagina } from "./pagina";
import { drawJustifiedText } from "../../../../utils/pdf/drawJustifiedText";

export async function renderInstalacion(doc, data, currentY) {

  if (data.instalacion && Object.keys(data.instalacion).length === 0) return currentY;

  const indent = 20;
  const box = 2.5;

  currentY += 6;

  // ⛔ Validar salto antes de dibujar el rectángulo
  currentY = await verificarSaltoDePagina(doc, currentY, 10);
  doc.rect(indent, currentY - box + 0.5, box, box);
  const subtitulo = "Servicio de Instalación: (OPCIONAL)";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(subtitulo, indent + box + 3, currentY + 0.5);
  const w = doc.getTextWidth(subtitulo);
  doc.line(indent + box + 3, currentY + 1.5, indent + box + 3 + w, currentY + 1.5);

  const instalacion = [
    `Instalación completa: **S/${data.instalacion?.precio_instalacion_completa_soles || "(INDEFINIDO COSTO DE INSTALACION COMPLETA)"} + IGV.**`,
    `Instalación parcial: **S/${data.instalacion?.precio_instalacion_parcial_soles || "(INDEFINIDO COSTO DE INSTALACION PARCIAL)"} + IGV.**`,

    `__${data.instalacion?.nota}__`,
  ];

  currentY += 6;
  for (const linea of instalacion) {
    const palabras = linea.split(/\s+/);
    const aproxLineas = Math.ceil(palabras.length / 11);
    const alturaEstimado = aproxLineas * 5;

    currentY = await verificarSaltoDePagina(doc, currentY, alturaEstimado);
    currentY = drawJustifiedText(doc, linea, indent + box + 3, currentY, 170, 5, 9.5);
  }

  return currentY;
}