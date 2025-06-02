export default function footerCotizacion(doc, data, paginaActual, totalPaginas) {
  // ✅ Footer derecho con datos del comercial
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor("WHITE");
  doc.text("Comercial: " + (data.usuario?.nombre || "-"), 115, 274);
  doc.text("          Telf.: " + (data.usuario?.telefono || "(INDEFINIDO NÚMERO DE TELÉFONO)"), 115, 278);
  doc.text("       E-mail: " + (data.usuario?.correo || "-"), 115, 282);
  doc.text(`Página ${paginaActual} | ${totalPaginas}`, 180, 292);

  // ✅ Footer izquierdo con datos de la filial
  doc.setFontSize(12);
  doc.text((data.filial?.razon_social || "-"), 10, 272);
  doc.text((data.filial?.ruc || "-"), 26, 278 - 0.5);
};