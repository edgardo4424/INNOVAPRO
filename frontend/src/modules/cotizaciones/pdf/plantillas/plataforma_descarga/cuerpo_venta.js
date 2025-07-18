import { verificarSaltoDePagina } from "../../componentes/pagina";
import { drawJustifiedText } from "../../../../../utils/pdf/drawJustifiedText";

export async function generarCuerpoPlataformaDescargaVenta(doc, data, startY = 120) {
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

  // Título y subtitulo
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

  currentY += 6;

  // ⚙️ Detalles cotización
  for (const zona of data.zonas || []) {
    const zonaTitulo = `Zona ${zona.zona || "1"} - ${zona.nota_zona || "(DESCRIPCIÓN DE ZONA INDEFINIDA)"}`;
    currentY = drawJustifiedText(doc, `**${zonaTitulo}**`, indent + 3, currentY, 170, 5.5, 10);

    for (const equipo of zona.atributos || []) {
      const descripcionEquipo = `**CP${data.cotizacion?.cp || "(INDEFINIDO)"}:** ${equipo.cantidad_uso || "(CANTIDAD INDEFINIDA)"} ${equipo.cantidad_uso === 1 ? "Ud." : "Uds."} de ${data.uso?.nombre || "(NOMBRE DE EQUIPO INDEFINIDO)"} de ${equipo.capacidad || "(CAPACIDAD INDEFINIDA)"}`;

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
  const subtituloResumen = `Precio de venta:  

  **S/${data.cotizacion?.subtotal_con_descuento_sin_igv || "(PRECIO SIN IGV INDEFINIDO)"} + IGV.**`;
  currentY = drawJustifiedText(doc, subtituloResumen, indent + 3, currentY, 170, 5.5, 10);

  // ⚙️ Si la plataforma de descarga incluye puntales
    if (data.detalles_puntales?.puntal?.cantidad > 0) {
    const puntal = data.detalles_puntales.puntal;
    const precioArgolla = data.detalles_puntales.piezaVentaArgolla || "(PRECIO ARGOLLA INDEFINIDO)";
    const precioPasador = data.detalles_puntales.piezaVentaPinPresion || "(PRECIO PASADOR INDEFINIDO)";
  
    currentY += 5;
  
    // 🧱 Sección título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Detalle de venta de puntales:", indent + 3, currentY);
    currentY += 6;
  
    // 🧾 Detalle tabla
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Descripción", indent + 3, currentY);
    doc.text("Cantidad", indent + 50, currentY);
    doc.text("Subtotal (S/)", indent + 95, currentY);
    currentY += 5;
  
    doc.setFont("helvetica", "normal");
    doc.text(puntal.descripcion || "(DESCRIPCIÓN NO DEFINIDA)", indent + 3, currentY);
    doc.text(`${puntal.cantidad}`, indent + 50, currentY);
    doc.text(`S/ ${parseFloat(puntal.subtotal_venta_soles).toFixed(2)} + IGV`, indent + 95, currentY);
    currentY += 8;
  
    // 🧾 Aclaración de condiciones
    doc.setFontSize(8);
    
      const detalles = data.detalles_alquiler || [
        `*Cuando los puntales se devuelvan incompletos, se cobrará lo siguiente por el material faltante:
            - Por cada argolla, **S/ ${precioArgolla} + IGV.**
            - Por cada pasador, **S/ ${precioPasador} + IGV.**`
      ];
    
      for (const linea of detalles) {
        const lineasSeparadas = linea.split("\n");
    
        for (const sublinea of lineasSeparadas) {
          currentY = await verificarSaltoDePagina(doc, currentY, 6);
          renderTextoConNegrita(doc, sublinea, indent + box + 3, currentY)
          currentY += 5;
        }
      }
  }

  return currentY;
}