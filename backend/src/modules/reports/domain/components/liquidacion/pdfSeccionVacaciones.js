function pdfSeccionVacaciones({vac}) {
  return {
    table: {
      widths: ["*", 100],
      body: [
        [{ text: "VACACIONES TRUNCAS", colSpan: 2, bold: true }, {}],
        ["PERIODO", vac.periodo],
        ["MONTO", { text: vac.monto.toFixed(2), alignment: "right" }],
      ],
    },
    layout: "lightHorizontalLines",
    margin: [0, 0, 0, 10],
  };
}
module.exports = { pdfSeccionVacaciones };
