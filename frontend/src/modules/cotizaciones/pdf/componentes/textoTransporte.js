export function renderTextoTransporte(doc, data, currentY) {

  if (data.tarifa_transporte && Object.keys(data.tarifa_transporte).length === 0) return currentY;

  const indent = 20;
  const box = 2.5;

  currentY += 6;
  doc.rect(indent, currentY - box + 0.5, box, box);
  doc.text("Servicio de Transporte: (OPCIONAL)", indent + box + 3, currentY + 0.5);
  doc.line(indent + box + 3, currentY + 1.5, indent + box + 31, currentY + 1.5);

  const transporte = [
    `Transporte de ENTREGA: S/${data.tarifa_transporte?.costo_total_transporte || "(INDEFINIDO COSTO DE TRANSPORTE)"} + IGV.`,
    `Transporte de DEVOLUCIÓN: S/${data.tarifa_transporte?.costo_total_transporte || "(INDEFINIDO COSTO DE TRANSPORTE)"} + IGV. (Siempre y cuando el servicio se realice en un solo flete)`
  ];

  currentY += 6;
  transporte.forEach(linea => {
    const split = doc.splitTextToSize(linea, 170);
    doc.text(split, indent + box + 3, currentY);
    currentY += split.length * 4;
  });

  return currentY;
}