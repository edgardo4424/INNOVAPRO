import generarHeader from "../../componentes/header";
import generarFooter from "../../componentes/footer";
import {renderImagenCuentas} from "../../componentes/imagenCuentas";
import {renderTextoTransporte} from "../../componentes/textoTransporte";
import {renderNotas} from "./notas";
import { generarCuerpoPuntales } from "./cuerpo";
import { renderFondoPDF } from "../../componentes/fondoPDF";

export default async function generarPDFAndamio(doc, data) {
  // Inserta fondo antes de cualquier contenido en cada pagina
  await renderFondoPDF(doc);
  
  generarHeader(doc, data); // Siempre

  let currentY = 50;

  currentY = generarCuerpoPuntales(doc, data, currentY);

  // ↓ Texto transporte solo si aplica
  currentY = renderTextoTransporte(doc, data, currentY);

  // ↓ Notas dinámicas para andamio
  currentY = renderNotas(doc, data, currentY);

  // ↓ Imagen de cuentas según filial
  currentY = await renderImagenCuentas(doc, data, currentY);

  generarFooter(doc, data); // Siempre
}