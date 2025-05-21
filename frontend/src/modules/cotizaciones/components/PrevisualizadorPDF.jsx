import { useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import fondo from "../assets/PlantillaIMG.png";
import cuenta from "../assets/cuentas_IR.png";

export default function PrevisualizadorPDF({ cotizacion }) {
  const iframeRef = useRef();

  useEffect(() => {
    if (!cotizacion) return;

    const generarPDF = async () => {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const img = new Image();
      img.src = fondo;

      img.onload = () => {
        doc.addImage(img, "PNG", 0, 0, 210, 297);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.text("Ref. cotización: IR-COT-COM-AM-0011_2", 87, 16, );
        doc.text("Dirección obra: " , 87, 19);
        doc.text("Proyecto: " + (cotizacion.obra?.nombre), 87, 22);
        doc.text("Fecha: " + new Date(cotizacion.createdAt).toLocaleDateString("es-PE"), 87, 25);

        doc.text("Razón Social: " + (cotizacion.cliente?.razon_social || "-"), 147, 16);
        doc.text("RUC: 20156245874", 147, 19);
        doc.text("A/A: " + (cotizacion.contacto?.nombre || "-"), 147, 22);
        doc.text("Domicilio Fiscal: Av. Benavides 1579 - OFICINA 601 - MIRAFLORES - LIMA - LIMA", 147, 25);
        doc.text("Email: correo@grupoinnova.pe", 147, 28);

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        const titulo = "COTIZACIÓN DE ALQUILER DE MATERIAL";
        const textWidth = doc.getTextWidth(titulo);
        const x = (210 - textWidth) / 2;
        doc.text(titulo, x, 55);
        doc.line(x, 56.5, x + textWidth, 56);

        //servicios de la cotizacion
        const y = 70;
        const cuadradoSize = 2.5;
        const marginLeft = 20;

        // Dibujar cuadrado (checkbox vacío)
        doc.setDrawColor(0); // color de borde
        doc.setLineWidth(0.3);
        doc.rect(marginLeft, y - cuadradoSize + 0.5, cuadradoSize, cuadradoSize);

        // Servicio especifico
        const servicio =  "Servicio de " + cotizacion.tipo_cotizacion +":";
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text(servicio, marginLeft + cuadradoSize + 3, y + 0.5);
        doc.setLineWidth(0.1);
        doc.line(marginLeft + cuadradoSize + 3, y + 1.5, marginLeft + cuadradoSize + 31, y + 1.5);

        const detalles_cotizacion = [
            "CP0: 2 Uds. De Andamio de trabajo fijo de 3.072 m. de longitud x 1.090 m. de ancho x 2.00 m. de altura + 1.00 m",
            "de baranda de seguridad: S/742.48 + IGV. por 30 días calendario."
        ]

        let y5 = 76; // Altura inicial
        const marginLeft5 = 20 + cuadradoSize + 3;
        const maxWidth5 = 170; // A4 = 210 mm, menos márgenes

        detalles_cotizacion.forEach(linea => {
            const splitText = doc.splitTextToSize(linea, maxWidth5);
            doc.text(splitText, marginLeft5, y5);
        
            const espacioEntreLineas = 4;
            const espacioEntreItems = 1;
        
            // Si la línea empieza con número + "°", se asume que es un nuevo ítem
            if (/^\d+°/.test(linea)) {
            y5 += splitText.length * espacioEntreLineas + espacioEntreItems;
            } else {
            y5 += splitText.length * espacioEntreLineas;
            }
            doc.setFont("helvetica", "normal");
        });

        // Servicio de transporte
        const y2 = 90;
        const cuadradoSize2 = 2.5;
        const marginLeft2 = 20;

        // Dibujar cuadrado (checkbox vacío)
        doc.setDrawColor(0); // color de borde
        doc.setLineWidth(0.3);
        doc.rect(marginLeft2, y2 - cuadradoSize2 + 0.5, cuadradoSize2, cuadradoSize2);

        // Servicio especifico
        const servicio_transporte =  "Servicio de Transporte: (OPCIONAL)";
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text(servicio_transporte, marginLeft2 + cuadradoSize2 + 3, y2 + 0.5);
        doc.setLineWidth(0.1);
        doc.line(marginLeft2 + cuadradoSize2 + 3, y2 + 1.5, marginLeft2 + cuadradoSize2 + 31, y2 + 1.5);

        const detalles_transporte = [
            "Transporte de ENTREGA: S/350 + IGV.",
            "Transporte de DEVOLUCIÓN: S/350 + IGV. (Siempre y cuando el servicio se realice en un solo flete)"
        ]

        let y6 = 95; // Altura inicial
        const marginLeft6 = 20 + cuadradoSize2 + 3;
        const maxWidth6 = 170; // A4 = 210 mm, menos márgenes

        detalles_transporte.forEach(linea => {
            const splitText = doc.splitTextToSize(linea, maxWidth6);
            doc.text(splitText, marginLeft6, y6);
        
            const espacioEntreLineas = 4;
            const espacioEntreItems = 1;
        
            // Si la línea empieza con número + "°", se asume que es un nuevo ítem
            if (/^\d+°/.test(linea)) {
            y6 += splitText.length * espacioEntreLineas + espacioEntreItems;
            } else {
            y6 += splitText.length * espacioEntreLineas;
            }
            doc.setFont("helvetica", "normal");
        });


        //nota
        let y3 = 110;
        let x3 = 20;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.text("NOTA:", x3, y3);
        doc.setLineWidth(0.3);
        doc.line(x3, y3 + 1.5, x3 + 8, y3 + 1.5);
        x3 += 5;
        y3 += 10;
        
        doc.setFont("helvetica", "bold");

        const condiciones = [
            "1° CONDICIONES DE ALQUILER SUJETO A EVALUACION CREDITICIA.",
            "2° Los precios ofertados NO INCLUYEN I.G.V. (18%).",
            "3° El tiempo mínimo de alquiler es 30 días naturales y no existe la posibilidad de ningún tipo de descuento por no haber utilizado el material durante ese periodo de alquiler. A partir de los 30 días de alquiler, se facturará los días naturales que el material esté en poder del arrendatario.",
            "4° El equipo por suministrar no incluye accesorios consumibles.",
            "5° Esta oferta tiene un tiempo de validez de 15 días, y fue elaborada en base a los documentos enviados por el Cliente.",
            "6° Una vez el Cliente devuelva los equipos a nuestros almacenes, INNOVA RENTAL MAQUINARIA S.A.C. no cobrará la limpieza, reparación o mantenimiento de estos. No incluye reparaciones por ausencia de algún componente del equipo, daños irreversibles que exija cambio al haberse afectado propiedades geométricas, físicas o mecánicas de este.",
            "7° Para la devolución del material la carga en obra es por cuenta del Cliente. El Cliente deberá enviar un encargado de obra al almacén de INNOVA RENTAL MAQUINARIA S.A.C. para la verificación del conteo de piezas, estado del equipo y para dar conformidad, mediante la firma, a la guía de remisión de devolución. En caso de que el cliente no envié personal a realizar el mencionado conteo y revisión del estado del material, se dará por bueno el conteo y revisión del equipo realizados por el personal de INNOVA RENTAL MAQUINARIA S.A.C. en nuestro almacén.",
            "8° El estado del material en la devolución se verificará en el Almacén de INNOVA RENTAL MAQUINARIA S.A.C., ya que es el único lugar donde se pueden revisar a fondo los posibles problemas que tengan las piezas devueltas. Una vez revisado el equipo, en caso de enco ntrar fallas irreparables, será comunicado al cliente mediante un informe técnico. La recepción de estos equipos por parte del transportista de INNOVA RENTAL MAQUINARIA S.A.C. en nuestro taller, para lo cual el Cliente está obligado en enviar a un representante de su empresa para verificar cómo se realiza dicho chequeo. En caso el Cliente no cumpla con la obligación antes mencionada, asumirá todo tipo de responsabilidad que se amerite de dicha ausencia, debido a que INNOVA RENTAL MAQUINARIA S.A.C. no estará obligado a reprogramar ni retrasar la emisión del respectivo informe por el estado de los equipos, ya que las operaciones de descarga en almacén no se pueden detener una vez los camiones ingresan con devoluciones.",
            "9° El horario de atención del Almacén es de lunes a viernes de 8:00 a.m a 12:00 p.m. y de 1:00 p.m. a 5:00 p.m.",
            "10° Relación de cuentas para depósito o transferencia:"
        ];
        
        let y4 = 118; // Altura inicial
        const marginLeft4 = 23;
        const maxWidth4 = 170; // A4 = 210 mm, menos márgenes
        
        
        condiciones.forEach(linea => {
            const splitText = doc.splitTextToSize(linea, maxWidth4);
            doc.text(splitText, marginLeft4, y4);
        
            const espacioEntreLineas = 3.5;
            const espacioEntreItems = 1;
        
            // Si la línea empieza con número + "°", se asume que es un nuevo ítem
            if (/^\d+°/.test(linea)) {
            y4 += splitText.length * espacioEntreLineas + espacioEntreItems;
            } else {
            y4 += splitText.length * espacioEntreLineas;
            }
            doc.setFont("helvetica", "normal");
        });

        const cuentasImg = new Image();
        cuentasImg.src = cuenta;
        cuentasImg.onload = () => {
            doc.addImage(cuentasImg, "PNG", 25, y4-2, 145, 45); // Ajusta posición y tamaño
            const blob = doc.output("blob");
            const url = URL.createObjectURL(blob);
            iframeRef.current.src = url;
        };


        // Pie de página

        doc.text("Comercial: " + (cotizacion.usuario?.nombre || "-"), 115, 274);
        doc.text("Telf.: " + (cotizacion.usuario?.telefono || "-"), 115, 278);
        doc.text("E-mail: " + (cotizacion.usuario?.email || "-"), 115, 282);

        // Paginación

        doc.setFontSize(7);
        doc.text("Página 1 | 1", 180, 292);



        const blob = doc.output("blob");
        const url = URL.createObjectURL(blob);
        iframeRef.current.src = url;
      };
    };

    generarPDF();
  }, [cotizacion]);

  return (
    <div style={{ border: "1px solid #ccc", marginTop: "2rem" }}>
      <h4 style={{ textAlign: "center" }}>Previsualización del PDF</h4>
      <iframe
        ref={iframeRef}
        width="100%"
        height="800px"
        style={{ border: "none" }}
        title="Vista previa del PDF"
      ></iframe>
    </div>
  );
}