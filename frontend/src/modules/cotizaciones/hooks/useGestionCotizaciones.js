import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import fondo from "../assets/PlantillaIMG.png"; 
import * as cotizacionesService from "../services/cotizacionesService";

export function useGestionCotizaciones() {
  const downloadPDF = (cotizacion) => {
    console.log("siberia",cotizacion)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const img = new Image();
    img.src = fondo;

    img.onload = () => {
      doc.addImage(img, 'PNG', 0, 0, 210, 297); 
      doc.setFont("helvetica", "bold"); 
      doc.setFontSize(8);            
      doc.text("Ref. cotización: IR-COT-COM-AM-000" + cotizacion.id, 90, 16); 
      doc.text("Dirección obra: ", 90, 20); 
      doc.text("Proyecto: ", 90, 24); 
      doc.text("Fecha: " + cotizacion.createdAt.slice(0, 9), 90, 28); 



      doc.text("Razón Social:" + cotizacion.cliente.razon_social, 150, 16); 
      doc.text("RUC: ", 150, 20); 
      doc.text("A/A: "+cotizacion.contacto.nombre, 150, 24); 
      doc.text("Domicilio Fiscal: ", 150, 28); 
      doc.text("Email: ", 150, 32); 


      // Titulo de la cotizacion

      doc.setFontSize(11);            
      const titulo = "COTIZACIÓN DE ALQUILER DE MATERIAL";
      const textWidth = doc.getTextWidth(titulo);
      const x = (210 - textWidth) / 2;
      doc.text(titulo, x, 55);
      doc.setLineWidth(0.3);
      doc.line(x, 55 + 1.5, x + textWidth, 55 + 1.5);
      

      //servicios de la cotizacion
      const y = 70;
      const cuadradoSize = 3;
      const marginLeft = 20;

      // Dibujar cuadrado (checkbox vacío)
      doc.setDrawColor(0); // color de borde
      doc.setLineWidth(0.3);
      doc.rect(marginLeft, y - cuadradoSize + 0.5, cuadradoSize, cuadradoSize);

      // Servicio especifico
      const servicio =  "Servicio de " + cotizacion.tipo_cotizacion +":";
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(servicio, marginLeft + cuadradoSize + 3, y);
      doc.setLineWidth(0.3);
      doc.line(marginLeft + cuadradoSize + 3, y + 1.5, marginLeft + cuadradoSize + 31, y + 1.5);


      //nota
      let y3 = 100;
      let x3 = 20;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
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
      
      let y4 = 110; // Altura inicial
      const marginLeft4 = 20;
      const maxWidth4 = 170; // A4 = 210 mm, menos márgenes
      
      
      condiciones.forEach(linea => {
        const splitText = doc.splitTextToSize(linea, maxWidth4);
        doc.text(splitText, marginLeft4, y4);
      
        const espacioEntreLineas = 4;
        const espacioEntreItems = 1;
      
        // Si la línea empieza con número + "°", se asume que es un nuevo ítem
        if (/^\d+°/.test(linea)) {
          y4 += splitText.length * espacioEntreLineas + espacioEntreItems;
        } else {
          y4 += splitText.length * espacioEntreLineas;
        }
        doc.setFont("helvetica", "normal");
      });
      

      
      doc.save("Cotizacion"+cotizacion.id+".pdf");
    };
    
  };


  const [cotizaciones, setCotizaciones] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const cotizacionesPorPagina = 5;

   // 🔄 Cargar cotizaciones al iniciar
   useEffect(() => {
    async function fetchCotizaciones() {
      try {
        const res = await cotizacionesService.obtenerTodos();
        setCotizaciones(res || []);
      } catch (error) {
        console.error("❌ Error al obtener cotizaciones:", error);
        toast.error("Error al cargar cotizaciones");
      }
    }
    fetchCotizaciones();
  }, []);


  const cotizacionesPaginados = cotizaciones.slice(
    (paginaActual - 1) * cotizacionesPorPagina,
    paginaActual * cotizacionesPorPagina
  );

  return {
    cotizacionesPaginados,
    downloadPDF
  };
}
