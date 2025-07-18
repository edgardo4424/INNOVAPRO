export default function footerCotizacion(doc, data, paginaActual, totalPaginas) {
  // ✅ Footer derecho con datos del comercial
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor("WHITE");
  doc.text("Comercial: " + (data.usuario?.nombre || "-"), 115, 274);
  doc.text("          Telf.: " + (data.usuario?.telefono || "(INDEFINIDO NÚMERO DE TELÉFONO)"), 115, 278);
  doc.text("       E-mail: " + (data.usuario?.correo || "-"), 115, 282);

  // 🔘 Número de página (derecha abajo)
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text(`Página ${paginaActual} de ${totalPaginas}`, 180, 292);

  // ✅ Footer izquierdo con datos de la filial
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text((data.filial?.razon_social || "-"), 10, 272);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text((data.filial?.ruc || "-"), 26, 278 - 0.5);
};