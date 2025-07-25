import { verificarSaltoDePagina } from "../../../componentes/pagina";
import { drawJustifiedText } from "../../../../../../utils/pdf/drawJustifiedText";

export async function generarCuerpoPlanIntermedio(doc, data, startY = 120) {
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
  const equipo = data.detalles_colgantes || {};
  const altura = data.zonas[0].atributos[0].alturaEdificio || "—";
  const plataforma = equipo.longitud_plataformas || "—";
  const cable = equipo.longitud_cable || "—";
  const soporte = equipo.tipo_soporte || "—";
  const cantidad = equipo.cantidad_colgantes || 1;
  const modelo = equipo.modelo || "ZPL630 O ZPL800";
  let unidades = cantidad > 1 ? "Uds." : "Ud.";

  const detalle = `Alquiler de ${cantidad} ${unidades} de andamios colgantes eléctricos..\nModelo: ${modelo}\nTipo de Servicio: INTERMEDIO\nAltura del edificio: ${altura} m\nLongitud cable de acero: ${cable} m\nLongitud de línea de vida: Altura + 15 m\nLongitud de plataforma: ${plataforma} m\nSistema de soporte: ${soporte}\nPeriodo de alquiler: ${data.cotizacion?.tiempo_alquiler_dias || 30} días calendario`;
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
  const textoPrecio = `**CP0:** S/ ${precio} + IGV.`;
  currentY = drawJustifiedText(doc, textoPrecio, indent + 3, currentY, 170, 5.5, 10);

  // 💬 Observación
  const textoCondicion = "*Precio sujeto a variación, en caso de que las condiciones en campo no sean las adecuadas para la instalación regular. Esto será confirmado con una visita técnica.*";
  currentY = drawJustifiedText(doc, textoCondicion, indent + 3, currentY + 5, 170, 5, 9);

  return currentY;
}