import { verificarSaltoDePagina } from "../../../componentes/pagina";
import { renderTextoConNegrita } from "../../../../../../utils/pdf/drawJustifiedText";

export async function renderNotasColganteBasico(doc, data, currentY) {
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
    "3° El tiempo mínimo de alquiler es 30 días naturales. No existe posibilidad de descuento por no usar el material. Desde el día 31 se facturará diario.",
    "4° Esta oferta tiene un tiempo de validez de 15 días, y fue elaborada en base a los documentos enviados por el Cliente.",
    "5° Incluye el servicio de transporte de entrega y recojo dentro de Lima Metropolitana. No incluye carga ni descarga en obra.",
    "6° Incluye 2 líneas de vida de 70 m y 2 frenos de soga por andamio alquilado.",
    "7° Se entrega documentación del andamio colgante eléctrico.",
    "8° El equipo requiere conexión trifásica 220V, diferencial 300 mA, breaker 20A y toma a tierra. Este sistema debe ser aportado por el Cliente.",
    "9° Montaje/desmontaje/movimientos/traslados realizados por el Cliente, quien declara conocer el uso y armado del equipo.",
    "10° La devolución debe realizarse con participación del Cliente en el conteo y chequeo. Si no envía personal, se considerará válido el conteo hecho por Innova.",
    "11° El estado de devolución se verificará en el almacén de INNOVA. Se comunicará cualquier falla mediante informe técnico.",
    "12° Si no se devuelve alguna línea de vida o freno, se facturará a S/ 100 + IGV por unidad al mes.",
    "13° El horario de atención del almacén es de lunes a viernes de 8:00 a.m. a 12:00 p.m. y de 1:00 p.m. a 5:00 p.m.",
    "14° Relación de cuentas para depósito o transferencia:"
  ];

  for (const texto of condiciones) {
    const bloques = doc.splitTextToSize(texto, maxWidth);
    for (const linea of bloques) {
      await verificarSaltoDePagina(doc, currentY, data, lineHeight);
      renderTextoConNegrita(doc, linea, indent, currentY);
      currentY += lineHeight;
    }
    currentY += 1;
  }

  return currentY;
}