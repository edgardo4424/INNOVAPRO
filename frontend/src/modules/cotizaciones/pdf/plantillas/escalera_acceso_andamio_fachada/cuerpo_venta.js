import { verificarSaltoDePagina } from "../../componentes/pagina";
import { drawJustifiedText } from "../../../../../utils/pdf/drawJustifiedText";

export async function generarCuerpoEscaleraAccesoVenta(doc, data, startY = 120) {
  let currentY = startY;

  // 📌 Título
  const titulo = `COTIZACIÓN DE ${data.cotizacion?.tipo_servicio} DE MATERIAL`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const textWidth = doc.getTextWidth(titulo);
  const x = (210 - textWidth) / 2;
  doc.text(titulo.toUpperCase(), x, currentY);
  doc.setLineWidth(0.5);
  doc.line(x, currentY + 1.2, x + textWidth +6, currentY + 1.2);

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

  // ⚙️ Detalles cotización
  currentY += 6;

  for (const zona of data.zonas || []) {
    const zonaTitulo = `Zona ${zona.zona || "1"} - ${zona.nota_zona || "(DESCRIPCIÓN DE ZONA INDEFINIDA)"}`;
    currentY = drawJustifiedText(doc, `**${zonaTitulo}**`, indent + 3, currentY, 170, 5.5, 10);

    for (const equipo of zona.atributos || []) {
      const descripcionEquipo = `**CP${data.cotizacion?.cp || "(INDEFINIDO)"}:** ${equipo.cantidad_uso || "(CANTIDAD INDEFINIDA)"} ${equipo.cantidad_uso === 1 ? "Ud." : "Uds."} de ${data.uso?.nombre || "(NOMBRE DE EQUIPO INDEFINIDO)"} de ${equipo.longitud_mm || "(LONGITUD INDEFINIDA)"} m. de longitud x ${equipo.ancho_mm || "(ANCHO INDEFINIDO)"} m. de ancho x ${equipo.altura_m || "(ALTURA INDEFINIDA)"}.00 m. de altura + 1.00 m de baranda de seguridad.`;

      const palabras = descripcionEquipo.split(/\s+/);
      const aproxLineas = Math.ceil(palabras.length / 11);
      const alturaEstimada = aproxLineas * 5;

      currentY = await verificarSaltoDePagina(doc, currentY, alturaEstimada);
      currentY = drawJustifiedText(doc, descripcionEquipo, indent + box + 3, currentY, 170, 5.5, 10);
    }

    currentY += 4; // Espacio entre zonas
  }

    currentY += 2 ; // Espacio antes del resumen de cotización
  // Resumen de cotización
  const subtituloResumen = `** : 

  **S/${data.cotizacion?.subtotal_con_descuento_sin_igv || "(PRECIO SIN IGV INDEFINIDO)"} + IGV.**`;
  currentY = drawJustifiedText(doc, subtituloResumen, indent + 3, currentY, 170, 5.5, 10);


  // Verifica si hay atributos opcionales como pernos de expansión

  if (data.atributos_opcionales?.tiene_pernos === true) {
    // ⚙️ PERNOS DE EXPANSIÓN - M16 x 145 / C/Argolla
    const tiene_pernos_expansion = data.tiene_pernos || [
      `${data.atributos_opcionales?.cantidad_pernos_expansion || "(CANTIDAD INDEFINIDA DE PERNOS)"} Uds. ${data.atributos_opcionales?.nombre_perno_expansion || "(TIPO DE PERNO INDEFINIDO)"}: **S/${data.atributos_opcionales?.precio_perno_expansion || "(PRECIO PERNO INDEFINIDO)"} + IGV.**`
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

  // ⚙️ Si el andamio de fachada va en volado llevará puntales
  if (data.atributos?.tiene_puntales === true) {
    const puntales_detalles = data.puntales_detalles || [
      `**CP${data.cotizacion?.cp || "(INDEFINIDO)"}:** Venta de ${data.atributos?.cantidad || "(INDEFINIDO NÚMERO DE PUNTALES)"} ${cantidad_equipos} De ${data.uso.nombre|| "(INDEFINIDO USO DE EQUIPO)"} de ${data.atributos?.tipoPuntal || "(LONGITUD INDEFINIDA)"}: **S/${data.cotizacion?.subtotal_con_descuento_sin_igv || "(PRECIO SIN IGV INDEFINIDO)"} + IGV.**`
    ];

    currentY += 6;
    for (const linea of puntales_detalles) {
      const palabras = linea.split(/\s+/);
      const aproxLineas = Math.ceil(palabras.length / 11);
      const alturaEstimada = aproxLineas * 5;

      currentY = await verificarSaltoDePagina(doc, currentY, alturaEstimada);
      currentY = drawJustifiedText(doc, linea, indent + box + 3, currentY, 170, 5.5, 10);
    }

}

  return currentY;
}