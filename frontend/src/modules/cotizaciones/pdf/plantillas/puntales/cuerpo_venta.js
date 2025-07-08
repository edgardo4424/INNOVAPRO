import { verificarSaltoDePagina } from "../../componentes/pagina";
import { drawJustifiedText, renderTextoConNegrita } from "../../../../../utils/pdf/drawJustifiedText";

export async function generarCuerpoPuntalesVenta(doc, data, startY = 120) {
  let currentY = startY;
  const indent = 20;
  const box = 2.5;

  // 📌 Título principal
  const titulo = `COTIZACIÓN DE ${data.cotizacion?.tipo_servicio} DE MATERIAL`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const textWidth = doc.getTextWidth(titulo);
  const x = (210 - textWidth) / 2;
  doc.text(titulo.toUpperCase(), x, currentY);
  doc.setLineWidth(0.5);
  doc.line(x, currentY + 1.2, x + textWidth + 6, currentY + 1.2);
  currentY += 10;

  // Subtítulo servicio
  currentY = await verificarSaltoDePagina(doc, currentY, 6);
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(indent, currentY - box + 0.5, box, box);
  doc.setFont("helvetica", "normal");
  const subtitulo = "Servicio de " + (data.cotizacion?.tipo_servicio || "Venta") + ":";
  doc.setFontSize(10);
  doc.text(subtitulo, indent + box + 3, currentY + 0.5);
  const subtituloWidth = doc.getTextWidth(subtitulo);
  doc.line(indent + box + 3, currentY + 1.5, indent + box + 3 + subtituloWidth, currentY + 1.5);
  currentY += 6;

  // Tabla por zona
  for (const zona of data.zonas || []) {
    const zonaTitulo = `Zona ${zona.zona || "1"} - ${zona.nota_zona || "(DESCRIPCIÓN DE ZONA INDEFINIDA)"}`;
    currentY = drawJustifiedText(doc, `**${zonaTitulo}**`, indent + 3, currentY, 170, 5.5, 10);

    // Encabezados
    currentY = await verificarSaltoDePagina(doc, currentY, 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Tipo Puntal", indent + 4, currentY);
    doc.text("Trípode", indent + 40, currentY);
    doc.text("Cantidad", indent + 65, currentY);
    doc.text("Precio unitario (S/)", indent + 95, currentY);
    doc.text("Subtotal (S/)", indent + 145, currentY);

    // Filas
    doc.setFont("helvetica", "normal");
    let subtotalZona = 0;

    for (const equipo of zona.atributos || []) {
      currentY += 5;
      const tipo = equipo.tipoPuntal || "—";
      const tripode = equipo.tripode || "—";
      const cantidad = equipo.cantidad || 0;
      const precio = equipo.precio_unitario ? parseFloat(equipo.precio_unitario) : 0;
      const subtotal = equipo.subtotal ? parseFloat(equipo.subtotal) : (precio * cantidad);
      subtotalZona += subtotal;

      currentY = await verificarSaltoDePagina(doc, currentY, 5);
      doc.text(tipo.toString(), indent + 4, currentY);
      doc.text(tripode.toString(), indent + 40, currentY);
      doc.text(cantidad.toString(), indent + 65, currentY);
      doc.text(`S/ ${precio.toFixed(2)}`, indent + 95, currentY);
      doc.text(`S/ ${subtotal.toFixed(2)}`, indent + 145, currentY);
    }

    currentY += 5;
    doc.setFont("helvetica", "bold");
    doc.text(`Subtotal Zona ${zona.zona}: S/ ${subtotalZona.toFixed(2)}`, indent + 4, currentY);
    currentY += 6;
  }

  // Total general
  const totalGeneral = (data.zonas || []).reduce((acc, zona) => {
    const sub = (zona.atributos || []).reduce((sum, eq) => {
      const cantidad = eq.cantidad || 0;
      const precio = eq.precio_unitario ? parseFloat(eq.precio_unitario) : 0;
      return sum + (precio * cantidad);
    }, 0);
    return acc + sub;
  }, 0);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  currentY = await verificarSaltoDePagina(doc, currentY, 8);
  doc.text(`Total general de venta de puntales: S/ ${totalGeneral.toFixed(2)} + IGV.`, indent + 3, currentY);
  currentY += 10;

  // Trípodes (venta)
  if (data.tripode.total !== 0) {
    currentY = await verificarSaltoDePagina(doc, currentY, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Trípodes incluidos en esta venta:", indent + 3, currentY);
    currentY += 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Descripción", indent + 4, currentY);
    doc.text("Cantidad", indent + 85, currentY);
    doc.text("Subtotal (S/)", indent + 130, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.text("Trípodes suministrados en todas las zonas", indent + 4, currentY);
    doc.text(`${data.tripode.total}`, indent + 90, currentY);
    doc.text(`S/ ${parseFloat(data.tripode.precio_venta_soles).toFixed(2)} + IGV`, indent + 130, currentY);
    currentY += 8;

    doc.setFontSize(8);
    const mensaje = "*Los trípodes forman parte del sistema completo entregado. La cantidad representa el total despachado al proyecto.*";
    currentY = drawJustifiedText(doc, mensaje, indent + 4, currentY, 170, 4.2, 8) + 4;
  }

  return currentY;
}