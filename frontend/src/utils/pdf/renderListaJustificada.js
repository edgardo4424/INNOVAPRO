// Render de listas numeradas con texto justificado profesional

import { drawJustifiedText } from "./drawJustifiedText";

/**
 * Renderiza una lista con numeración a la izquierda y texto justificado al lado.
 * Si el contenido contiene saltos de línea, renderiza subitems con viñetas.
 * 
 * @param {jsPDF} doc - Instancia de jsPDF.
 * @param {Array<string>} lista - Arreglo de strings numerados (ej. "1° Texto...", "2° Texto...")
 * @param {number} x - Margen izquierdo base (ej. 20).
 * @param {number} y - Posición vertical inicial.
 * @param {number} maxWidth - Ancho máximo del texto justificado.
 * @param {Function} verificarSaltoDePagina - Función para evitar corte entre páginas.
 * @param {number} lineHeight - Altura de línea (default: 5).
 * @param {number} fontSize - Tamaño de fuente (default: 8).
 * @returns {Promise<number>} - Retorna el nuevo valor de Y luego de terminar.
 */
export async function renderListaJustificada({
  doc,
  lista,
  x,
  y,
  maxWidth,
  verificarSaltoDePagina,
  lineHeight = 5,
  fontSize = 8,
}) {
  for (const linea of lista) {
    const [numero, ...resto] = linea.trim().split(" ");
    const contenido = resto.join(" ");
    const subBloques = contenido.split("\n");
    
    // Calculamos altura estimada de todo el bloque
    const anchoTexto = maxWidth - 10;
    const textoDividido = doc.splitTextToSize(contenido, anchoTexto);
    const alturaEstimado = textoDividido.length * lineHeight + 3;

    // Verificamos el salto de página antes de renderizar el bloque
    y = await verificarSaltoDePagina(doc, y, alturaEstimado);

    // Render del número
    doc.setFontSize(fontSize);
    doc.text(numero, x + 3, y); // Número

    // Si hay subbloques (párrafos o viñetas)
    for (let i=0; i < subBloques.length; i++) {
      const texto = subBloques[i].trim();
      const esViñeta = texto.startsWith("-");

      const contenidoFinal = esViñeta ? texto : texto;
      const offsetX = i === 0 ? x + 13 : x + 17;
      const widthFinal = i === 0 ? maxWidth - 10 : maxWidth - 14;

      y = drawJustifiedText(doc, contenidoFinal, offsetX, y, widthFinal, lineHeight, fontSize); // Contenido
    }
  }

  return y;
}
