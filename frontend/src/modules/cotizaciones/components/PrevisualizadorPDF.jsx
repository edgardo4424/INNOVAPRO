import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import fondo from "../assets/PlantillaIMG.png";
import cuenta from "../assets/cuentas_IR.png";
import { obtenerDatosPDF } from "../services/cotizacionesService";

export default function PrevisualizadorPDF({ cotizacionId }) {
  const iframeRef = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!cotizacionId) return;

    const cargarDatos = async () => {
      try {
        const cotizacion = await obtenerDatosPDF(cotizacionId);
        setData(cotizacion);
      } catch (error) {
        console.error("❌ Error al cargar los datos de la cotización:", error);
      }
    };
    cargarDatos();
  }, [cotizacionId]);

  useEffect(() => {
    if (!data) return;

    const generarPDF = async () => {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const img = new Image();
      img.src = fondo;

      img.onload = () => {
        doc.addImage(img, "PNG", 0, 0, 210, 297);

        const lh = 3;
        let currentY = 16;
        let colLeftX = 87;
        let colRightX = 147;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        
        console.log(cotizacionId)
        console.log(data)
        

        // Columna izquierda
        doc.text(`Ref. cotización: IR-COT-COM-AM-00${cotizacionId}`, colLeftX, currentY); currentY += lh;
        if (data.obra?.direccion) {
          const direccionSplit = doc.splitTextToSize("Dirección obra: " + data.obra.direccion, 55);
          doc.text(direccionSplit, colLeftX, currentY);
          currentY += direccionSplit.length * lh;
        }
        if (data.obra?.nombre) {
          const proyectoSplit = doc.splitTextToSize("Dirección obra: " + data.obra.nombre, 55);
          doc.text(proyectoSplit, colLeftX, currentY);
          currentY += proyectoSplit.length * lh;
        }
        if (data.cotizacion?.fecha) {
          // const fecha = new Date(data.cotizacion?.fecha).toLocaleDateString("es-PE");
          doc.text("Fecha: " + data.cotizacion?.fecha, colLeftX, currentY); currentY += lh;
        }

        // Columna derecha
        let yRight = 16;
        const cliente = data.cliente || {};
        const contacto = data.contacto || {};

        if (cliente.razon_social) {
          const razonSplit = doc.splitTextToSize("Razón Social: " + cliente.razon_social, 55);
          doc.text(razonSplit, colRightX, yRight);
          yRight += razonSplit.length * lh;
        }
        if (cliente.ruc) {
          doc.text("RUC: " + cliente.ruc, colRightX, yRight); yRight += lh;
        }
        if (contacto.nombre) {
          doc.text("A/A: " + contacto.nombre, colRightX, yRight); yRight += lh;
        }
        if (cliente.domicilio_fiscal) {
          const domicilioSplit = doc.splitTextToSize("Domicilio Fiscal: " + cliente.domicilio_fiscal, 55);
          doc.text(domicilioSplit, colRightX, yRight);
          yRight += domicilioSplit.length * lh;
        }
        if (contacto.correo) {
          const emailSplit = doc.splitTextToSize("Email: " + contacto.correo, 55);
          doc.text(emailSplit, colRightX, yRight);
          yRight += emailSplit.length * lh;
        }

        // 📌 Título
        currentY = Math.max(currentY, yRight) + 20;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        const titulo = "COTIZACIÓN DE ALQUILER DE MATERIAL";
        const textWidth = doc.getTextWidth(titulo);
        const x = (210 - textWidth) / 2;
        doc.text(titulo, x, currentY);
        doc.line(x, currentY + 1.5, x + textWidth, currentY + 1.5);

        currentY += 10;

        const indent = 20;
        const box = 2.5;

        // ✅ Servicio de alquiler
        doc.setDrawColor(0);
        doc.setLineWidth(0.3);
        doc.rect(indent, currentY - box + 0.5, box, box);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        // Debo pedirle a Luis que agregue el tipo de cotización al endpoint
        doc.text("Servicio de " + (data.tipo_cotizacion || "Alquiler/Venta") + ":", indent + box + 3, currentY + 0.5);
        doc.line(indent + box + 3, currentY + 1.5, indent + box + 31, currentY + 1.5);

        //⚙️ Detalles cotización (placeholder)
        const detalles = data.detalles_alquiler || [
          `CP${data.cp}: ${data.cantidad_uso} Uds. De Andamio de trabajo fijo de ${data.atributos?.longitud_mm} m. de longitud x ${data.atributos?.ancho_mm} m. de ancho x ${data.atributos?.altura_m}.00 m. de altura + 1.00 m`,
          `de baranda de seguridad: S/${data.cotizacion?.subtotal_despiece_sin_igv} + IGV. por 30 días calendario.`
        ];

        // const detalles = data.detalles_alquiler || [
        //   "Sin descripción de alquiler disponible."
        // ];

        currentY += 6;
        detalles.forEach(linea => {
          const split = doc.splitTextToSize(linea, 170);
          doc.text(split, indent + box + 3, currentY);
          currentY += split.length * 4;
        });

        // ✅ Servicio de transporte (condicional)
        if (data.tarifa_transporte && data.detalles_transporte) {
          currentY += 6;
          doc.rect(indent, currentY - box + 0.5, box, box);
          doc.text("Servicio de Transporte: (OPCIONAL)", indent + box + 3, currentY + 0.5);
          doc.line(indent + box + 3, currentY + 1.5, indent + box + 31, currentY + 1.5);
          currentY += 6;
          data.detalles_transporte.forEach(linea => {
            const split = doc.splitTextToSize(linea, 170);
            doc.text(split, indent + box + 3, currentY);
            currentY += split.length * 4;
          });
        }

        currentY += 6;
          doc.rect(indent, currentY - box + 0.5, box, box);
          doc.text("Servicio de Transporte: (OPCIONAL)", indent + box + 3, currentY + 0.5);
          doc.line(indent + box + 3, currentY + 1.5, indent + box + 31, currentY + 1.5);
          currentY += 6;
        const transporte = [
            "Transporte de ENTREGA: S/350 + IGV.",
            "Transporte de DEVOLUCIÓN: S/350 + IGV. (Siempre y cuando el servicio se realice en un solo flete)"
          ];
          currentY += 6;
          transporte.forEach(linea => {
            const split = doc.splitTextToSize(linea, 170);
            doc.text(split, indent + box + 3, currentY);
            currentY += split.length * 4;
          });

        // ✅ NOTA + Condiciones
        currentY += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text("NOTA:", indent, currentY);
        doc.line(indent, currentY + 1.5, indent + 8, currentY + 1.5);
        currentY += 10;

        const condiciones = data.condiciones || [
          "1° CONDICIONES DE ALQUILER SUJETO A EVALUACION CREDITICIA.",
          "2° Los precios ofertados NO INCLUYEN I.G.V. (18%).",
          "3° El tiempo mínimo de alquiler es 30 días naturales y no existe la posibilidad de ningún tipo de descuento por no haber utilizado el material durante ese periodo de alquiler. A partir de los 30 días de alquiler, se facturará los días naturales que el material esté en poder del arrendatario.",
          "4° El equipo por suministrar no incluye accesorios consumibles.",
          "5° Esta oferta tiene un tiempo de validez de 15 días, y fue elaborada en base a los documentos enviados por el Cliente.",
          `6° Una vez el Cliente devuelva los equipos a nuestros almacenes, ${data.filial?.razon_social}. no cobrará la limpieza, reparación o mantenimiento de estos. No incluye reparaciones por ausencia de algún componente del equipo, daños irreversibles que exija cambio al haberse afectado propiedades geométricas, físicas o mecánicas de este.`,
          `7° Para la devolución del material la carga en obra es por cuenta del Cliente. El Cliente deberá enviar un encargado de obra al almacén de ${data.filial?.razon_social}. para la verificación del conteo de piezas, estado del equipo y para dar conformidad, mediante la firma, a la guía de remisión de devolución.`,
          `8° El estado del material en la devolución se verificará en el Almacén de ${data.filial?.razon_social}, ya que es el único lugar donde se pueden revisar a fondo los posibles problemas que tengan las piezas devueltas.`,
          "9° El horario de atención del Almacén es de lunes a viernes de 8:00 a.m a 12:00 p.m. y de 1:00 p.m. a 5:00 p.m.",
          "10° Relación de cuentas para depósito o transferencia:"
        ];

        condiciones.forEach(linea => {
          const split = doc.splitTextToSize(linea, 170);
          doc.text(split, indent + 3, currentY);
          currentY += split.length * 4;
        });

        // ✅ Imagen de cuentas
        const cuentasImg = new Image();
        cuentasImg.src = cuenta;
        cuentasImg.onload = () => {
          doc.addImage(cuentasImg, "PNG", 25, currentY + 2, 145, 45);

          // ✅ Footer derecho
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor("WHITE");
          doc.text("Comercial: " + (data.usuario?.nombre || "-"), 115, 274);
          doc.text("          Telf.: " + (data.usuario?.telefono || "-"), 115, 278);
          doc.text("       E-mail: " + (data.usuario?.correo || "-"), 115, 282);
          doc.text("Página 1 | 1", 180, 292);

          // ✅ Footer izquierdo
          doc.setFontSize(12);
          
          doc.text((data.filial?.razon_social || "-"), 10, 272);
          doc.text((data.filial?.ruc || "-"), 26, 278 - 0.5);

          // Mostrar PDF
          const blob = doc.output("blob");
          const url = URL.createObjectURL(blob);
          iframeRef.current.src = url;
        };
      };
    };

    generarPDF();
  }, [data]);

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