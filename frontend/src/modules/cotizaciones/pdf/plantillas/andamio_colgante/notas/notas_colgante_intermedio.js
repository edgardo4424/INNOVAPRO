import { verificarSaltoDePagina } from "../../../componentes/pagina";
import { renderListaJustificada } from "../../../../../../utils/pdf/renderListaJustificada";

export async function renderNotasColganteIntermedio(doc, data, currentY) {
  const indent = 20;
  const maxWidth = 170;
  const lineHeight = 4.5;

  currentY += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("NOTA:", indent, currentY);
  doc.line(indent, currentY + 1.5, indent + 8, currentY + 1.5);
  currentY += 10;

  const condiciones = [
    "1° **CONDICIONES DE ALQUILER SUJETO A EVALUACIÓN CREDITICIA.**",
    "2° Los precios ofertados NO INCLUYEN I.G.V. (18%).",
    "3° El tiempo mínimo de alquiler es 30 días naturales. No existe posibilidad de descuento por no usar el material. Desde el día 31 se facturará diario.",
    "4° Esta oferta tiene un tiempo de validez de 15 días, y fue elaborada en base a los documentos enviados por el Cliente.",
    "5° Incluye transporte de entrega y recojo. Descarga y acarreo del material en obra es por cuenta del Cliente.",
    "6° Incluye 2 líneas de vida de 70 m y 2 frenos de soga por andamio alquilado.",
    "7° Incluye charla de inducción para uso del equipo.",
    "8° Incluye 2 movimientos o traslados por semana con técnico de INNOVA. Adicionales desde S/300 inc. IGV previa coordinación.",
    "9° El equipo requiere conexión trifásica 220V, diferencial 300 mA, breaker 20A y toma a tierra. Esta instalación debe ser provista por el Cliente.",
    "10° Montaje, desmontaje y traslados se realizarán por técnico de INNOVA con mínimo 2 operarios del Cliente. El acarreo sigue siendo responsabilidad del Cliente.",
    "11° Coordinaciones deben hacerse con 48 horas hábiles de antelación. Reprogramaciones tardías tendrán recargo de S/200 + IGV.",
    "12° Se entregará Certificado de Operatividad al finalizar el montaje.",
    "13° Reparación y limpieza incluidos. No cubre faltantes o daños irreversibles.",
    "14° Devolución del equipo requiere presencia del Cliente. Si no asiste, se acepta revisión de Innova como válida.",
    "15° Cualquier daño será comunicado por informe técnico. Recepción por transportista no implica conformidad.",
    "16° Faltantes de frenos o líneas de vida se cobrarán a S/100 + IGV por unidad al mes.",
    "17° Horario de atención del almacén: lunes a viernes de 8:00 a.m. a 1:00 p.m. y de 2:00 p.m. a 5:00 p.m.",
    "18° Relación de cuentas para depósito o transferencia:"
  ];

  // Esta función es anónima y permite que se puedan pasar los datos a la función del salto de página.
  // Sin ésta función se tienen problemas de renderizado de encabezado en documentos con más de una página.
  const saltoConData = async (doc, currentY, alturaBloque, margenInferior) =>
  await verificarSaltoDePagina(doc, currentY, data, alturaBloque, margenInferior);
  
  currentY = await renderListaJustificada({
    doc,
    lista: condiciones,
    x: indent,
    y: currentY,
    maxWidth,
    verificarSaltoDePagina: saltoConData,
    lineHeight: lineHeight + 0.5, 
    fontSize: 8,
  })

  return currentY;
}