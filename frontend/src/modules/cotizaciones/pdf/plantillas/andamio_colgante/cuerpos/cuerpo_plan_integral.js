import { verificarSaltoDePagina } from "../../../componentes/pagina";
import { drawJustifiedText } from "../../../../../../utils/pdf/drawJustifiedText";

export async function generarCuerpoPlanIntegral(doc, data, startY = 120) {
  let currentY = startY;
  const indent = 20;
  const box = 2.5;

  // 📌 Título
  const titulo = "COTIZACIÓN DE ALQUILER DE MATERIAL";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const x = (210 - doc.getTextWidth(titulo)) / 2;
  doc.text(titulo, x, currentY);
  doc.setLineWidth(0.5);
  doc.line(x, currentY + 1.2, x + doc.getTextWidth(titulo) + 6, currentY + 1.2);
  currentY += 10;

  // ☐ Servicio de alquiler
  currentY = await verificarSaltoDePagina(doc, currentY, 6);
  doc.setDrawColor(0);
  doc.rect(indent, currentY - box + 0.5, box, box);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const subtitulo = "Servicio de Alquiler:";
  doc.text(subtitulo, indent + box + 3, currentY + 0.5);
  const subtituloWidth = doc.getTextWidth(subtitulo);
  doc.line(indent + box + 3, currentY + 1.5, indent + box + 3 + subtituloWidth, currentY + 1.5);
  currentY += 6;

  // ⚙️ Datos técnicos
  const equipo = data.zonas?.[0]?.atributos?.[0] || {};
  const altura = equipo.altura_m || "—";
  const plataforma = equipo.longitud_plataforma_m || "—";
  const cable = equipo.longitud_cable || "—";
  const soporte = equipo.tipo_soporte || "—";
  const cantidad = equipo.cantidad_uso || 2;
  const modelo = equipo.modelo || "ZPL630 O ZPL800";

  const detalle = `Alquiler de ${cantidad} Uds. andamio colgante eléctrico.\nModelo: ${modelo}\nTipo de Servicio: INTEGRAL\nAltura del edificio: ${altura} m\nLongitud cable de acero: ${cable || "(definir según obra)"}\nLongitud de línea de vida: Altura + 15 m\nLongitud de plataforma: ${plataforma} m (definir modulación, ej. 3+3+1.5)\nSistema de soporte: ${soporte}\nPeriodo de alquiler: ${data.cotizacion?.tiempo_alquiler_dias || "(por definir)"} días calendario`;

  const detalleFinal = detalle.split("\n");

  for (const linea of detalleFinal) {
    currentY = await verificarSaltoDePagina(doc, currentY, 5.5);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(linea, indent + 3, currentY);
    currentY += 5.5;
  }

  currentY += 2;

  // 💰 Precio
  const precio = data.cotizacion?.subtotal_con_descuento_sin_igv || "—";
  const textoPrecio = `**CP0:** Precio de Alquiler: S/${precio} + IGV.`;
  currentY = drawJustifiedText(doc, textoPrecio, indent + 3, currentY, 170, 5.5, 10);

  // 💬 Observación
  const textoCondicion = "*Precio sujeto a variación, en caso de que las condiciones en campo no sean las adecuadas para la instalación regular. Esto será confirmado con una visita técnica.*";
  currentY = drawJustifiedText(doc, textoCondicion, indent + 3, currentY + 5, 170, 5, 9);

  return currentY;
}