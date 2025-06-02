import generarHeader from "../../componentes/header";
import generarFooter from "../../componentes/footer";
import {renderImagenCuentas} from "../../componentes/imagenCuentas";
import {renderTextoTransporte} from "../../componentes/textoTransporte";
import {renderNotas} from "./notas";
import { generarCuerpoAndamioTrabajo } from "./cuerpo";
import { renderFondoPDF } from "../../componentes/fondoPDF";

export default async function generarPDFAndamio(doc, data) {
  // Inserta fondo antes de cualquier contenido en cada pagina
  await renderFondoPDF(doc);
  
  generarHeader(doc, data); // Siempre fijo arriba en la primera página

  let currentY = 50;

  currentY = await generarCuerpoAndamioTrabajo(doc, data, currentY); // Genera el cuerpo del PDF para andamio de trabajo

  // ↓ Texto transporte solo si aplica
  currentY = await renderTextoTransporte(doc, data, currentY);

  // ↓ Notas dinámicas para andamio de trabajo
  currentY = await renderNotas(doc, data, currentY);

  // ↓ Imagen de cuentas según filial 
  currentY = await renderImagenCuentas(doc, data, currentY);

  // Al final del renderizado (después de todo)
  const totalPaginas = doc.getNumberOfPages();
  
   for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    generarFooter(doc, data, i, totalPaginas); // Siempre fijo abajo en la primera página y en las siguientes
  }
}