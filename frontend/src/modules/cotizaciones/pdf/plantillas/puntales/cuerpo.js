export function generarCuerpoPuntales(doc, data, startY = 120) {
  let currentY = startY;

  // 📌 Título
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  const titulo = `COTIZACIÓN DE ${data.cotizacion?.tipo_servicio} DE MATERIAL`;
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
    "Servicio de " + (data.cotizacion?.tipo_servicio || "Alquiler/Venta") + ":",
    indent + box + 3,
    currentY + 0.5
  );
  doc.line(indent + box + 3, currentY + 1.5, indent + box + 31, currentY + 1.5);

  // 🧮 Cantidad de equipos
  const cantidad_equipos = data.atributos?.cantidad === 1 ? "Ud." : "Uds.";

  // 🧮 Días de alquiler
  const cantidad_dias = data.cotizacion?.tiempo_alquiler_dias === 1 ? "día" : "días";

  // ⚙️ Detalles cotización
  const detalles = data.detalles_alquiler || [
    `CP${data.cotizacion?.cp || "(INDEFINIDO)"}: Alquiler de ${data.atributos?.cantidad || "(INDEFINIDO NÚMERO DE PUNTALES)"} ${cantidad_equipos} De ${data.uso.nombre|| "(INDEFINIDO USO DE EQUIPO)"} de ${data.atributos?.tipoPuntal || "(LONGITUD INDEFINIDA)"}: S/${data.cotizacion?.subtotal_con_descuento_sin_igv || "(PRECIO SIN IGV INDEFINIDO)"} + IGV. por ${data.cotizacion?.tiempo_alquiler_dias || "(INDEFINIDOS DÍAS)"} ${cantidad_dias} calendario.
    
    *Cuando los puntales se devuelvan incompletos, se cobrará lo siguiente por el material faltante:
        - Por cada argolla, S/${data.atributos?.precio_argolla || "(PRECIO ARGOLLA INDEFINIDO)"} + IGV.
        - Por cada pasador, S/${data.atributos?.precio_pasador || "(PRECIO PASADOR INDEFINIDO)"} + IGV.`
  ];

  currentY += 6;
  detalles.forEach(linea => {
    const split = doc.splitTextToSize(linea, 170);
    doc.text(split, indent + box + 3, currentY);
    currentY += split.length * 4;
  });

  return currentY;
}