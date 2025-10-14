import generarHeader from "../../componentes/header";
import generarFooter from "../../componentes/footer";
import {renderImagenCuentas} from "../../componentes/imagenCuentas";
import {renderTextoTransporte} from "../../componentes/textoTransporte";
import { renderTextoTransporteVenta } from "../../componentes/textoTransporte_venta";
import {renderNotas} from "./notas";
import {renderNotasVenta} from "../../componentes/notas_venta";
import { renderPiezasAdicionales } from "../../componentes/piezasAdicionales";
import { generarCuerpoPuntales } from "./cuerpo";
import {generarCuerpoPuntalesVenta} from "./cuerpo_venta";
import { renderFondoPDF } from "../../componentes/fondoPDF";

export default async function generarPDFAndamio(doc, data) {
  // Inserta fondo antes de cualquier contenido en cada pagina
  await renderFondoPDF(doc);
  
  generarHeader(doc, data); // Siempre fijo arriba en la primera página

  let currentY = 50;

  if (data.cotizacion?.tipo_servicio === "Venta") {
    // Si es una cotización de venta, usamos el cuerpo específico para venta
    currentY = await generarCuerpoPuntalesVenta(doc, data, currentY); // Genera el cuerpo del PDF para escuadras en venta
    if (data.piezasAdicionales?.length > 0) {
      currentY = await renderPiezasAdicionales(doc, data, currentY);
    }
    currentY = await renderTextoTransporteVenta(doc, data, currentY); // Texto transporte específico para venta
    currentY = await renderNotasVenta(doc, data, currentY); // Notas específicas para venta
  }
  else {
    // Si es una cotización normal, usamos el cuerpo estándar
    currentY = await generarCuerpoPuntales(doc, data, currentY); // Genera el cuerpo del PDF para escuadras
    if (data.piezasAdicionales?.length > 0) {
      currentY = await renderPiezasAdicionales(doc, data, currentY);
    }
    currentY = await renderTextoTransporte(doc, data, currentY); // Texto transporte estándar
    currentY = await renderNotas(doc, data, currentY); // Notas estándar 
  } 

  // ↓ Imagen de cuentas según filial
  currentY = await renderImagenCuentas(doc, data, currentY);

  // Al final del renderizado (después de todo)
  const totalPaginas = doc.getNumberOfPages(); // Acumula el número total de páginas

  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    generarFooter(doc, data, i, totalPaginas); // Siempre fijo abajo en la primera página y en las siguientes
  }

}