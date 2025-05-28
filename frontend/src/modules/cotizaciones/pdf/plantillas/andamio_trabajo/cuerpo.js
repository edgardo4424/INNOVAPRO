export function generarCuerpoAndamioTrabajo(doc, data, startY = 120) {
  let currentY = startY;

  // 📌 Título
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  const titulo = `COTIZACIÓN DE ${data.tipo_servicio} DE MATERIAL`;
  const textWidth = doc.getTextWidth(titulo);
  const x = (210 - textWidth) / 2;
  doc.text(titulo.toUpperCase(), x, currentY);
  doc.line(x, currentY + 1.5, x + textWidth, currentY + 1.5);

  currentY += 10;

  const indent = 20;
  const box = 2.5;

  // ✅ Servicio de alquiler
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(indent, currentY - box + 0.5, box, box);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(
    "Servicio de " + (data.tipo_servicio || "Alquiler/Venta") + ":",
    indent + box + 3,
    currentY + 0.5
  );
  doc.line(indent + box + 3, currentY + 1.5, indent + box + 31, currentY + 1.5);

  // 🧮 Cantidad de equipos
  const cantidad_equipos = data.cantidad_uso === 1 ? "Ud." : "Uds.";

  // 🧮 Días de alquiler
  const cantidad_dias = data.dias_alquiler === "1" ? "día" : "días";

  // ⚙️ Detalles cotización
  const detalles = data.detalles_alquiler || [
    `CP${data.cp || "(INDEFINIDO)"}: ${data.cantidad_uso || "(INDEFINIDO NÚMERO DE EQUIPOS)"} ${cantidad_equipos} De ${data.tipo_uso || "(INDEFINIDO USO DE EQUIPO)"} de ${data.atributos?.longitud_mm || "(LONGITUD INDEFINIDA)"} m. de longitud x ${data.atributos?.ancho_mm || "(ANCHO INDEFINIDO)"} m. de ancho x ${data.atributos?.altura_m || "(ALTURA INDEFINIDA)"}.00 m. de altura + 1.00 m de baranda de seguridad: S/${data.cotizacion?.subtotal_con_descuento_sin_igv || "(PRECIO SIN IGV INDEFINIDO)"} + IGV. por ${data.dias_alquiler || "(INDEFINIDOS DÍAS)"} ${cantidad_dias} calendario.`
  ];

  currentY += 6;
  detalles.forEach(linea => {
    const split = doc.splitTextToSize(linea, 170);
    doc.text(split, indent + box + 3, currentY);
    currentY += split.length * 4;
  });

  return currentY;
}
