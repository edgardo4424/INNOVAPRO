import {renderFondoPDF} from './fondoPDF.js';
import generarHeader from './header.js';

export async function verificarSaltoDePagina(doc, currentY, data, alturaBloque = 0, margenInferior = 260) { // Verifica si se necesita un salto de página
  if (currentY + alturaBloque > margenInferior) { // Verifica si el bloque actual supera el margen inferior
    doc.addPage(); // Agrega una nueva página si se supera el margen inferior
    await renderFondoPDF(doc); // Fondo nuevo para cada página nueva
    generarHeader(doc, data);  // Header nuevo con datos actualizados
    return 50; // Reinicia currentY justo debajo del encabezado
  }
  return currentY;
}
