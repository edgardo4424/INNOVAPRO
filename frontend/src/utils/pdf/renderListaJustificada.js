// Render de listas numeradas con texto justificado profesional

import { drawJustifiedText } from "./drawJustifiedText";

/**
 * Renderiza una lista con numeración a la izquierda y texto justificado al lado.
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
    const palabras = contenido.split(/\s+/);
    const aproxLineas = Math.ceil(palabras.length / 11);
    const alturaEstimado = aproxLineas * lineHeight + 1.5;

    y = await verificarSaltoDePagina(doc, y, alturaEstimado);

    doc.setFontSize(fontSize);
    doc.text(numero, x + 3, y); // Número

    y = drawJustifiedText(doc, contenido, x + 13, y, maxWidth - 10, lineHeight, fontSize); // Contenido
  }

  return y;
}
