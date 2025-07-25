import { verificarSaltoDePagina } from "../../componentes/pagina";
import { drawJustifiedText, renderTextoConNegrita } from "../../../../../utils/pdf/drawJustifiedText";

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
  doc.line(x, currentY + 1.2, x + textWidth + 6, currentY + 1.2);

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

  // 🧮 Días de alquiler
  const cantidad_dias = data.cotizacion?.tiempo_alquiler_dias === 1 ? "día" : "días";

  currentY += 6;

  // ⚙️ Detalles cotización

  for (const zona of data.zonas || []) {
    const zonaTitulo = `Zona ${zona.zona || "1"} - ${zona.nota_zona || "(DESCRIPCIÓN DE ZONA INDEFINIDA)"}`;
    currentY = drawJustifiedText(doc, `**${zonaTitulo}**`, indent + 3, currentY, 170, 5.5, 10);

    // 📋 Encabezado de tabla
    const headerAltura = 6;
    currentY = await verificarSaltoDePagina(doc, currentY, headerAltura);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Tipo Puntal", indent + 4, currentY);
    doc.text("Trípode", indent + 40, currentY);
    doc.text("Cantidad", indent + 65, currentY);
    doc.text("Precio unitario (S/)", indent + 95, currentY);
    doc.text("Subtotal (S/)", indent + 145, currentY);
    

    // 📦 Cuerpo de la tabla
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

    // ✅ Subtotal por zona
    currentY += 5;
    doc.setFont("helvetica", "bold");
    doc.text(`Subtotal Zona ${zona.zona}: S/ ${subtotalZona.toFixed(2)}`, indent + 4, currentY);
    currentY += 6;
  }

  // ✅ Total general de todas las zonas
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
  doc.text(`Total general de alquiler de puntales: S/ ${totalGeneral.toFixed(2)} + IGV. por ${data.cotizacion?.tiempo_alquiler_dias || "(INDEFINIDOS DÍAS)"} ${cantidad_dias} calendario.`, indent + 3, currentY);
  currentY += 10;

  // Si hay trípodes en la cotización renderizamos el siguiente bloque:

  if (data.tripode.total !== 0) {
    currentY = await verificarSaltoDePagina(doc, currentY, 20);

    // Encabezado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Trípodes incluidos en esta cotización:", indent + 3, currentY);
    currentY += 6;

    // Tabla
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Descripción", indent + 4, currentY);
    doc.text("Cantidad", indent + 85, currentY);
    doc.text("Subtotal (S/)", indent + 130, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.text("Trípodes utilizados en todas las zonas", indent + 4, currentY);
    doc.text(`${data.tripode.total}`, indent + 90, currentY);
    doc.text(`S/ ${parseFloat(data.tripode.precio_alquiler_soles).toFixed(2)} + IGV`, indent + 130, currentY);
    currentY += 8;

    // Mensaje aclaratorio
    doc.setFontSize(8);
    const mensaje =
      "*Estos trípodes se consideran parte integral del sistema de apuntalamiento para asegurar la estabilidad estructural. La cantidad total representa la suma utilizada en todas las zonas del proyecto.*";
    currentY = drawJustifiedText(doc, mensaje, indent + 4, currentY, 170, 4.2, 8) + 4;
  }




  // Condiciones para las devoluciones

  const detalles = data.detalles_alquiler || [
    `*Cuando los puntales se devuelvan incompletos, se cobrará lo siguiente por el material faltante:
        - Por cada argolla, **S/${data.atributos_opcionales[0]?.piezaVentaArgolla || "(PRECIO ARGOLLA INDEFINIDO)"} + IGV.**
        - Por cada pasador, **S/${data.atributos_opcionales[0]?.piezaVentaPinPresion || "(PRECIO PASADOR INDEFINIDO)"} + IGV.**`
  ];

  for (const linea of detalles) {
    const lineasSeparadas = linea.split("\n");

    for (const sublinea of lineasSeparadas) {
      currentY = await verificarSaltoDePagina(doc, currentY, 6);
      renderTextoConNegrita(doc, sublinea, indent + box + 3, currentY)
      currentY += 5;
    }
  }
  
  return currentY;
}