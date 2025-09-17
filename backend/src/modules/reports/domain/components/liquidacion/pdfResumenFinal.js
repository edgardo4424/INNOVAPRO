function pdfResumenFinal({total}) {
  return {
    table: {
      widths: ["*", 100],
      body: [
        [
          { text: "TOTAL A PAGAR", bold: true },
          { text: Number(total).toFixed(2), alignment: "right", bold: true },
        ],
      ],
    },
    layout: "lightHorizontalLines",
    margin: [0, 10, 0, 0],
  };
}
module.exports = { pdfResumenFinal };
