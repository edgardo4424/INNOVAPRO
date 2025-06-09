import { verificarSaltoDePagina } from "../../componentes/pagina.js";
import { renderListaJustificada } from "../../../../../utils/pdf/renderListaJustificada.js";

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
    `6° Una vez el Cliente devuelva los equipos a nuestros almacenes, ${data.filial?.razon_social}. no cobrará la limpieza, reparación o mantenimiento de estos. No incluye reparaciones por ausencia de algún componente del equipo, daños irreversibles que exija cambio al haberse afectado propiedades geométricas, físicas o mecánicas de este.`,
    `7° Para la devolución del material la carga en obra es por cuenta del Cliente. El Cliente deberá enviar un encargado de obra al almacén de ${data.filial?.razon_social}. para la verificación del conteo de piezas, estado del equipo y para dar conformidad, mediante la firma, a la guía de remisión de devolución. En caso de que el cliente no envié personal a realizar el mencionado conteo y revisión del estado del material, se dará por bueno el conteo y revisión del equipo realizados por el personal de ${data.filial?.razon_social} en nuestro almacén.`,
    `8° El estado del material en la devolución se verificará en el Almacén de ${data.filial?.razon_social}, ya que es el único lugar donde se pueden revisar a fondo los posibles problemas que tengan las piezas devueltas. Una vez revisado el equipo, en caso de encontrar fallas irreparables, será comunicado al cliente mediante un informe técnico. La recepción de estos equipos por parte del transportista de ${data.filial?.razon_social} o del Cliente no implica su correcto estado ya que las observaciones a los mismos serán realizadas por un técnico especialista de ${data.filial?.razon_social} en nuestro taller, para lo cual el Cliente está obligado en enviar a un representante de su empresa para verificar cómo se realiza dicho chequeo. En caso el Cliente no cumpla con la obligación antes mencionada, asumirá todo tipo de responsabilidad que se amerite de dicha ausencia, debido a que ${data.filial?.razon_social}. no estará obligado a reprogramar ni retrasar la emisión del respectivo informe por el estado de los equipos, ya que las operaciones de descarga en almacén no se pueden detener una vez los camiones ingresan con devoluciones.`,
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