function pdfDetalleOtrosDescuentos(descuentos) {
  const body = descuentos.map((d) => [
    d.descripcion,
    { text: d.monto.toFixed(2), alignment: "right" },
  ]);
  return {
    table: {
      widths: ["*", 100],
      body: [
        [{ text: "OTROS DESCUENTOS", colSpan: 2, bold: true }, {}],
        ...body,
      ],
    },
    layout: "lightHorizontalLines",
    margin: [0, 0, 0, 10],
  };
}
module.exports = { pdfDetalleOtrosDescuentos };
