export default function encabezadoCotizacion(doc, data, cotizacionId) {
    const lh = 3;
    let currentY = 16;
    let colLeftX = 87;
    let colRightX = 147;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
        
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

  return Math.max(currentY, yRight);
}