function lineaHorizontal({ color = '#cccccc', margin = [0, 10, 0, 10] } = {}) {
  return {
    table: {
      widths: ['*'],
      body: [[{ text: '' }]]
    },
    layout: {
      hLineWidth: (i) => (i === 1 ? 1 : 0),
      hLineColor: (i) => (i === 1 ? color : null),
      vLineWidth: () => 0
    },
    margin
  };
}
module.exports = { lineaHorizontal };