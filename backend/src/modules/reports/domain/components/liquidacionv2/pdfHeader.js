/**
 * Crea un objeto que sera utilizado por la libreria pdfmake
 * para generar un encabezado en un documento PDF
 * @param {Object} options - Opciones para el encabezado
 * @param {string} options.title - T tulo del encabezado
 * @param {string} options.logo - Ruta del logo
 * @returns {Object} - Objeto que sera utilizado por pdfmake para generar el encabezado
 */
/**
 * Crea un objeto que sera utilizado por la libreria pdfmake
 * para generar un encabezado en un documento PDF
 * @param {Object} options - Opciones para el encabezado
 * @param {string} options.title - T tulo del encabezado
 * @param {string} options.logo - Ruta del logo
 * @returns {Object} - Objeto que sera utilizado por pdfmake para generar el encabezado
 */
function pdfHeader({ title, logo }) {
  return {
    table: {
      widths: [80, '*'],  // 80 para logo, el resto para el texto
      body: [
        [
          { image: logo, width: 80, margin: [0, 0, 0, 0] },
          {
            text: title,
            style: "docTypeHeaderCenter",
            alignment: "center",
            margin: [0, 15, 0, 0], // Centrado vertical
          }
        ]
      ]
    },
    layout: "noBorders",
    margin: [0, 0, 0, 20],  // Márgenes exteriores (izq, top, der, bottom)
  };
}
module.exports = { pdfHeader };


