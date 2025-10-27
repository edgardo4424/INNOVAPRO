import { jsPDF } from "jspdf";

function drawTitle(doc, text, y) { doc.setFont("helvetica","bold"); doc.setFontSize(16); doc.text(text, 40, y); }
function drawH(doc, text, y){ doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.text(text, 40, y); doc.setFont("helvetica","normal"); }
function block(doc, text, y, w=515, lh=6){ const lines = doc.splitTextToSize(text||"", w); lines.forEach((ln,i)=>doc.text(40, y+i*lh, ln)); return y+lines.length*lh; }
function kv(doc, k, v, y){ doc.setFont("helvetica","bold"); doc.text(`${k}:`,40,y); doc.setFont("helvetica","normal"); return block(doc, String(v??"—"), y, 455); }

export function generarPDFContrato({ base, contrato, cronograma, garantias, firmas }) {
  const doc = new jsPDF({ unit:"pt", format:"a4" });
  let y = 50;

  drawTitle(doc, "CONTRATO COMERCIAL", y); y += 24;
  y = kv(doc, "N°", contrato?.numero || "—", y); y += 8;
  y = kv(doc, "Vigencia", `${contrato?.vigencia_dias || 0} días`, y) + 10;

  drawH(doc,"Partes", y); y += 14;
  y = kv(doc,"Cliente", `${base?.snapshot?.cliente?.razon_social} (RUC ${base?.snapshot?.cliente?.ruc||"—"})`, y)+6;
  y = kv(doc,"Obra", `${base?.snapshot?.obra?.nombre||"—"} — ${base?.snapshot?.obra?.direccion||""}`, y)+6;
  y = kv(doc,"Filial Innova", `${base?.snapshot?.filial?.razon_social||"—"} (RUC ${base?.snapshot?.filial?.ruc||"—"})`, y)+12;

  drawH(doc,"Condiciones Comerciales", y); y += 14;
  y = kv(doc,"Moneda", contrato?.condiciones_pago?.moneda || "PEN", y)+6;
  y = kv(doc,"Forma de pago", contrato?.condiciones_pago?.forma || "TRANSFERENCIA", y)+6;
  y = kv(doc,"Adelanto", `${contrato?.condiciones_pago?.adelanto_pct||0}%`, y)+6;
  y = kv(doc,"Crédito", `${contrato?.condiciones_pago?.credito_dias||0} días`, y)+12;

  drawH(doc,"Totales (snapshot cotización)", y); y += 14;
  const t = base?.snapshot?.totales || {};
  y = kv(doc,"Subtotal alquiler", `S/ ${t.precio_subtotal_alquiler_soles||"0.00"}`, y)+6;
  y = kv(doc,"IGV", `S/ ${t.igv_soles||"0.00"}`, y)+6;
  y = kv(doc,"Total", `S/ ${t.total_soles||"0.00"}`, y)+10;

  if (y>700){ doc.addPage(); y=50; }
  drawH(doc,"Cláusulas", y); y += 10;
  (contrato?.clausulas||[]).forEach((c,i)=>{ 
    if (y>780){ doc.addPage(); y=50; }
    doc.setFont("helvetica","bold"); doc.text(`${i+1}. ${c.titulo||"Sin título"}`, 40, y); 
    doc.setFont("helvetica","normal"); y += 12; y = block(doc, c.texto||"", y)+6;
  });

  if (y>720){ doc.addPage(); y=50; }
  drawH(doc,"Cronograma de hitos", y); y+=10;
  if (Array.isArray(cronograma)&&cronograma.length){
    cronograma.forEach((h,i)=>{ if(y>780){doc.addPage(); y=50;} y = block(doc, `${i+1}) ${h.titulo||"Hito"} - ${h.fecha||"s/f"} - ${h.porcentaje?`${h.porcentaje}%`:(h.monto?`S/ ${h.monto}`:"")}`, y)+4; if(h.descripcion){ y = block(doc, `   ${h.descripcion}`, y)+4; } });
  } else { y = block(doc,"—",y); }

  if (y>720){ doc.addPage(); y=50; }
  drawH(doc,"Garantías", y); y+=10;
  y = block(doc, `${garantias?.tipo||"NINGUNA"} ${garantias?.monto?`· S/ ${garantias.monto}`:""} ${garantias?.detalle?`· ${garantias.detalle}`:""}`, y)+10;

  if (y>680){ doc.addPage(); y=50; }
  drawH(doc,"Firmas", y); y+=32;
  doc.line(40,y,260,y); doc.line(320,y,540,y); y+=12;
  y = block(doc, `${firmas?.innova?.representante||"________________"}\nDNI ${firmas?.innova?.dni||"—"}\n${firmas?.innova?.razon_social||""}`, y, 220);
  y = block(doc, `${firmas?.cliente?.representante||"________________"}\nDNI ${firmas?.cliente?.dni||"—"}\n${firmas?.cliente?.razon_social||""}`, y-40, 220);
  y += 60; doc.text(`Lugar/Fecha: ${firmas?.lugar_firma||"Lima"} — ${firmas?.fecha_firma||"___/___/____"}`, 40, y);

  return doc;
}

export function descargarPDFContrato(formData) {
  const doc = generarPDFContrato(formData);
  doc.save(`Contrato-${formData?.contrato?.numero||"INNOVA"}.pdf`);
}