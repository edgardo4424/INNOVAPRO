function pdfSeccionRemuneracion({planilla_mensual}) {
  return {
    table: {
      widths: ["*", 100],
      body: [
        [{ text: "REMUNERACIÓN ÚLTIMO MES", colSpan: 2, bold: true }, {}],
        ["DÍAS LABORADOS", { text: planilla_mensual.dias_labor, alignment: "right" }],
        ["MONTO", { text: Number(planilla_mensual.saldo_por_pagar).toFixed(2), alignment: "right" }],
      ],
    },
    layout: "lightHorizontalLines",
    margin: [0, 0, 0, 10],
  };
}
module.exports = { pdfSeccionRemuneracion };
