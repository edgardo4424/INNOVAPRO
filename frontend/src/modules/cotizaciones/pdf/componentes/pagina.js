import {renderFondoPDF} from './fondoPDF.js';
import generarHeader from './header.js';

export async function verificarSaltoDePagina(doc, currentY, data, alturaBloque = 0, margenInferior = 260) {
  if (currentY + alturaBloque > margenInferior) {
    doc.addPage();
    await renderFondoPDF(doc); // Fondo nuevo
    generarHeader(doc, data);  // Header nuevo
    return 50; // Reinicia currentY
  }
  return currentY;
}
