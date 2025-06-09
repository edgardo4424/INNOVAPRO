import { renderListaJustificada } from "../../../../../utils/pdf/renderListaJustificada.js";
import { verificarSaltoDePagina } from "../../componentes/pagina.js";

export async function renderNotas(doc, data, currentY) {
  const indent = 20;
  const maxWidth = 170;
  const lineHeight = 4.5;

  currentY += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("NOTA:", indent, currentY);
  doc.line(indent, currentY + 1.5, indent + 8, currentY + 1.5);
  currentY += 10;

  const condiciones = data.condiciones || [
    "1° **CONDICIONES DE ALQUILER SUJETO A EVALUACION CREDITICIA.**",
    "2° Los precios ofertados NO INCLUYEN I.G.V. (18%).",
    "3° El tiempo mínimo de alquiler es 30 días naturales y no existe la posibilidad de ningún tipo de descuento por no haber utilizado el material durante ese periodo de alquiler. A partir de los 30 días de alquiler, se facturará los días naturales que el material esté en poder del arrendatario.",
    "4° El equipo por suministrar no incluye accesorios consumibles.",
    "5° Esta oferta tiene un tiempo de validez de 15 días, y fue elaborada en base a los documentos enviados por el Cliente.",
    `6° Una vez el Cliente devuelva los equipos a nuestros almacenes, __${data.filial?.razon_social}. no cobrará la limpieza, reparación o mantenimiento de estos.__ No incluye reparaciones por ausencia de algún componente del equipo, daños irreversibles que exija cambio al haberse afectado propiedades geométricas, físicas o mecánicas de este.`,
    `7° Para la devolución del material la carga en obra es por cuenta del Cliente. El Cliente deberá enviar un encargado de obra al almacén de ${data.filial?.razon_social}. para la verificación del conteo de piezas, estado del equipo y para dar conformidad, mediante la firma, a la guía de remisión de devolución.`,
    `8° El estado del material en la devolución se verificará en el Almacén de ${data.filial?.razon_social}, ya que es el único lugar donde se pueden revisar a fondo los posibles problemas que tengan las piezas devueltas.`,
    "9° El horario de atención del Almacén es de lunes a viernes de 8:00 a.m a 12:00 p.m. y de 1:00 p.m. a 5:00 p.m.",
    "10° Relación de cuentas para depósito o transferencia:"
  ];

  currentY = await renderListaJustificada ({
    doc,
    lista: condiciones,
    x: indent,
    y: currentY,
    maxWidth,
    verificarSaltoDePagina,
    lineHeight: lineHeight + 0.5,
    fontSize: 8,
  })
 
  return currentY;
}