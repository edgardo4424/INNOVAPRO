import { verificarSaltoDePagina } from "../../../componentes/pagina";
import { renderListaJustificada } from "../../../../../../utils/pdf/renderListaJustificada";

export async function renderNotasColganteIntegral(doc, data, currentY) {
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
    "2° Los precios ofertados NO INCLUYEN I.G.V.",
    "3° El tiempo mínimo de alquiler es 30 días naturales. Desde el día 31, se facturará por día adicional.",
    "4° Esta oferta tiene validez de 15 días.",
    "5° Incluye transporte de entrega y recojo. Carga y distribución en obra está a cargo de INNOVA.",
    "6° Incluye 2 líneas de vida de 70 m y 2 frenos de soga por andamio alquilado.",
    "7° Incluye charla de inducción para uso del equipo.",
    "8° Incluye 2 movimientos por semana. Movimientos adicionales: S/300 inc. IGV. Traslado dentro del mismo edificio y piso: S/500 inc. IGV.",
    "9° Requiere conexión trifásica 220V, diferencial 300 mA, breaker 20A, y toma a tierra. Instalación provista por el Cliente.",
    "10° Montaje, desmontaje y traslados serán realizados por el equipo técnico de INNOVA previa coordinación con el Cliente.",
    "11° Coordinaciones deben hacerse con 48h de antelación. Reprogramaciones tardías tendrán recargo de S/200 + IGV.",
    "12° Horarios técnicos: Lun-Vie 7:30 a.m. - 5:00 p.m. / Sábados 7:30 a.m. - 1:00 p.m.",
    "13° Se entregará Certificado de Operatividad al finalizar el montaje.",
    "14° Reparación y limpieza incluidos. No incluye faltantes o daños irreversibles.",
    "15° El Cliente debe participar en el conteo y revisión en almacén. Si no asiste, se valida la revisión realizada por INNOVA.",
    "16° Faltantes de frenos o líneas de vida: S/100 + IGV por unidad al mes.",
    "17° Horario de almacén: Lun-Vie 8:00 a.m. a 12:00 p.m. y 1:00 p.m. a 5:00 p.m.",
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