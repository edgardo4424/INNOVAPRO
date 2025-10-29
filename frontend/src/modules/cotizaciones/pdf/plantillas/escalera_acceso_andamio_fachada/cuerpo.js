import { verificarSaltoDePagina } from "../../componentes/pagina";
import { drawJustifiedText, renderTextoConNegrita } from "../../../../../utils/pdf/drawJustifiedText";

export async function generarCuerpoEscaleraAcceso(doc, data, startY = 120) {
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

  // 🧮 Días de alquiler
  const cantidad_dias = data.cotizacion?.tiempo_alquiler_dias === 1 ? "día" : "días";

  currentY += 6;

  for (const zona of data.zonas || []) {
    const zonaTitulo = `Zona ${zona.zona || "1"} - ${zona.nota_zona || "(DESCRIPCIÓN DE ZONA INDEFINIDA)"}`;
    currentY = drawJustifiedText(doc, `**${zonaTitulo}**`, indent + 3, currentY, 170, 5.5, 10);

    const detallesEscaleras = data.detalles_escaleras || {};
    const detallesZona =
      (detallesEscaleras.escaleras || []).find(z => String(z.zona) === String(zona.zona)) || null;

    const equiposZona = zona.atributos || [];

    for (let i = 0; i < equiposZona.length; i++) {
      const equipo = equiposZona[i];
      
      // --- Tramos POR EQUIPO ---
      const escaleraAcceso = detallesZona?.equipos?.[i] || null;
      const tramo_2m = Number(escaleraAcceso?.tramos_2m || 0);
      const tramo_1m = Number(escaleraAcceso?.tramos_1m || 0);

      let descripcionTramos = "";
      const partes = [];
      if (tramo_2m > 0) partes.push(`${tramo_2m} tramo${tramo_2m > 1 ? "s" : ""} de 2.00 m`);
      if (tramo_1m > 0) partes.push(`${tramo_1m} tramo${tramo_1m > 1 ? "s" : ""} de 1.00 m`);
      if (partes.length) descripcionTramos = ` (${partes.join(" y ")})`;

      // Texto del equipo
      const descripcionEquipo =
        `**CP${data.cotizacion?.cp || "(INDEFINIDO)"}:** ${equipo.cantidad_uso || "(CANTIDAD INDEFINIDA)"} ${equipo.cantidad_uso === 1 ? "Ud." : "Uds."} ` +
        `de ${data.uso?.nombre || "(NOMBRE DE EQUIPO INDEFINIDO)"} de ${equipo.longitud_mm || "(LONGITUD INDEFINIDA)"} m. de longitud ` +
        `x ${equipo.ancho_mm || "(ANCHO INDEFINIDO)"} m. de ancho ` +
        `x ${equipo.altura_m || escaleraAcceso?.alturaTotal || "(ALTURA INDEFINIDA)"} m. de altura + 1.00 m de baranda de seguridad` +
        `${descripcionTramos}.`;

      const palabras = descripcionEquipo.split(/\s+/);
      const aproxLineas = Math.ceil(palabras.length / 11);
      const alturaEstimada = aproxLineas * 5;
      
      currentY += 4;
      currentY = await verificarSaltoDePagina(doc, currentY, alturaEstimada);
      currentY = drawJustifiedText(doc, descripcionEquipo, indent + box + 3, currentY, 170, 5.5, 10);
    }

    currentY += 4; // Espacio entre zonas
  }

  // Resumen de cotización
  const subtituloResumen = `Precio de alquiler: 

  **S/${data.cotizacion?.subtotal_con_descuento_sin_igv || "(PRECIO SIN IGV INDEFINIDO)"} + IGV. por ${data.cotizacion?.tiempo_alquiler_dias || "(INDEFINIDOS DÍAS)"} ${cantidad_dias} calendario.**`;
  currentY = drawJustifiedText(doc, subtituloResumen, indent + 3, currentY, 170, 5.5, 10);


  // Verifica si hay atributos opcionales como pernos de expansión

  if (data.perno_expansion_sin_argolla && data.perno_expansion_sin_argolla?.total !== 0) {
    // ⚙️ PERNOS DE EXPANSIÓN - M16 x 145 
    const tiene_pernos_expansion = data.tiene_pernos || [
      `${data.perno_expansion_sin_argolla?.total || "(CANTIDAD INDEFINIDA DE PERNOS)"} Uds. ${data.perno_expansion_sin_argolla?.nombre || "(TIPO DE PERNO INDEFINIDO)"}: **S/${data.perno_expansion_sin_argolla?.precio_venta_soles || "(PRECIO PERNO INDEFINIDO)"} + IGV.** (En venta por ser consumibles)`
    ];

    currentY += 4;
    for (const linea of tiene_pernos_expansion) {
      const palabras = linea.split(/\s+/);
      const aproxLineas = Math.ceil(palabras.length / 11);
      const alturaEstimada = aproxLineas * 5;

      currentY = await verificarSaltoDePagina(doc, currentY, alturaEstimada);
      currentY = drawJustifiedText(doc, linea, indent + box + 3, currentY, 170, 5.5, 10);
    }
    
  }

  if (data.perno_expansion_con_argolla?.total !== 0) {
    // ⚙️ PERNOS DE EXPANSIÓN - C/Argolla
    const tiene_pernos_expansion = data.tiene_pernos || [
      `${data.perno_expansion_con_argolla?.total || "(CANTIDAD INDEFINIDA DE PERNOS)"} Uds. ${data.perno_expansion_con_argolla?.nombre || "(TIPO DE PERNO INDEFINIDO)"}: **S/${data.perno_expansion_con_argolla?.precio_venta_soles || "(PRECIO PERNO INDEFINIDO)"} + IGV.** (En venta por ser consumibles)`
    ];

    currentY += 4;
    for (const linea of tiene_pernos_expansion) {
      const palabras = linea.split(/\s+/);
      const aproxLineas = Math.ceil(palabras.length / 11);
      const alturaEstimada = aproxLineas * 5;

      currentY = await verificarSaltoDePagina(doc, currentY, alturaEstimada);
      currentY = drawJustifiedText(doc, linea, indent + box + 3, currentY, 170, 5.5, 10);
    }
    
  }

  // ⚙️ Si el andamio de fachada va en volado llevará puntales
  if (data.detalles_puntales?.puntal?.cantidad > 0) {
  const puntal = data.detalles_puntales.puntal;
  const precioArgolla = data.detalles_puntales.piezaVentaArgolla || "(PRECIO ARGOLLA INDEFINIDO)";
  const precioPasador = data.detalles_puntales.piezaVentaPinPresion || "(PRECIO PASADOR INDEFINIDO)";
  const cantidad_dias = data.cotizacion?.tiempo_alquiler_dias === 1 ? "día" : "días";

  currentY += 5;

  // 🧱 Sección título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Detalle de alquiler de puntales:", indent + 3, currentY);
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
  doc.text(`S/ ${parseFloat(puntal.subtotal_alquiler_soles).toFixed(2)} + IGV`, indent + 95, currentY);
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
