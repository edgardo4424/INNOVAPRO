import { verificarSaltoDePagina } from "../../componentes/pagina";
import { drawJustifiedText } from "../../../../../utils/pdf/drawJustifiedText";

export async function generarCuerpoEscuadrasVenta(doc, data, startY = 120) {
  let currentY = startY;

  // 📌 Título
  const titulo = `COTIZACIÓN DE ${data.cotizacion?.tipo_servicio} DE MATERIAL`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const textWidth = doc.getTextWidth(titulo);
  const x = (210 - textWidth) / 2;
  doc.text(titulo.toUpperCase(), x, currentY);
  doc.setLineWidth(0.5);
  doc.line(x, currentY + 1.2, x + textWidth + 6, currentY + 1.2);

  currentY += 10;

  const indent = 20;
  const box = 2.5;

  // Servicio de alquiler
  currentY = await verificarSaltoDePagina(doc, currentY, 6)
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
  const cantidad_equipos = data.uso.cantidad_uso === 1 ? "Ud." : "Uds.";

  // ⚙️ Detalles cotización
  const detalles = data.detalles_venta || [
    `**CP${data.cotizacion?.cp || "(INDEFINIDO)"}:** Venta de ${data.uso.nombre|| "(INDEFINIDO USO DE EQUIPO)"} de ${data.atributos?.sobrecarga} Kg./m2. 
    
    ${cantidad_equipos} De ${data.uso.nombre|| "(INDEFINIDO USO DE EQUIPO)"} de ${data.atributos?.longitud_mm || "(LONGITUD INDEFINIDA)"}m: **S/${data.cotizacion?.subtotal_con_descuento_sin_igv || "(PRECIO SIN IGV INDEFINIDO)"} + IGV.**`
  ];

  currentY += 6;
  for (const linea of detalles) {
    const palabras = linea.split(/\s+/);
    const aproxLineas = Math.ceil(palabras.length / 11);
    const alturaEstimada = aproxLineas * 5;

    currentY = await verificarSaltoDePagina(doc, currentY, alturaEstimada);
    currentY = drawJustifiedText(doc, linea, indent + box + 3, currentY, 170, 5.5, 10);
  }

  if (data.atributos?.tiene_plataformas === true) {
    // ⚙️ PLATAFORMAS DE TRABAJO
    const plataformas_detalles = data.plataformas_detalles || [
      `**CP${data.cotizacion?.cp || "(INDEFINIDO)"}:** Venta de plataformas según modulación: **S/${data.atributos?.precio_plataformas || "(PRECIO PLATAFORMAS INDEFINIDO)"} + IGV.**`
    ];

    currentY += 6;
    for (const linea of plataformas_detalles) {
      const palabras = linea.split(/\s+/);
      const aproxLineas = Math.ceil(palabras.length / 11);
      const alturaEstimada = aproxLineas * 5;

      currentY = await verificarSaltoDePagina(doc, currentY, alturaEstimada);
      currentY = drawJustifiedText(doc, linea, indent + box + 3, currentY, 170, 5.5, 10);
    } 
  }

   if (data.atributos?.tiene_pernos === true) {
    // ⚙️ PERNOS DE EXPANSIÓN - M16 x 145 
    const tiene_pernos_expansion = data.tiene_pernos || [
      `${data.atributos?.cantidad_pernos_expansion || "(CANTIDAD INDEFINIDA DE PERNOS)"} Uds. ${data.atributos?.nombre_perno_expansion || "(TIPO DE PERNO INDEFINIDO)"}: **S/${data.atributos?.precio_perno_expansion || "(PRECIO PERNO INDEFINIDO)"} + IGV.**`
    ];

    currentY += 6;
    for (const linea of tiene_pernos_expansion) {
      const palabras = linea.split(/\s+/);
      const aproxLineas = Math.ceil(palabras.length / 11);
      const alturaEstimada = aproxLineas * 5;

      currentY = await verificarSaltoDePagina(doc, currentY, alturaEstimada);
      currentY = drawJustifiedText(doc, linea, indent + box + 3, currentY, 170, 5.5, 10);
    } 
  }

  return currentY;
}