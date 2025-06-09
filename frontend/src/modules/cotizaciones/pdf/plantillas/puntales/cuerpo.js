import { verificarSaltoDePagina } from "../../componentes/pagina";
import { drawJustifiedText } from "../../../../../utils/pdf/drawJustifiedText";

export async function generarCuerpoPuntales(doc, data, startY = 120) {
  let currentY = startY;

  // 📌 Título
  const titulo = `COTIZACIÓN DE ${data.cotizacion?.tipo_servicio} DE MATERIAL`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const textWidth = doc.getTextWidth(titulo);
  const x = (210 - textWidth) / 2;
  doc.text(titulo.toUpperCase(), x, currentY);
  doc.setLineWidth(0.5);
  doc.line(x, currentY + 1.2, x + textWidth, currentY + 1.2);

  currentY += 10;

  const indent = 20;
  const box = 2.5;

  // Servicio de alquiler
  currentY = await verificarSaltoDePagina(doc, currentY, 6);
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(indent, currentY - box + 0.5, box, box);
  doc.setFont("helvetica", "normal");
  const subtitulo = "Servicio de " + (data.cotizacion?.tipo_servicio || "Alquiler/Venta") + ":";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(subtitulo, indent + box + 3, currentY + 0.5);
  const subtituloWidth = doc.getTextWidth(subtitulo);
  doc.setLineWidth(0.3);
  doc.line(indent + box + 3, currentY + 1.5, indent + box + 3 + subtituloWidth, currentY + 1.5);

  // 🧮 Cantidad de equipos
  const cantidad_equipos = data.atributos?.cantidad === 1 ? "Ud." : "Uds.";

  // 🧮 Días de alquiler
  const cantidad_dias = data.cotizacion?.tiempo_alquiler_dias === 1 ? "día" : "días";

  // ⚙️ Detalles cotización
  const detalles = data.detalles_alquiler || [
    `**CP${data.cotizacion?.cp || "(INDEFINIDO)"}:** Alquiler de ${data.atributos?.cantidad || "(INDEFINIDO NÚMERO DE PUNTALES)"} ${cantidad_equipos} De ${data.uso.nombre|| "(INDEFINIDO USO DE EQUIPO)"} de ${data.atributos?.tipoPuntal || "(LONGITUD INDEFINIDA)"}: **S/${data.cotizacion?.subtotal_con_descuento_sin_igv || "(PRECIO SIN IGV INDEFINIDO)"} + IGV. por ${data.cotizacion?.tiempo_alquiler_dias || "(INDEFINIDOS DÍAS)"} ${cantidad_dias} calendario.**
    
    *Cuando los puntales se devuelvan incompletos, se cobrará lo siguiente por el material faltante:
        - Por cada argolla, **S/${data.atributos?.precio_argolla || "(PRECIO ARGOLLA INDEFINIDO)"} + IGV.**
        - Por cada pasador, **S/${data.atributos?.precio_pasador || "(PRECIO PASADOR INDEFINIDO)"} + IGV.**`
  ];

  currentY += 6;
  for (const linea of detalles) {
    const palabras = linea.split(/\s+/);
    const aproxLineas = Math.ceil(palabras.length / 11);
    const alturaEstimada = aproxLineas * 5;

    currentY = await verificarSaltoDePagina(doc, currentY, alturaEstimada);
    currentY = drawJustifiedText(doc, linea, indent + box + 3, currentY, 170, 5.5, 10);
  }

  return currentY;
}