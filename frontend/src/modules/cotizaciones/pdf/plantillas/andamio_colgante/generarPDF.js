import generarHeader from "../../componentes/header";
import generarFooter from "../../componentes/footer";
import { renderImagenCuentas } from "../../componentes/imagenCuentas";
import { renderFondoPDF } from "../../componentes/fondoPDF";

// Importa cuerpos de los tres planes
import { generarCuerpoPlanBasico } from "./cuerpos/cuerpo_plan_basico";
import { generarCuerpoPlanIntermedio } from "./cuerpos/cuerpo_plan_intermedio";
import { generarCuerpoPlanIntegral } from "./cuerpos/cuerpo_plan_integral";

// Importa notas de los tres planes
import { renderNotasColganteBasico } from "./notas/notas_colgante_basico";
import { renderNotasColganteIntermedio } from "./notas/notas_colgante_intermedio";
import { renderNotasColganteIntegral } from "./notas/notas_colgante_integral";

export default async function generarPDFColgante(doc, data) {
  await renderFondoPDF(doc);
  generarHeader(doc, data);

  let currentY = 50;

  const plan = data.tipo_plan_colgante?.toUpperCase();

  switch (plan) {
    case "BASICO":
      currentY = await generarCuerpoPlanBasico(doc, data, currentY);
      currentY = await renderNotasColganteBasico(doc, data, currentY);
      break;

    case "INTERMEDIO":
      currentY = await generarCuerpoPlanIntermedio(doc, data, currentY);
      currentY = await renderNotasColganteIntermedio(doc, data, currentY);
      break;

    case "INTEGRAL":
      currentY = await generarCuerpoPlanIntegral(doc, data, currentY);
      currentY = await renderNotasColganteIntegral(doc, data, currentY);
      break;

    default:
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("❌ ERROR: No se ha definido un tipo de plan colgante válido.", 20, currentY + 10);
      break;
  }

  // Imagen de cuentas (siempre al final)
  currentY = await renderImagenCuentas(doc, data, currentY);

  // Footer en cada página
  const totalPaginas = doc.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    generarFooter(doc, data, i, totalPaginas);
  }
}