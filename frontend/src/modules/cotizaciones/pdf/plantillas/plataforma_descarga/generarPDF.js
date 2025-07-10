import generarHeader from "../../componentes/header";
import generarFooter from "../../componentes/footer";
import {renderImagenCuentas} from "../../componentes/imagenCuentas";
import {renderTextoTransporte} from "../../componentes/textoTransporte";
import { renderTextoTransporteVenta } from "../../componentes/textoTransporte_venta";
import {renderNotas} from "./notas";
import { renderNotasVenta } from "../../componentes/notas_venta";
import { renderPiezasAdicionales } from "../../componentes/piezasAdicionales";
import { generarCuerpoPlataformaDescarga } from "./cuerpo";
import { generarCuerpoPlataformaDescargaVenta } from "./cuerpo_venta";
import { renderInstalacion } from "../../componentes/instalacion";
import { renderFondoPDF  } from "../../componentes/fondoPDF";

export default async function generarPDFPlataformaDescarga(doc, data) {
  // Inserta fondo antes de cualquier contenido en cada pagina
  await renderFondoPDF(doc); 

  generarHeader(doc, data); // Siempre fijo arriba en la primera página

  let currentY = 50;
  console.log("generarPDFPlataformaDescarga", data);
  if (data.cotizacion?.tipo_servicio === "Venta") {
    // Si es una cotización de venta, usamos el cuerpo específico para venta
    currentY = await generarCuerpoPlataformaDescargaVenta(doc, data, currentY); // Genera el cuerpo del PDF para andamio de trabajo en venta
    if (data.piezasAdicionales?.length > 0) {
      currentY = await renderPiezasAdicionales(doc, data, currentY);
    }
    currentY = await renderInstalacion(doc, data, currentY); // Renderiza la sección de instalación si existe
    currentY = await renderTextoTransporteVenta(doc, data, currentY); // Texto transporte específico para venta
    currentY = await renderNotasVenta(doc, data, currentY); // Notas específicas para venta
  }
  else {
    // Si es una cotización normal, usamos el cuerpo estándar
    currentY = await generarCuerpoPlataformaDescarga(doc, data, currentY); // Genera el cuerpo del PDF para andamio de trabajo
    if (data.piezasAdicionales?.length > 0) {
      currentY = await renderPiezasAdicionales(doc, data, currentY);
    }
    currentY = await renderInstalacion(doc, data, currentY); // Renderiza la sección de instalación si existe
    currentY = await renderTextoTransporte(doc, data, currentY); // Texto transporte estándar
    currentY = await renderNotas(doc, data, currentY); // Notas estándar
  }

  // ↓ Imagen de cuentas según filial 
  currentY = await renderImagenCuentas(doc, data, currentY);

  // Al final del renderizado (después de todo)
  const totalPaginas = doc.getNumberOfPages();
  
   for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    generarFooter(doc, data, i, totalPaginas); // Siempre fijo abajo en la primera página y en las siguientes
  }
}