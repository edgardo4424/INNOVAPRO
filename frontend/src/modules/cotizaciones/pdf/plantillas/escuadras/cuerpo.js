import { verificarSaltoDePagina } from "../../componentes/pagina";
import { drawJustifiedText } from "../../../../../utils/pdf/drawJustifiedText";

export async function generarCuerpoEscuadras(doc, data, startY = 120) {
  let currentY = startY;

  const indent = 20;
  const box = 2.5;

  // 📌 Título principal
  const titulo = `COTIZACIÓN DE ${data.cotizacion?.tipo_servicio?.toUpperCase() || "ALQUILER"} DE MATERIAL`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const textWidth = doc.getTextWidth(titulo);
  const x = (210 - textWidth) / 2;
  doc.text(titulo.toUpperCase(), x, currentY);
  doc.setLineWidth(0.5);
  doc.line(x, currentY + 1.2, x + textWidth + 6, currentY + 1.2);
  currentY += 10;

  // ☐ Servicio
  currentY = await verificarSaltoDePagina(doc, currentY, 6);
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(indent, currentY - box + 0.5, box, box);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const subtitulo = "Servicio de Alquiler:";
  doc.text(subtitulo, indent + box + 3, currentY + 0.5);
  const subtituloWidth = doc.getTextWidth(subtitulo);
  doc.line(indent + box + 3, currentY + 1.5, indent + box + 3 + subtituloWidth, currentY + 1.5);
  currentY += 6;

  // 🧱 Título de uso
  const usoTitulo = `**CP${data.cotizacion?.cp || "—"}:** Alquiler de escuadras`;
  currentY = drawJustifiedText(doc, usoTitulo, indent + 3, currentY, 170, 5.5, 10);
  currentY += 2;

  // 🧩 Zonas y escuadras
  for (const zona of data.zonas || []) {
    const tituloZona = `Zona ${zona.zona} - ${zona.nota_zona || "Sin descripción"}`;
    currentY = drawJustifiedText(doc, `**${tituloZona}**`, indent + 3, currentY, 170, 5.5, 10);

    for (const equipo of zona.atributos || []) {
      const tipo = equipo.escuadra || "—";
      const sobrecarga = equipo.sobrecarga || "—";
      const tramo = equipo.longTramo ? `${equipo.longTramo} mm` : "—";
      const plataforma = equipo.tipoPlataforma || "—";
      const anclaje = equipo.tipoAnclaje || "—";
      const cantidad = equipo.cantidad_uso || "—";

      const descripcion = `${cantidad} Uds. Escuadras de ${tipo}.00 x 2.00 para una carga de ${sobrecarga} kg/m2.`;

      currentY = await verificarSaltoDePagina(doc, currentY, 10);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(descripcion, indent + 3, currentY);
      currentY += 5;
    }

    currentY += 3;
  }

  // 💰 Precio resumen final
  const dias = data.cotizacion?.tiempo_alquiler_dias === 1 ? "día" : "días";
  const textoResumen = `Precio de alquiler total: **S/${data.cotizacion?.subtotal_con_descuento_sin_igv || "—"} + IGV. por ${data.cotizacion?.tiempo_alquiler_dias || "—"} ${dias} calendario.**`;
  currentY = drawJustifiedText(doc, textoResumen, indent + 3, currentY, 170, 5.5, 10);

  return currentY;
}