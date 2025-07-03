import { verificarSaltoDePagina } from "./pagina";

export async function renderPiezasAdicionales(doc, data, currentY) {
  if (!data.piezasAdicionales || data.piezasAdicionales.length === 0) return currentY;

  const indent = 30;
  const tableWidth = 145;
  const columnWidths = [20, 80, 20, 25]; // item, descripción, cantidad, subtotal
  const headers = ["ITEM", "DESCRIPCIÓN", "CANT", "SUBTOTAL"];

  const heightRow = 5;
  const fontSize = 7.5;

  currentY += 5;

  // Título
  currentY = await verificarSaltoDePagina(doc, currentY, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("PIEZAS ADICIONALES", indent, currentY);
  doc.setLineWidth(0.5);
  doc.line(indent, currentY + 1.5, indent + tableWidth, currentY + 1.5);

  currentY += 3;

  // Encabezados
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fontSize);
  let x = indent;
  headers.forEach((h, i) => {
    doc.text(h, x + 1, currentY + 5);
    x += columnWidths[i];
  });

  currentY += heightRow;

  // Totalizadores
  let totalSoles = 0;
  let totalCantidad = 0;

  // 🧩 Filas
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);

  for (const pieza of data.piezasAdicionales) {
    const precio = data.cotizacion?.tipo_servicio === "Venta"
      ? parseFloat(pieza.precio_venta_soles)
      : parseFloat(pieza.precio_alquiler_soles);

    const cantidad = parseInt(pieza.cantidad) || 0;
    totalSoles += precio;
    totalCantidad += cantidad;

    x = indent;
    const fila = [
      pieza.pieza.item || "-",
      pieza.pieza.descripcion || "-",
      String(cantidad),
      `S/${precio.toFixed(2)}`
    ];

    currentY = await verificarSaltoDePagina(doc, currentY, heightRow);
    fila.forEach((val, i) => {
      doc.text(val, x + 1, currentY + 5);
      x += columnWidths[i];
    });

    currentY += heightRow;
  }

  // Fila de totales
  currentY = await verificarSaltoDePagina(doc, currentY, heightRow);
  x = indent;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(fontSize);
  doc.text("TOTAL", x + 1, currentY + 5);
  x += columnWidths[0] + columnWidths[1];

  doc.text(String(totalCantidad), x + 1, currentY + 5);
  x += columnWidths[2];

  doc.text(`S/${totalSoles.toFixed(2)}`, x + 1, currentY + 5);

  currentY += heightRow + 2;

  // Nota aclaratoria
  const nota = `Nota: Estas piezas han sido incluidas como adicionales para complementar el equipo principal solicitado. Su presencia obedece a criterios técnicos o solicitudes específicas del cliente.`;

  const palabras = nota.split(/\s+/);
  const aproxLineas = Math.ceil(palabras.length / 15);
  const alturaNota = aproxLineas * 5;

  currentY = await verificarSaltoDePagina(doc, currentY, alturaNota);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(80);
  doc.text(nota, 20, currentY + 5, { maxWidth: 170 });
  doc.setTextColor(0);

  return currentY + alturaNota + 4;
}